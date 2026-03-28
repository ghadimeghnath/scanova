// src/components/admin/AdminShell.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "◈", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "◫" },
  { href: "/admin/products", label: "Products", icon: "◻" },
  { href: "/admin/experiences", label: "Experiences", icon: "◬" },
  { href: "/admin/analytics", label: "Analytics", icon: "◈" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  function isActive(item) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,235,0.1); border-radius: 2px; }
        a { text-decoration: none; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`} style={{
        width: 220, minHeight: "100vh", flexShrink: 0,
        background: "#0d0d0f",
        borderRight: "1px solid rgba(242,240,235,0.06)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(242,240,235,0.05)" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 6 }}>
            SCANOVA
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: "#F2F0EB", letterSpacing: "0.05em" }}>
            Command Center
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                background: active ? "rgba(0,229,255,0.08)" : "transparent",
                border: active ? "1px solid rgba(0,229,255,0.2)" : "1px solid transparent",
                color: active ? "#00E5FF" : "rgba(242,240,235,0.5)",
                fontSize: 11, letterSpacing: "0.12em", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#F2F0EB"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(242,240,235,0.5)"; }}
              >
                <span style={{ fontSize: 13, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(242,240,235,0.05)" }}>
          <Link href="/" target="_blank" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, marginBottom: 6,
            color: "rgba(242,240,235,0.35)", fontSize: 11, letterSpacing: "0.12em",
          }}>
            <span style={{ fontSize: 13, width: 18, textAlign: "center" }}>↗</span>
            View Site
          </Link>
          <button onClick={handleLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8,
            color: "rgba(255,100,100,0.6)", fontSize: 11, letterSpacing: "0.12em",
            background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#ff8080"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,100,100,0.6)"}
          >
            <span style={{ fontSize: 13, width: 18, textAlign: "center" }}>⊗</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
        display: "none", position: "fixed", top: 16, left: 16, zIndex: 60,
        width: 40, height: 40, background: "#0d0d0f",
        border: "1px solid rgba(242,240,235,0.1)", borderRadius: 8,
        color: "#F2F0EB", fontSize: 16, cursor: "pointer", fontFamily: FONT,
      }} className="mobile-toggle">
        ☰
      </button>

      {/* Main content */}
      <main className="main-content" style={{
        flex: 1, marginLeft: 220, minHeight: "100vh",
        background: "#080808", overflowY: "auto",
      }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </div>
  );
}