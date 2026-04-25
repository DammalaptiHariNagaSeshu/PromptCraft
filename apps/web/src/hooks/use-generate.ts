"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { apiSSE } from "@/lib/api-client";
import { useGenerationStore } from "@/stores/generation-store";
import { useHistoryStore } from "@/stores/history-store";
import type { GenerationResponse } from "@promptcraft/types";

export function useGenerate() {
  const abortRef = useRef<AbortController | null>(null);
  const {
    prompt,
    temperature,
    variables,
    setIsGenerating,
    setCurrentResult,
    setPreviousResult,
    currentResult,
    setStreamStatus,
  } = useGenerationStore();
  const { addItem } = useHistoryStore();

  const generate = useCallback(() => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    // Abort any ongoing generation
    abortRef.current?.abort();

    // Save previous result for diff comparison
    if (currentResult) {
      setPreviousResult(currentResult);
    }

    setIsGenerating(true);
    setCurrentResult(null);
    setStreamStatus("Connecting...");

    const controller = apiSSE(
      "/api/v1/generate",
      { prompt, temperature, variables },
      (event) => {
        if (event.type === "chunk") {
          setStreamStatus(event.data || "Processing...");
        }
        if (event.type === "complete" && event.result) {
          const result = event.result as GenerationResponse;
          setCurrentResult(result);
          setStreamStatus("");

          // Add to history
          addItem({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            prompt,
            variations: {
              professional: result.professional,
              creative: result.creative,
              concise: result.concise,
              technical: result.technical,
            },
            metaPrompt: result.metaPrompt,
            temperature,
            timestamp: Date.now(),
            tags: generateTags(prompt),
            isFavorite: false,
          });

          toast.success("Prompt variations generated!");
        }
        if (event.type === "error") {
          toast.error(event.error || "Generation failed");
          setStreamStatus("");
        }
      },
      () => {
        setIsGenerating(false);
      },
      (error) => {
        setIsGenerating(false);
        setStreamStatus("");
        toast.error(error.message || "Generation failed");
      }
    );

    abortRef.current = controller;
  }, [prompt, temperature, variables, currentResult, setIsGenerating, setCurrentResult, setPreviousResult, setStreamStatus, addItem]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
    setStreamStatus("");
  }, [setIsGenerating, setStreamStatus]);

  return { generate, abort };
}

function generateTags(prompt: string): string[] {
  const tags: string[] = [];
  const lower = prompt.toLowerCase();

  const tagMap: Record<string, string[]> = {
    marketing: ["marketing", "ad", "campaign", "brand", "copy"],
    coding: ["code", "programming", "function", "api", "debug", "software"],
    academic: ["research", "paper", "study", "analysis", "thesis"],
    creative: ["story", "poem", "creative", "fiction", "narrative"],
    data: ["data", "analytics", "metrics", "dashboard", "report"],
    support: ["customer", "support", "help", "ticket", "service"],
    social: ["social media", "post", "tweet", "instagram", "linkedin"],
    docs: ["documentation", "guide", "tutorial", "readme", "manual"],
  };

  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.push(tag);
    }
  }

  if (tags.length === 0) tags.push("general");
  return tags;
}
