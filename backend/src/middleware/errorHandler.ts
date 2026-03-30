import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/chat";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[ERROR]", err);

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: true,
      message: err.message,
      code: err.code,
      suggestion: err.suggestion,
    };
    res.status(err.statusCode).json(response);
  } else {
    const response: ErrorResponse = {
      error: true,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
}

// Common error creators
export const Errors = {
  claudeUnavailable: () =>
    new AppError(
      "No se puede conectar al servicio Claude AI",
      503,
      "CLAUDE_UNAVAILABLE",
      "Verifica que ANTHROPIC_API_KEY esté configurado correctamente en .env"
    ),

  invalidRequest: (message: string) =>
    new AppError(message, 400, "INVALID_REQUEST"),

  unauthorized: () =>
    new AppError("No autorizado", 401, "UNAUTHORIZED"),

  timeout: () =>
    new AppError(
      "La solicitud a Claude excedió el tiempo límite",
      504,
      "TIMEOUT",
      "Intente con una pregunta más corta"
    ),
};
