import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("Unhandled error:", err);

  // Check for Gemini API errors
  if (err.message?.includes("API key")) {
    return res.status(401).json({
      error: "Invalid API key configuration",
      message: "The Gemini API key is invalid or expired.",
    });
  }

  if (err.message?.includes("quota") || err.message?.includes("rate")) {
    return res.status(429).json({
      error: "Rate limited",
      message: "API rate limit exceeded. Please try again later.",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred.",
  });
}
