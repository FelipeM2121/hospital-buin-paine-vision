import express from "express";
import cors from "cors";
import { config, validateConfig } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import chatRoutes from "./routes/chat";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api", chatRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "hospital-chat-backend",
    timestamp: new Date().toISOString(),
    claude: {
      configured: !!config.anthropicApiKey,
      model: config.claudeModel,
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: true,
    message: "Endpoint no encontrado",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Startup
async function start() {
  try {
    validateConfig();
    console.log("[INFO] Configuration validated");
    console.log("[INFO] Claude model:", config.claudeModel);

    const server = app.listen(config.port, () => {
      console.log(
        `[INFO] Chat backend running on http://localhost:${config.port}`
      );
      console.log(`[INFO] CORS enabled for ${config.corsOrigin}`);
      console.log(`[INFO] Model: ${config.claudeModel}`);
      console.log(`[INFO] Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("[INFO] SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("[INFO] Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("[INFO] SIGINT received, shutting down gracefully");
      server.close(() => {
        console.log("[INFO] Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("[ERROR] Failed to start server:", error);
    process.exit(1);
  }
}

start();
