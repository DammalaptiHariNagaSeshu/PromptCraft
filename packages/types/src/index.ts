// ─── Variation Types ───────────────────────────────────────

export type VariationType = 'professional' | 'creative' | 'concise' | 'technical';

export interface Variation {
  type: VariationType;
  content: string;
  tokenEstimate: number;
}

// ─── Generation ────────────────────────────────────────────

export interface GenerationRequest {
  prompt: string;
  temperature: number;
  variables?: Record<string, string>;
}

export interface GenerationResponse {
  professional: string;
  creative: string;
  concise: string;
  technical: string;
  metaPrompt: string;
  tokenEstimates: {
    professional: number;
    creative: number;
    concise: number;
    technical: number;
  };
}

// ─── Refinement ────────────────────────────────────────────

export interface RefineRequest {
  originalPrompt: string;
  instruction: string;
  currentVariations: {
    professional: string;
    creative: string;
    concise: string;
    technical: string;
  };
}

export interface RefineResponse {
  professional: string;
  creative: string;
  concise: string;
  technical: string;
  metaPrompt: string;
  tokenEstimates: {
    professional: number;
    creative: number;
    concise: number;
    technical: number;
  };
}

// ─── Enhancement ───────────────────────────────────────────

export interface EnhanceRequest {
  description: string;
}

export interface EnhanceResponse {
  enhanced: string;
}

// ─── SSE Events ────────────────────────────────────────────

export type SSEEventType = 'chunk' | 'complete' | 'error';

export interface SSEEvent {
  type: SSEEventType;
  data?: string;
  result?: GenerationResponse;
  error?: string;
}

// ─── History ───────────────────────────────────────────────

export interface HistoryItem {
  id: string;
  prompt: string;
  variations: {
    professional: string;
    creative: string;
    concise: string;
    technical: string;
  };
  metaPrompt: string;
  temperature: number;
  timestamp: number;
  tags: string[];
  isFavorite: boolean;
}

// ─── Templates ─────────────────────────────────────────────

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  prompt: string;
  variables: string[];
  color: string;
}
