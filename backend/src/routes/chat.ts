import { Router, Request, Response, NextFunction } from "express";
import { ChatRequest, ChatResponse, ChatMessage } from "../types/chat";
import { claudeService } from "../services/claude.service";
import { contextService } from "../services/context.service";
import { Errors } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

interface Session {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

const sessions = new Map<string, Session>();

// Mock summary data (would come from frontend)
const mockSummary = {
  totalItems: 1973,
  totalUnits: 4456,
  uniqueRooms: 812,
  furnitureTypes: 79,
  floors: 7,
  services: 39,
  suppliers: 3,
  byFamily: {
    Silla: 3233,
    Mesa: 694,
    Otro: 426,
    Mobiliario: 103,
  },
  bySupplier: {
    "MELMAN SPA": 4256,
    ALLMEDICA: 106,
    "COMERCIAL HAGELIN": 94,
  },
  byFloor: {
    "1": 612,
    "2": 547,
    "3": 645,
    "4": 521,
    "5": 598,
    "6": 534,
    "7": 399,
  },
  topServices: [
    { servicio: "Área Clínica", count: 1200 },
    { servicio: "Oficinas Administrativas", count: 456 },
    { servicio: "Servicios Generales", count: 389 },
  ],
};

router.post(
  "/chat",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ChatRequest;

      if (!body.message || typeof body.message !== "string") {
        throw Errors.invalidRequest("El campo 'message' es requerido");
      }

      if (!config.anthropicApiKey) {
        throw Errors.claudeUnavailable();
      }

      const userMessage = contextService.sanitizeUserMessage(body.message);

      // Create or get session
      let sessionId = body.sessionId || uuidv4();
      let session = sessions.get(sessionId);

      if (!session) {
        session = {
          id: sessionId,
          messages: [],
          createdAt: Date.now(),
        };
        sessions.set(sessionId, session);
      }

      // Build context
      const systemPrompt = contextService.buildSystemPrompt();
      const dataContext =
        body.includeContext !== false
          ? contextService.buildDataContext(mockSummary)
          : "";
      const fullSystem = dataContext
        ? `${systemPrompt}\n\n${dataContext}`
        : systemPrompt;

      // Build messages array for Claude (last 6 turns of history)
      const conversationHistory = body.conversationHistory || session.messages;
      const recentHistory = conversationHistory.slice(-6);

      const claudeMessages: { role: "user" | "assistant"; content: string }[] = [
        ...recentHistory.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      // Generate response
      const response = await claudeService.generate(fullSystem, claudeMessages);

      // Calculate tokens (approximate)
      const tokensUsed =
        contextService.countTokensApprox(fullSystem + userMessage) +
        contextService.countTokensApprox(response);

      // Store in session
      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      };

      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      session.messages.push(userMsg, assistantMsg);

      const chatResponse: ChatResponse = {
        id: assistantMsg.id,
        response: response.trim(),
        sessionId,
        tokensUsed,
        model: config.claudeModel,
        timestamp: new Date().toISOString(),
      };

      res.json(chatResponse);
    } catch (error) {
      next(error);
    }
  }
);

// Health check endpoint
router.get("/health", (_req: Request, res: Response) => {
  const hasKey = !!config.anthropicApiKey;
  res.json({
    status: hasKey ? "ok" : "misconfigured",
    model: config.claudeModel,
    configured: hasKey,
  });
});

export default router;

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
