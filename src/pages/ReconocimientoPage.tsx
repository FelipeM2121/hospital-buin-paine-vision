import { RecintoRecognitionTab } from "../components/RecintoRecognitionTab";
import { COLORS } from "../constants/theme";

export default function ReconocimientoPage() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ padding: "16px 24px 0" }}>
        <a
          href="/"
          style={{
            fontSize: "13px",
            color: COLORS.textMuted,
            textDecoration: "none",
          }}
        >
          ← Volver al dashboard
        </a>
      </div>
      <RecintoRecognitionTab />
    </div>
  );
}
