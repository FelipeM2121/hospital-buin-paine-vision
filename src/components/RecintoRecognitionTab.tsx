import React, { useRef, useState } from "react";
import axios from "axios";
import { COLORS } from "../constants/theme";
import { RAW } from "../data";

interface RecintoMatch {
  recinto: string;
  zona: string;
  servicio: string;
  piso: number;
}

interface RecognizeResponse {
  recinto: string | null;
  confidence: number;
  raw_ocr_text: string;
  candidates: RecintoMatch[];
}

const VISION_SERVICE_URL =
  (import.meta.env.VITE_VISION_SERVICE_URL as string) || "http://localhost:8000";

// Lista de recintos conocidos, para el selector de confirmación/corrección manual.
const KNOWN_RECINTOS = Array.from(new Set(RAW.map((r) => r.recinto))).sort();

function confidenceColor(score: number): string {
  if (score >= 0.85) return COLORS.green;
  if (score >= 0.6) return COLORS.orange;
  return COLORS.red;
}

export const RecintoRecognitionTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecognizeResponse | null>(null);
  const [confirmedRecinto, setConfirmedRecinto] = useState<string>("");

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setConfirmedRecinto("");
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post<RecognizeResponse>(
        `${VISION_SERVICE_URL}/recognize-recinto`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(data);
      setConfirmedRecinto(data.recinto || "");
    } catch {
      setError(
        "No se pudo contactar el servicio de reconocimiento. Verifica que vision-service esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ color: COLORS.text, fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
        Reconocimiento de Recintos
      </h2>
      <p style={{ color: COLORS.textMuted, fontSize: "13.5px", marginBottom: "20px" }}>
        Sube una foto del letrero de la sala. El sistema lee el código del recinto y lo compara
        contra el inventario conocido — confirma o corrige el resultado antes de usarlo.
      </p>

      <div
        style={{
          border: `2px dashed ${COLORS.border}`,
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          background: COLORS.card,
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        {preview ? (
          <img
            src={preview}
            alt="Foto del letrero"
            style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "8px" }}
          />
        ) : (
          <span style={{ color: COLORS.textMuted, fontSize: "14px" }}>
            Toca para tomar o subir una foto del letrero
          </span>
        )}
      </div>

      {loading && (
        <div style={{ marginTop: "16px", color: COLORS.textMuted, fontSize: "13.5px" }}>
          Analizando foto…
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "#FEF5F2",
            border: "1px solid #F5C6B4",
            borderRadius: "10px",
            color: "#8B3A22",
            fontSize: "13.5px",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px 20px",
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: confidenceColor(result.confidence),
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "13px", color: COLORS.textMuted }}>
              Confianza: {(result.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div style={{ fontSize: "12.5px", color: COLORS.textLight, marginBottom: "12px" }}>
            Texto detectado: "{result.raw_ocr_text || "(sin texto)"}"
          </div>

          <label style={{ fontSize: "13px", color: COLORS.text, fontWeight: 600 }}>
            Recinto (confirma o corrige):
          </label>
          <input
            list="known-recintos"
            value={confirmedRecinto}
            onChange={(e) => setConfirmedRecinto(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: "6px",
              padding: "8px 10px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              fontSize: "14px",
            }}
          />
          <datalist id="known-recintos">
            {KNOWN_RECINTOS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
      )}
    </div>
  );
};
