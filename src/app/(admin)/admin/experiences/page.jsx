// src/app/(admin)/admin/experiences/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const THEMES = ["love", "celebration", "memory", "achievement", "custom"];

export default function AdminExperiencesPage() {
  const [tab, setTab] = useState("keychains"); // "keychains" | "stickers"
  const [keychains, setKeychains] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showStickerForm, setShowStickerForm] = useState(false);
  const [bulkCount, setBulkCount] = useState("10");
  const [bulkTheme, setBulkTheme] = useState("love");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState([]); // newly generated codes
  const [stickerForm, setStickerForm] = useState({ code: "", targetImage: "", assetUrl: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [qrModal, setQrModal] = useState(null); // code to preview QR

  const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [kRes, sRes] = await Promise.all([
        fetch("/api/experience?type=keychain&limit=100"),
        fetch("/api/sticker-experience?admin=true"),
      ]);
      const kData = kRes.ok ? await kRes.json() : {};
      const sData = sRes.ok ? await sRes.json() : {};
      setKeychains(kData.experiences || []);
      setStickers(sData.experiences || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // ── Bulk keychain generation ─────────────────────────────────────────────
  async function handleBulkGenerate() {
    const count = parseInt(bulkCount);
    if (!count || count < 1 || count > 100) {
      setError("Enter a number between 1 and 100"); return;
    }
    setGenerating(true); setError(""); setGenerated([]);
    try {
      const res = await fetch("/api/keychain-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, theme: bulkTheme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setGenerated(data.codes || []);
      setSuccess(`Generated ${data.codes?.length} QR codes!`);
      await fetchAll();
    } catch (e) { setError(e.message); }
    setGenerating(false);
  }

  // ── Create sticker experience ─────────────────────────────────────────────
  async function handleCreateSticker() {
    if (!stickerForm.code.trim() || !stickerForm.targetImage.trim()) {
      setError("Code and target image URL are required"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/sticker-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stickerForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess("Sticker experience created!");
      setShowStickerForm(false);
      setStickerForm({ code: "", targetImage: "", assetUrl: "", message: "" });
      await fetchAll();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) { setError(e.message); }
    setSaving(false);
  }

  // ── Toggle isActive ───────────────────────────────────────────────────────
  async function toggleKeychain(id, isActive) {
    try {
      await fetch(`/api/experience/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      await fetchAll();
    } catch {}
  }

  async function toggleSticker(id, isActive) {
    try {
      await fetch(`/api/sticker-experience/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      await fetchAll();
    } catch {}
  }

  // ── Download QR codes as SVG ──────────────────────────────────────────────
  function downloadQR(code, type) {
    const url = `${BASE_URL}/${type}/${code}`;
    const svgEl = document.getElementById(`qr-${code}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `scanova-qr-${code}.svg`;
    link.click();
  }

  const filteredKeychains = keychains.filter((k) =>
    !search || k.code.includes(search) || k.theme?.includes(search)
  );
  const filteredStickers = stickers.filter((s) =>
    !search || s.code.includes(search) || s.message?.includes(search)
  );

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(242,240,235,0.04)", border: "1px solid rgba(242,240,235,0.1)",
    borderRadius: 8, color: "#F2F0EB", fontSize: 12, fontFamily: FONT,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 };

  return (
    <div style={{ padding: "32px", fontFamily: FONT, color: "#F2F0EB", maxWidth: 1200 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(242,240,235,0.25); }
        select option { background: #1a1a1f; }
      `}</style>

      {/* QR Preview Modal */}
      {qrModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setQrModal(null)}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 16, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <QRCodeSVG
              id={`qr-${qrModal.code}`}
              value={`${BASE_URL}/${qrModal.type}/${qrModal.code}`}
              size={240} level="H" includeMargin
            />
            <div style={{ marginTop: 16, fontFamily: FONT, fontSize: 11, color: "#333", letterSpacing: "0.15em" }}>
              {qrModal.code}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
              <button onClick={() => downloadQR(qrModal.code, qrModal.type)} style={{
                padding: "10px 20px", background: "#000", border: "none", borderRadius: 8,
                color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: FONT,
              }}>↓ Download SVG</button>
              <button onClick={() => setQrModal(null)} style={{
                padding: "10px 20px", background: "#f0f0f0", border: "none", borderRadius: 8,
                color: "#333", fontSize: 11, cursor: "pointer", fontFamily: FONT,
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 6 }}>AR MANAGEMENT</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300 }}>Experiences</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setShowStickerForm(true); setError(""); }} style={{
            padding: "11px 20px", background: "rgba(242,240,235,0.06)", border: "1px solid rgba(242,240,235,0.12)",
            borderRadius: 40, color: "#F2F0EB", fontSize: 11, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em",
          }}>+ Sticker</button>
          <button onClick={() => { setShowBulkForm(true); setError(""); setGenerated([]); }} style={{
            padding: "11px 20px", background: "#00E5FF", border: "none", borderRadius: 40,
            color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em",
          }}>⊞ Bulk Keychains</button>
        </div>
      </div>

      {success && <div style={{ padding: "12px 16px", background: "rgba(100,200,100,0.08)", border: "1px solid rgba(100,200,100,0.3)", borderRadius: 8, color: "#64c864", fontSize: 12, marginBottom: 20 }}>{success}</div>}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(242,240,235,0.08)" }}>
        {[["keychains", `Keychains (${keychains.length})`], ["stickers", `Stickers (${stickers.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "12px 24px", background: "none", border: "none",
            borderBottom: tab === key ? "2px solid #00E5FF" : "2px solid transparent",
            color: tab === key ? "#00E5FF" : "rgba(242,240,235,0.4)",
            fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", fontFamily: FONT,
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or theme…"
          style={{ ...inputStyle, maxWidth: 360 }} />
      </div>

      {/* Bulk generate modal */}
      {showBulkForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 440, background: "#0d0d0f", border: "1px solid rgba(242,240,235,0.1)", borderRadius: 16, padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300 }}>Bulk Generate</div>
              <button onClick={() => setShowBulkForm(false)} style={{ background: "none", border: "none", color: "rgba(242,240,235,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: "rgba(242,240,235,0.45)", lineHeight: 1.7, marginBottom: 24 }}>
              Pre-generate QR codes for physical keychains before production. Each code is blank until a user scans and personalises it.
            </p>
            {error && <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, color: "#ff8080", fontSize: 12, marginBottom: 16 }}>{error}</div>}
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={labelStyle}>HOW MANY CODES? (max 100)</label>
                <input style={inputStyle} type="number" min="1" max="100" value={bulkCount} onChange={(e) => setBulkCount(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>DEFAULT THEME</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={bulkTheme} onChange={(e) => setBulkTheme(e.target.value)}>
                  {THEMES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <button onClick={handleBulkGenerate} disabled={generating} style={{
                padding: "14px", background: generating ? "rgba(255,255,255,0.06)" : "#00E5FF",
                border: "none", borderRadius: 10, color: generating ? "rgba(242,240,235,0.3)" : "#000",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: generating ? "not-allowed" : "pointer", fontFamily: FONT,
              }}>
                {generating ? "GENERATING…" : `GENERATE ${bulkCount} CODES`}
              </button>
            </div>

            {/* Show generated codes */}
            {generated.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#64c864", marginBottom: 12 }}>✓ GENERATED — CLICK TO PREVIEW QR</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                  {generated.map((code) => (
                    <button key={code} onClick={() => { setQrModal({ code, type: "keychain" }); }} style={{
                      padding: "6px 12px", background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)",
                      borderRadius: 6, color: "#00E5FF", fontSize: 10, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em",
                    }}>{code}</button>
                  ))}
                </div>
                {/* Hidden QR codes for download */}
                <div style={{ position: "absolute", left: -9999 }}>
                  {generated.map((code) => (
                    <QRCodeSVG key={code} id={`qr-${code}`} value={`${BASE_URL}/keychain/${code}`} size={240} level="H" includeMargin />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create sticker modal */}
      {showStickerForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#0d0d0f", border: "1px solid rgba(242,240,235,0.1)", borderRadius: 16, padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300 }}>New Sticker</div>
              <button onClick={() => setShowStickerForm(false)} style={{ background: "none", border: "none", color: "rgba(242,240,235,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            {error && <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, color: "#ff8080", fontSize: 12, marginBottom: 16 }}>{error}</div>}
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={labelStyle}>UNIQUE CODE</label>
                <input style={inputStyle} value={stickerForm.code} onChange={(e) => setStickerForm((f) => ({ ...f, code: e.target.value.trim() }))} placeholder="e.g. stk-dragon-001" />
              </div>
              <div>
                <label style={labelStyle}>TARGET IMAGE URL (.mind file)</label>
                <input style={inputStyle} value={stickerForm.targetImage} onChange={(e) => setStickerForm((f) => ({ ...f, targetImage: e.target.value.trim() }))} placeholder="https://…/targets.mind" />
              </div>
              <div>
                <label style={labelStyle}>3D ASSET URL (.glb, optional)</label>
                <input style={inputStyle} value={stickerForm.assetUrl} onChange={(e) => setStickerForm((f) => ({ ...f, assetUrl: e.target.value.trim() }))} placeholder="https://…/model.glb" />
              </div>
              <div>
                <label style={labelStyle}>MESSAGE (shown in AR)</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={stickerForm.message} onChange={(e) => setStickerForm((f) => ({ ...f, message: e.target.value }))} placeholder="Optional AR overlay text" />
              </div>
              <button onClick={handleCreateSticker} disabled={saving} style={{
                padding: "14px", background: saving ? "rgba(255,255,255,0.06)" : "#00E5FF",
                border: "none", borderRadius: 10, color: saving ? "rgba(242,240,235,0.3)" : "#000",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: saving ? "not-allowed" : "pointer", fontFamily: FONT,
              }}>
                {saving ? "CREATING…" : "CREATE STICKER EXPERIENCE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keychains tab */}
      {tab === "keychains" && (
        loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 11 }}>Loading…</div>
        ) : filteredKeychains.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12 }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, marginBottom: 12 }}>No Keychains Yet</div>
            <div style={{ fontSize: 12, color: "rgba(242,240,235,0.4)", marginBottom: 24 }}>Generate bulk QR codes to get started.</div>
          </div>
        ) : (
          <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px 100px 80px 80px 1fr 120px 80px", gap: 12, padding: "10px 20px", borderBottom: "1px solid rgba(242,240,235,0.05)", fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,240,235,0.35)" }}>
              <div>CODE</div><div>THEME</div><div>CLAIMED</div><div>SCANS</div><div>CREATED</div><div>STATUS</div><div>QR</div>
            </div>
            {filteredKeychains.map((k, i) => (
              <div key={k.id} style={{
                display: "grid", gridTemplateColumns: "120px 100px 80px 80px 1fr 120px 80px",
                gap: 12, padding: "13px 20px", alignItems: "center",
                borderBottom: i < filteredKeychains.length - 1 ? "1px solid rgba(242,240,235,0.04)" : "none",
                opacity: k.isActive ? 1 : 0.45,
              }}>
                <div style={{ fontSize: 11, letterSpacing: "0.05em", color: "#00E5FF" }}>{k.code}</div>
                <div style={{ fontSize: 10, color: "rgba(242,240,235,0.5)", letterSpacing: "0.1em" }}>{k.theme}</div>
                <div>
                  {k.claimed
                    ? <span style={{ fontSize: 9, color: "#64c864", letterSpacing: "0.1em" }}>✓ YES</span>
                    : <span style={{ fontSize: 9, color: "rgba(242,240,235,0.3)", letterSpacing: "0.1em" }}>— NO</span>}
                </div>
                <div style={{ fontSize: 11, color: "rgba(242,240,235,0.5)" }}>{k.scanCount}</div>
                <div style={{ fontSize: 10, color: "rgba(242,240,235,0.35)" }}>{new Date(k.createdAt).toLocaleDateString("en-IN")}</div>
                <button onClick={() => toggleKeychain(k.id, k.isActive)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 9, letterSpacing: "0.12em",
                  background: k.isActive ? "rgba(100,200,100,0.08)" : "rgba(255,80,80,0.08)",
                  border: `1px solid ${k.isActive ? "rgba(100,200,100,0.35)" : "rgba(255,80,80,0.3)"}`,
                  color: k.isActive ? "#64c864" : "#ff8080",
                  cursor: "pointer", fontFamily: FONT,
                }}>
                  {k.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
                <button onClick={() => setQrModal({ code: k.code, type: "keychain" })} style={{
                  padding: "5px 10px", borderRadius: 6, fontSize: 9,
                  background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)",
                  color: "#00E5FF", cursor: "pointer", fontFamily: FONT,
                }}>QR ↗</button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Stickers tab */}
      {tab === "stickers" && (
        loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 11 }}>Loading…</div>
        ) : filteredStickers.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12 }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, marginBottom: 12 }}>No Stickers Yet</div>
            <div style={{ fontSize: 12, color: "rgba(242,240,235,0.4)", marginBottom: 24 }}>Create a sticker experience to get started.</div>
          </div>
        ) : (
          <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr 60px 120px 80px", gap: 12, padding: "10px 20px", borderBottom: "1px solid rgba(242,240,235,0.05)", fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,240,235,0.35)" }}>
              <div>CODE</div><div>TARGET IMAGE</div><div>MESSAGE</div><div>SCANS</div><div>STATUS</div><div>QR</div>
            </div>
            {filteredStickers.map((s, i) => (
              <div key={s.id} style={{
                display: "grid", gridTemplateColumns: "140px 1fr 1fr 60px 120px 80px",
                gap: 12, padding: "13px 20px", alignItems: "center",
                borderBottom: i < filteredStickers.length - 1 ? "1px solid rgba(242,240,235,0.04)" : "none",
                opacity: s.isActive ? 1 : 0.45,
              }}>
                <div style={{ fontSize: 11, color: "#C8A96E" }}>{s.code}</div>
                <div style={{ fontSize: 10, color: "rgba(242,240,235,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.targetImage}</div>
                <div style={{ fontSize: 11, color: "rgba(242,240,235,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.message || "—"}</div>
                <div style={{ fontSize: 11, color: "rgba(242,240,235,0.5)" }}>{s.scanCount}</div>
                <button onClick={() => toggleSticker(s.id, s.isActive)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 9, letterSpacing: "0.12em",
                  background: s.isActive ? "rgba(100,200,100,0.08)" : "rgba(255,80,80,0.08)",
                  border: `1px solid ${s.isActive ? "rgba(100,200,100,0.35)" : "rgba(255,80,80,0.3)"}`,
                  color: s.isActive ? "#64c864" : "#ff8080",
                  cursor: "pointer", fontFamily: FONT,
                }}>
                  {s.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
                <button onClick={() => setQrModal({ code: s.code, type: "sticker" })} style={{
                  padding: "5px 10px", borderRadius: 6, fontSize: 9,
                  background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.2)",
                  color: "#C8A96E", cursor: "pointer", fontFamily: FONT,
                }}>QR ↗</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}