"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import { useGenerationStore } from "@/stores/generation-store";
import type { EnhanceResponse } from "@promptcraft/types";

export function useEnhance() {
  const { prompt, setPrompt } = useGenerationStore();

  const enhance = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Enter a description to enhance");
      return;
    }

    const toastId = toast.loading("Enhancing your description...");

    try {
      const result = await apiPost<EnhanceResponse>("/api/v1/enhance", {
        description: prompt,
      });
      setPrompt(result.enhanced);
      toast.success("Description enhanced!", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enhancement failed",
        { id: toastId }
      );
    }
  }, [prompt, setPrompt]);

  return { enhance };
}
