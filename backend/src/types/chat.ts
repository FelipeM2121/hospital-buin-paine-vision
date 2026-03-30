export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  includeContext: boolean;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  id: string;
  response: string;
  sessionId: string;
  tokensUsed: number;
  model: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: boolean;
  message: string;
  code?: string;
  suggestion?: string;
}
