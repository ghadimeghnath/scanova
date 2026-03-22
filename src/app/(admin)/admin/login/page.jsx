// app/admin/login/page.jsx
// ── Simple password login for the admin dashboard ─────────────────────────────
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono','Courier New',monospace",
    }}>
      <div style={{
        width: "100%", maxWidth: 380, padding: "40px 32px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(0,229,255,0.7)", marginBottom: 12 }}>
          SCANOVA · INTERNAL
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display','Georgia',serif",
          fontSize: 26, fontWeight: 400, color: "#fff", margin: "0 0 28px",
        }}>
          Command Center
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            required
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              padding: "13px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#fff", fontSize: 14,
              fontFamily: "'DM Mono',monospace", outline: "none",
              boxSizing: "border-box", width: "100%",
            }}
          />

          {error && (
            <div style={{ color: "#ff8080", fontSize: 12, padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 8 }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#00e5ff,#0072ff)",
              border: "none", borderRadius: 10,
              color: loading ? "rgba(255,255,255,0.3)" : "#000",
              fontSize: 14, fontWeight: 700, letterSpacing: "0.1em",
              fontFamily: "'DM Serif Display','Georgia',serif",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "VERIFYING…" : "ENTER"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
