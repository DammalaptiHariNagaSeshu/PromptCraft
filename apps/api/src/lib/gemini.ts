import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";

export const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export function getModel(temperature: number = 0.7) {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature,
      maxOutputTokens: 4096,
    },
  });
}
