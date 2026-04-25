import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { getModel } from "../lib/gemini";
import { REFINEMENT_SYSTEM_PROMPT, buildRefinementPrompt } from "../prompts/refinement";
import { estimateTokens } from "../utils/tokenEstimator";
import { withRetry } from "../utils/retry";

const router: Router = Router();

const refineSchema = z.object({
  originalPrompt: z.string().min(1).max(2000),
  instruction: z.string().min(1).max(500),
  currentVariations: z.object({
    professional: z.string(),
    creative: z.string(),
    concise: z.string(),
    technical: z.string(),
  }),
});

router.post("/", validate(refineSchema), async (req: Request, res: Response) => {
  const { originalPrompt, instruction, currentVariations } = req.body;

  try {
    const model = getModel(0.7);

    const userPrompt = buildRefinementPrompt(originalPrompt, instruction, currentVariations);

    const result = await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { role: "system", parts: [{ text: REFINEMENT_SYSTEM_PROMPT }] },
      });
      return response;
    });

    const text = result.response.text();

    let parsed;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    const responseData = {
      ...parsed,
      tokenEstimates: {
        professional: estimateTokens(parsed.professional || ""),
        creative: estimateTokens(parsed.creative || ""),
        concise: estimateTokens(parsed.concise || ""),
        technical: estimateTokens(parsed.technical || ""),
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error("Refinement error:", error);
    res.status(500).json({
      error: "Refinement failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
