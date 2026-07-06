import { ChatTab } from "../components/Chat/ChatTab";
import { RAW, SUMMARY, EETT_FILES } from "../data";

export default function ChatPage() {
  return (
    <div style={{ position: "relative" }}>
      <a
        href="/"
        style={{
          position: "absolute",
          top: 12,
          left: 20,
          zIndex: 10,
          fontSize: "12px",
          color: "#9B958E",
          textDecoration: "none",
        }}
      >
        ← Dashboard
      </a>
      <div className="chat-content-wrap">
        <ChatTab data={RAW} summary={SUMMARY} eettFiles={EETT_FILES} />
      </div>
    </div>
  );
}
