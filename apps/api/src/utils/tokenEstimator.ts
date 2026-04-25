/**
 * Rough token estimator — approximates GPT/Gemini tokenization.
 * ~4 chars per token for English text.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Count words and special characters
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  // Approximate: ~0.75 tokens per word, or ~0.25 tokens per char
  return Math.ceil(Math.max(words * 0.75, chars * 0.25));
}
