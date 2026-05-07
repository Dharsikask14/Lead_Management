import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerDocument } from "./docs/swagger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
const allowedOrigins = [env.clientOrigin, "http://127.0.0.1:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Allow any localhost port in development for Vite fallbacks
      if (!env.isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(env.isProduction ? "combined" : "dev"));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Lead Management API is running",
    frontend: "http://localhost:5173",
    docs: "/api/docs",
    health: "/health"
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use(notFound);
app.use(errorHandler);
