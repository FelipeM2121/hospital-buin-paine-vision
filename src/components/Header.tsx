import { COLORS } from "../constants/theme";
import { TABS } from "./Sidebar";

const TAB_TITLES: Record<string, string> = {
  "Resumen": "Resumen General",
  "Por Piso": "Distribución por Piso",
  "Por Servicio": "Análisis por Servicio",
  "Por Producto": "Top Productos",
  "Por Fecha": "Cronograma de Instalación",
  "Esp. Técnicas": "Especificaciones Técnicas",
  "Control Documento": "Control Documentos",
};

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const activeTabData = TABS.find(t => t.name === activeTab);

  return (
    <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src={`${import.meta.env.BASE_URL}logo-buin-paine.png`}
          alt="Hospital Buin Paine"
          style={{ height: 72, width: "auto", objectFit: "contain", display: "block", flexShrink: 0 }}
        />
        <div>
          <h1 style={{
            fontSize: 30,
            fontWeight: 800,
            margin: 0,
            color: COLORS.text,
            letterSpacing: "-0.5px",
          }}>
            {TAB_TITLES[activeTab] ?? activeTab}
          </h1>
          <p style={{
            fontSize: 13,
            color: COLORS.textMuted,
            margin: "6px 0 0 0",
            fontWeight: 400,
          }}>
            Dashboard Mobiliario No Clínico — Hospital Buin Paine
          </p>
        </div>
      </div>

      <div style={{
        background: `${activeTabData?.color || COLORS.primary}18`,
        color: activeTabData?.color || COLORS.primary,
        padding: "8px 16px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        display: "flex", alignItems: "center", gap: 8,
        border: `1px solid ${activeTabData?.color || COLORS.primary}30`,
      }}>
        <div style={{
          width: 18, height: 18, display: "flex",
          filter: `brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(${activeTab === "Por Servicio" ? "0" : "230"}deg)`,
        }}>
          {activeTabData?.icon}
        </div>
        <span>{activeTab}</span>
      </div>
    </div>
  );
}
