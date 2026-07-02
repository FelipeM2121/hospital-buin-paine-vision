import React, { useRef, useEffect } from "react";
import { ArrowUp, Square, Paperclip, X } from "lucide-react";

export interface ChatImageAttachment {
  dataUrl: string;
  mediaType: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, image?: ChatImageAttachment) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_DIMENSION = 1568; // límite recomendado por Claude vision
const JPEG_QUALITY = 0.85;

function resizeImageFile(file: File): Promise<ChatImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Imagen inválida"));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No se pudo procesar la imagen")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve({ dataUrl, mediaType: "image/jpeg" });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [image, setImage] = React.useState<ChatImageAttachment | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${Math.max(24, newHeight)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || image) && !isLoading && !disabled) {
      onSendMessage(message, image || undefined);
      setMessage("");
      setImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && !disabled) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Solo se permiten imágenes");
      return;
    }
    try {
      setImageError(null);
      const resized = await resizeImageFile(file);
      setImage(resized);
    } catch {
      setImageError("No se pudo procesar la foto");
    }
  };

  const canSend = (message.trim().length > 0 || !!image) && !isLoading && !disabled;

  return (
    <div style={{
      padding: "8px 20px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#f0f6fa",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%", maxWidth: "760px",
        background: "#fff",
        borderRadius: "16px",
        border: focused ? "1px solid #C9623F" : "1px solid #E0DDD7",
        padding: "14px 16px 10px",
        display: "flex", flexDirection: "column",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: focused
          ? "0 0 0 3px rgba(201,98,63,0.10), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {image && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
              <img
                src={image.dataUrl}
                alt="Foto del recinto"
                style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "10px", border: "1px solid #E0DDD7" }}
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                title="Quitar foto"
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#1C1B1A", color: "#fff",
                  border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                }}
              >
                <X size={11} />
              </button>
            </div>
            <span style={{ fontSize: "12.5px", color: "#9B958E" }}>
              Foto del recinto adjunta — se identificará el código automáticamente
            </span>
          </div>
        )}

        {imageError && (
          <div style={{ fontSize: "12.5px", color: "#C9623F", marginBottom: "8px" }}>{imageError}</div>
        )}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={image ? "¿Qué quieres saber de este recinto? (opcional)" : "Pregunta sobre Mobiliario No Clínico…"}
          disabled={isLoading || disabled}
          rows={1}
          style={{
            width: "100%", resize: "none",
            background: "transparent", border: "none", outline: "none",
            fontSize: "15px", lineHeight: "1.6",
            color: "#1C1B1A",
            padding: "0",
            fontFamily: "inherit",
            maxHeight: "180px",
          }}
        />

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Attach photo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar foto del recinto"
              disabled={isLoading || disabled}
              style={{
                width: 30, height: 30,
                borderRadius: "8px",
                border: "none",
                background: image ? "#F5E4DB" : "transparent",
                color: image ? "#C9623F" : "#9B958E",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isLoading || disabled ? "not-allowed" : "pointer",
                transition: "background 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F0EDE8"; e.currentTarget.style.color = "#1C1B1A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = image ? "#F5E4DB" : "transparent"; e.currentTarget.style.color = image ? "#C9623F" : "#9B958E"; }}
            >
              <Paperclip size={16} />
            </button>

            {/* Model badge */}
            <span style={{
              fontSize: "11.5px", color: "#9B958E",
              display: "flex", alignItems: "center", gap: "5px",
              userSelect: "none",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "linear-gradient(135deg, #C9623F, #E8956D)",
                flexShrink: 0,
              }} />
              Claude Sonnet
            </span>
          </div>

          {/* Send / Stop */}
          <button
            type="submit"
            disabled={!canSend && !isLoading}
            style={{
              width: 34, height: 34,
              borderRadius: "10px",
              border: "none",
              background: canSend || isLoading ? "#C9623F" : "#E0DDD7",
              color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: canSend || isLoading ? "pointer" : "not-allowed",
              transition: "background 0.15s, transform 0.1s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (canSend || isLoading) {
                e.currentTarget.style.background = "#B5522F";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (canSend || isLoading) {
                e.currentTarget.style.background = "#C9623F";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {isLoading ? (
              <Square size={14} fill="#fff" strokeWidth={0} />
            ) : (
              <ArrowUp size={17} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </form>

      <div style={{ fontSize: "11px", color: "#C4BFB8", marginTop: "8px", textAlign: "center" }}>
        Los datos provienen del inventario SGD — Hospital Buin Paine
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
