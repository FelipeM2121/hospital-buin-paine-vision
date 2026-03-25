import React from "react";
import { Copy, Check } from "lucide-react";
import { Message } from "./ChatService";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>

        {!isUser && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleCopy}
              className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
              title="Copiar respuesta"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
