const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function apiSSE(
  endpoint: string,
  body: unknown,
  onEvent: (event: { type: string; data?: string; result?: any; error?: string; variation?: string; content?: string }) => void,
  onDone: () => void,
  onError: (error: Error) => void
): AbortController {
  const controller = new AbortController();

  fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const eventData = JSON.parse(line.slice(6));
              onEvent(eventData);
            } catch {
              // Skip malformed events
            }
          }
        }
      }

      onDone();
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        onError(err);
      }
    });

  return controller;
}
