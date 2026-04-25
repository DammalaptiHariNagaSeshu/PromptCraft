import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationResponse } from "@promptcraft/types";

interface GenerationState {
  prompt: string;
  temperature: number;
  variables: Record<string, string>;
  isGenerating: boolean;
  isRefining: boolean;
  currentResult: GenerationResponse | null;
  previousResult: GenerationResponse | null;
  compareMode: boolean;
  selectedVariations: [string, string];
  streamStatus: string;

  setPrompt: (prompt: string) => void;
  setTemperature: (temp: number) => void;
  setVariable: (key: string, value: string) => void;
  setVariables: (vars: Record<string, string>) => void;
  clearVariables: () => void;
  setIsGenerating: (v: boolean) => void;
  setIsRefining: (v: boolean) => void;
  setCurrentResult: (result: GenerationResponse | null) => void;
  setPreviousResult: (result: GenerationResponse | null) => void;
  setCompareMode: (v: boolean) => void;
  setSelectedVariations: (v: [string, string]) => void;
  setStreamStatus: (status: string) => void;
  reset: () => void;
}

const initialState = {
  prompt: "",
  temperature: 0.7,
  variables: {},
  isGenerating: false,
  isRefining: false,
  currentResult: null,
  previousResult: null,
  compareMode: false,
  selectedVariations: ["professional", "creative"] as [string, string],
  streamStatus: "",
};

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set) => ({
      ...initialState,
      setPrompt: (prompt) => set({ prompt }),
      setTemperature: (temperature) => set({ temperature }),
      setVariable: (key, value) =>
        set((state) => ({
          variables: { ...state.variables, [key]: value },
        })),
      setVariables: (variables) => set({ variables }),
      clearVariables: () => set({ variables: {} }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setIsRefining: (isRefining) => set({ isRefining }),
      setCurrentResult: (currentResult) => set({ currentResult }),
      setPreviousResult: (previousResult) => set({ previousResult }),
      setCompareMode: (compareMode) => set({ compareMode }),
      setSelectedVariations: (selectedVariations) => set({ selectedVariations }),
      setStreamStatus: (streamStatus) => set({ streamStatus }),
      reset: () => set(initialState),
    }),
    {
      name: "promptcraft-generation",
      partialize: (state) => ({
        prompt: state.prompt,
        temperature: state.temperature,
        variables: state.variables,
      }),
    }
  )
);
