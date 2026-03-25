import React, { useEffect, useRef } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatService, Message, ChatError } from "./ChatService";
import type { RawItem, SummaryData } from "../../types";

interface ChatTabProps {
  data: RawItem[];
  summary: SummaryData;
}

export const ChatTab: React.FC<ChatTabProps> = ({ data, summary }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<ChatError | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize data engine on mount
  useEffect(() => {
    ChatService.setData(data, summary);
  }, [data, summary]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await ChatService.sendMessage(userMessage);

      if (result.error) {
        setError(result.error);
      } else if (result.response) {
        const assistantMsg: Message = {
          id: result.response.id,
          role: "assistant",
          content: result.response.response,
          timestamp: result.response.timestamp,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      setError({
        error: true,
        message: "Error al procesar la solicitud",
        code: "UNKNOWN_ERROR",
      });
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("¿Deseas limpiar el historial de chat?")) {
      setMessages([]);
      setError(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Asistente IA — Inventario</h2>
          <p className="text-sm text-gray-500">
            Consulta sobre el inventario de muebles del hospital • Motor local
          </p>
        </div>
        <button
          onClick={handleClearChat}
          disabled={messages.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Limpiar historial"
        >
          <Trash2 size={18} />
          <span className="text-sm">Limpiar</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 && !error && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Bienvenido al Asistente de Inventario
              </h3>
              <p className="text-gray-500 max-w-sm">
                Haz preguntas sobre el inventario de muebles del Hospital Buin
                Paine. Puedo ayudarte con:
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>• Cantidad de muebles por tipo (sillas, mesas, etc)</li>
                <li>• Distribución por piso</li>
                <li>• Información por servicio o departamento</li>
                <li>• Detalles de proveedores</li>
                <li>• Fechas de instalación</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  "Resumen general",
                  "¿Cuántas sillas hay?",
                  "Distribución por piso",
                  "Muebles en Urgencia",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900">{error.message}</h4>
                {error.suggestion && (
                  <p className="text-sm text-red-700 mt-1">{error.suggestion}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100 rounded-bl-none">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
