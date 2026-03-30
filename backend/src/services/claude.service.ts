import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";

class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
  }

  async generate(
    systemPrompt: string,
    messages: { role: "user" | "assistant"; content: string }[]
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: config.claudeModel,
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new AppError("Respuesta inesperada de Claude", 500, "UNEXPECTED_RESPONSE");
      }

      return content.text;
    } catch (error) {
      if (error instanceof AppError) throw error;

      const err = error as { status?: number; message?: string };
      if (err.status === 401) {
        throw new AppError(
          "API key de Claude inválida o no configurada",
          503,
          "CLAUDE_AUTH_ERROR",
          "Configura ANTHROPIC_API_KEY en el archivo .env"
        );
      }
      if (err.status === 429) {
        throw new AppError(
          "Límite de uso de Claude alcanzado",
          429,
          "RATE_LIMIT",
          "Espera un momento antes de enviar otra solicitud"
        );
      }

      throw new AppError(
        "Error al comunicarse con Claude",
        503,
        "CLAUDE_ERROR",
        err.message || "Verifica tu ANTHROPIC_API_KEY"
      );
    }
  }
}

export const claudeService = new ClaudeService();
