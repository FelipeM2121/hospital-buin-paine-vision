import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Claude / Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  claudeModel: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",

  // Context limits
  maxContextTokens: parseInt(
    process.env.MAX_CONTEXT_TOKENS || "4000",
    10
  ),
  systemPromptTokens: 200,
  dataContextTokens: 1500,
  conversationTokens: 1500,
  userMessageTokens: 300,

  // Auth
  skipAuth: process.env.SKIP_AUTH === "true",
  azureTenantId: process.env.AZURE_TENANT_ID || "",
  azureClientId: process.env.AZURE_CLIENT_ID || "",
};

export function validateConfig(): void {
  if (!config.anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY is required");
  }
}
