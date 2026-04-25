import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { getModel } from "../lib/gemini";
import { GENERATION_SYSTEM_PROMPT, buildGenerationPrompt } from "../prompts/generation";
import { estimateTokens } from "../utils/tokenEstimator";
import { withRetry } from "../utils/retry";

const router: Router = Router();

const generateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  temperature: z.number().min(0).max(1).default(0.7),
  variables: z.record(z.string()).optional(),
});

router.post("/", validate(generateSchema), async (req: Request, res: Response) => {
  const { prompt, temperature, variables } = req.body;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const model = getModel(temperature);

    const userPrompt = buildGenerationPrompt(prompt, variables);

    // Send initial event
    res.write(`data: ${JSON.stringify({ type: "chunk", data: "Generating prompt variations..." })}\n\n`);

    const result = await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { role: "system", parts: [{ text: GENERATION_SYSTEM_PROMPT }] },
      });
      return response;
    });

    const text = result.response.text();

    // Try to parse the JSON response
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, create a structured response from raw text
      parsed = {
        professional: text,
        creative: text,
        concise: text,
        technical: text,
        metaPrompt: "The AI response could not be structured into variations. Showing raw output.",
      };
    }

    // Add token estimates
    const responseData = {
      ...parsed,
      tokenEstimates: {
        professional: estimateTokens(parsed.professional || ""),
        creative: estimateTokens(parsed.creative || ""),
        concise: estimateTokens(parsed.concise || ""),
        technical: estimateTokens(parsed.technical || ""),
      },
    };

    // Send progress chunks
    const variations = ["professional", "creative", "concise", "technical"];
    for (const variation of variations) {
      res.write(
        `data: ${JSON.stringify({
          type: "chunk",
          data: `Generated ${variation} variation`,
          variation,
          content: responseData[variation],
        })}\n\n`
      );
      // Small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Send complete event
    res.write(`data: ${JSON.stringify({ type: "complete", result: responseData })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Generation failed";
    res.write(`data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`);
    res.end();
  }
});

export default router;
