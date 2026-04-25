import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import generateRouter from "./routes/generate";
import refineRouter from "./routes/refine";
import enhanceRouter from "./routes/enhance";

const app: Express = express();

// ─── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ─── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: { error: "Too many requests. Please try again in a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ─── Logging & Parsing ────────────────────────────────────
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ──────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ 
    message: "PromptCraft API Server is running \uD83D\uDE80", 
    frontend: "Please navigate to http://localhost:3000 to view the application." 
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────────────
app.use("/api/v1/generate", generateRouter);
app.use("/api/v1/refine", refineRouter);
app.use("/api/v1/enhance", enhanceRouter);

// ─── Error Handling ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
const PORT = parseInt(env.PORT, 10);
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 PromptCraft API Server             ║
  ║   Port: ${PORT}                            ║
  ║   Env:  ${env.NODE_ENV.padEnd(20)}       ║
  ║   CORS: ${env.CORS_ORIGIN.padEnd(20)}    ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
