"use client";

import { useMemo } from "react";
import { useGenerationStore } from "@/stores/generation-store";

/**
 * Extract {{variable_name}} patterns from prompt text
 */
export function useVariables() {
  const { prompt, variables, setVariable, clearVariables } = useGenerationStore();

  const detectedVariables = useMemo(() => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(prompt)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [prompt]);

  const allFilled = useMemo(() => {
    return detectedVariables.every(
      (v) => variables[v] && variables[v].trim().length > 0
    );
  }, [detectedVariables, variables]);

  const resolvedPrompt = useMemo(() => {
    let result = prompt;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(`{{${key}}}`, value || `{{${key}}}`);
    }
    return result;
  }, [prompt, variables]);

  return {
    detectedVariables,
    variables,
    setVariable,
    clearVariables,
    allFilled,
    resolvedPrompt,
  };
}
