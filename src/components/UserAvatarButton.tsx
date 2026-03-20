import { useMsal } from "@azure/msal-react";

export function UserAvatarButton() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const initials = account?.name
    ? account.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin + "/hospital-buin-paine-dashboard/" });
  };

  return (
    <div style={{ padding: "8px 0 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        title={account?.name ?? ""}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
          cursor: "default",
        }}
      >
        {initials}
      </div>
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: 4, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0.5, transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}
