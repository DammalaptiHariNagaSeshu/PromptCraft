import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { getModel } from "../lib/gemini";
import { ENHANCE_SYSTEM_PROMPT, buildEnhancePrompt } from "../prompts/enhance";
import { withRetry } from "../utils/retry";

const router: Router = Router();

const enhanceSchema = z.object({
  description: z.string().min(1).max(2000),
});

router.post("/", validate(enhanceSchema), async (req: Request, res: Response) => {
  const { description } = req.body;

  try {
    const model = getModel(0.5);

    const userPrompt = buildEnhancePrompt(description);

    const result = await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { role: "system", parts: [{ text: ENHANCE_SYSTEM_PROMPT }] },
      });
      return response;
    });

    const enhanced = result.response.text().trim();

    res.json({ enhanced });
  } catch (error) {
    console.error("Enhancement error:", error);
    res.status(500).json({
      error: "Enhancement failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
