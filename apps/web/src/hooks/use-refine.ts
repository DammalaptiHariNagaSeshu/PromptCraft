"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import { useGenerationStore } from "@/stores/generation-store";
import type { RefineResponse } from "@promptcraft/types";

export function useRefine() {
  const {
    prompt,
    currentResult,
    setCurrentResult,
    setPreviousResult,
    setIsRefining,
  } = useGenerationStore();

  const refine = useCallback(
    async (instruction: string) => {
      if (!currentResult) {
        toast.error("No variations to refine. Generate first!");
        return;
      }

      setIsRefining(true);
      setPreviousResult(currentResult);

      try {
        const result = await apiPost<RefineResponse>("/api/v1/refine", {
          originalPrompt: prompt,
          instruction,
          currentVariations: {
            professional: currentResult.professional,
            creative: currentResult.creative,
            concise: currentResult.concise,
            technical: currentResult.technical,
          },
        });

        setCurrentResult({
          ...result,
          tokenEstimates: result.tokenEstimates,
        });

        toast.success("Variations refined!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Refinement failed"
        );
      } finally {
        setIsRefining(false);
      }
    },
    [prompt, currentResult, setCurrentResult, setPreviousResult, setIsRefining]
  );

  return { refine };
}
