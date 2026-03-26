// app/admin/page.jsx
"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://scanova.co");

// ── Theme config — must match the order of targets inside master-themes.mind ──
const THEMES = [
  { value: "love",        label: "❤️  Love",        index: 0, color: "from-rose-400 to-pink-500" },
  { value: "celebration", label: "🎉  Celebration",  index: 1, color: "from-amber-400 to-orange-500" },
  { value: "memory",      label: "📸  Memory",       index: 2, color: "from-violet-400 to-purple-500" },
  { value: "achievement", label: "🏆  Achievement",  index: 3, color: "from-emerald-400 to-green-500" },
  { value: "custom",      label: "✦  Custom",        index: 4, color: "from-cyan-400 to-blue-500" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tab: KEYCHAINS
// Admin pre-generates N blank QR codes with a specific theme.
// ─────────────────────────────────────────────────────────────────────────────
function KeychainTab({ apiKey }) {
  const [count,    setCount]    = useState(10);
  const [theme,    setTheme]    = useState("love");
  const [status,   setStatus]   = useState("idle"); // idle | loading | success | error
  const [codes,    setCodes]    = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedTheme = THEMES.find((t) => t.value === theme);

  const generate = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setCodes([]);

    try {
      const res = await fetch("/api/keychain-bulk", {
        method : "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body   : JSON.stringify({ count, theme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setCodes(data.codes);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const downloadQR = (code) => {
    const canvas = document.getElementById(`qr-k-${code}`);
    if (!canvas) return;
    const a = document.createElement("a");
    a.href     = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    a.download = `SCANOVA_${theme.toUpperCase()}_KEYCHAIN_${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => codes.forEach((c, i) => setTimeout(() => downloadQR(c), i * 150));

  return (
    <div className="flex flex-col gap-7">
      <div className="font-mono text-[11px] text-white/40 leading-relaxed p-4 bg-cyan-400/5 border border-cyan-400/15 rounded-xl">
        <strong className="text-cyan-400">Flow:</strong> Generate blank codes → print QR stickers onto keychains →
        customer scans → uploads their photo + message on first scan → AR activates permanently for that theme.
      </div>

      <form onSubmit={generate} className="flex flex-col gap-6">
        
        {/* Theme Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
            Physical Keychain Theme
          </label>
          <div className="grid grid-cols-1 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                  theme === t.value
                    ? "border-cyan-400/40 bg-cyan-400/[0.06]"
                    : "border-white/[0.06] bg-transparent hover:border-white/15"
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${t.color} shrink-0`} />
                <span className="font-serif text-white/80 text-sm flex-1">{t.label}</span>
                <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
                  Target #{t.index}
                </span>
                {theme === t.value && (
                  <span className="font-mono text-[10px] text-cyan-400">✓ Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Count Slider */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
            Number of Codes (1–200)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={200}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-cyan-400"
            />
            <div className="font-mono text-2xl text-white w-16 text-right tabular-nums">
              {count}
            </div>
          </div>
        </div>

        {/* Dynamic Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-4 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 ${
            status === "loading"
              ? "bg-white/5 text-white/30 cursor-not-allowed"
              : `bg-gradient-to-r ${selectedTheme?.color} text-black cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.2)]`
          }`}
        >
          {status === "loading" ? "GENERATING…" : `✦ GENERATE ${count} ${selectedTheme?.label.toUpperCase()} CODE${count !== 1 ? "S" : ""}`}
        </button>
      </form>

      {status === "error" && <ErrorBox msg={errorMsg} />}

      {/* Results Grid */}
      {status === "success" && codes.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/20 rounded-xl">
            <div>
              <div className="font-mono text-[10px] text-green-400/70 uppercase tracking-widest mb-1">✦ Generated Successfully</div>
              <div className="font-serif text-white text-lg">{codes.length} <span className="text-green-400">{theme}</span> code{codes.length > 1 ? "s" : ""} ready</div>
            </div>
            <button
              onClick={downloadAll}
              className="px-4 py-2.5 bg-green-400/15 border border-green-400/30 rounded-xl font-mono text-xs text-green-400 cursor-pointer hover:bg-green-400/20 transition-colors"
            >
              ↓ Download All QRs
            </button>
          </div>

          {/* Code grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            {codes.map((code) => {
              const url = `${DOMAIN}/keychain/${code}`;
              return (
                <div key={code} className="flex flex-col items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                  {/* QR */}
                  <div className="p-3 bg-white rounded-lg">
                    <QRCodeCanvas
                      id={`qr-k-${code}`}
                      value={url}
                      size={120}
                      level="H"
                      includeMargin
                    />
                  </div>
                  {/* Code label */}
                  <div className="font-mono text-[11px] text-cyan-400 tracking-wide text-center">{code}</div>
                  {/* Actions */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => downloadQR(code)}
                      className="flex-1 py-2 bg-white text-black text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-gray-100 transition-colors font-mono"
                    >
                      ↓ QR
                    </button>
                    <a
                      href={`/keychain/${code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 text-xs font-bold rounded-lg text-center no-underline hover:bg-cyan-400/15 transition-colors font-mono"
                    >
                      Test ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: STICKERS
// Admin creates sticker experiences with .mind file + optional GLB.
// ─────────────────────────────────────────────────────────────────────────────
function StickerTab({ apiKey }) {
  const [targetImage, setTargetImage] = useState("");
  const [assetUrl,    setAssetUrl]    = useState("");
  const [message,     setMessage]     = useState("");
  const [status,      setStatus]      = useState("idle");
  const [code,        setCode]        = useState(null);
  const [errorMsg,    setErrorMsg]    = useState("");
  const [history,     setHistory]     = useState([]);

  const generate = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setCode(null);

    try {
      const res = await fetch("/api/sticker-experience", {
        method : "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body   : JSON.stringify({ targetImage: targetImage.trim(), assetUrl: assetUrl.trim() || "", message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setCode(data.code);
      setStatus("success");
      setHistory((p) => [{ code: data.code, message, targetImage }, ...p.slice(0, 9)]);
      setAssetUrl("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const downloadQR = (c) => {
    const canvas = document.getElementById(`qr-s-${c}`);
    if (!canvas) return;
    const a = document.createElement("a");
    a.href     = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    a.download = `SCANOVA_STICKER_${c}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={generate} className="flex flex-col gap-5">
        <Field label="Target Image — .mind File URL *" hint="Compile your sticker JPG via mind-ar-js CLI and upload the .mind to Cloudinary">
          <TextInput type="url" required value={targetImage} onChange={(e) => setTargetImage(e.target.value)} placeholder="https://res.cloudinary.com/.../sticker.mind" />
        </Field>
        <Field label="3D Asset — .glb URL (optional)" hint="Leave blank for procedural chrome TorusKnot art">
          <TextInput type="url" value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} placeholder="https://res.cloudinary.com/.../model.glb" />
        </Field>
        <Field label="Floating Message (optional, max 22 chars)">
          <div className="relative">
            <TextInput type="text" maxLength={22} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. SCANOVA DROP 001" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/25">{message.length}/22</span>
          </div>
        </Field>
        <SubmitBtn loading={status === "loading"} label="Generate Sticker Experience" />
      </form>

      {status === "error" && <ErrorBox msg={errorMsg} />}

      {status === "success" && code && (
        <StickerQRResult code={code} domain={DOMAIN} onDownload={downloadQR} />
      )}

      {history.length > 1 && (
        <div className="mt-4">
          <div className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-3">Session History</div>
          <div className="flex flex-col gap-2">
            {history.slice(1).map((item) => (
              <div key={item.code} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <div>
                  <div className="font-mono text-xs text-cyan-400">{item.code}</div>
                  {item.message && <div className="font-mono text-[10px] text-white/30 mt-0.5">{item.message}</div>}
                </div>
                <div className="flex gap-2">
                  <SmallBtn onClick={() => downloadQR(item.code)}>↓ QR</SmallBtn>
                  <SmallBtn href={`/sticker/${item.code}`}>Test ↗</SmallBtn>
                </div>
                {/* Hidden QR for history downloads */}
                <div className="hidden">
                  <QRCodeCanvas id={`qr-s-${item.code}`} value={`${DOMAIN}/sticker/${item.code}`} size={400} level="H" includeMargin />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main admin dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [apiKey,  setApiKey]  = useState("");
  const [tab,     setTab]     = useState("keychain"); // "keychain" | "sticker"

  return (
    <div className="min-h-dvh overflow-y-auto bg-[#080808] text-white flex flex-col items-center justify-start py-12 px-5">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/70 uppercase mb-3">
            SCANOVA · Admin
          </div>
          <h1 className="font-serif text-3xl font-normal text-white mb-2">
            Command Center
          </h1>
          <p className="font-mono text-xs text-white/35 leading-relaxed">
            Generate AR keychain QR codes and custom sticker experiences.
          </p>
        </div>

        {/* API Key — always visible */}
        <div className="p-5 bg-white/[0.02] border border-white/[0.07] rounded-xl mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Admin API Key *</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••"
              className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-white/20 outline-none focus:border-cyan-400/40 transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-xl mb-6">
          {[
            { id: "keychain", label: "🔑 Keychains" },
            { id: "sticker",  label: "✦ Stickers"  },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 rounded-lg font-mono text-xs tracking-widest transition-all duration-200 border-none cursor-pointer ${
                tab === t.id
                  ? "bg-cyan-400/15 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(0,229,255,0.25)]"
                  : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 md:p-8">
          {tab === "keychain" && <KeychainTab apiKey={apiKey} />}
          {tab === "sticker"  && <StickerTab  apiKey={apiKey} />}
        </div>

        {/* Checklist */}
        <div className="mt-8 p-5 bg-amber-400/[0.04] border border-amber-400/15 rounded-xl font-mono text-[11px] text-amber-400/60 leading-[1.9]">
          <strong className="text-amber-400 block mb-2 tracking-widest uppercase">Production Checklist</strong>
          ✦ <code className="text-amber-400">ADMIN_API_KEY</code> set in .env.local<br />
          ✦ <code className="text-amber-400">NEXT_PUBLIC_SITE_URL=https://scanova.co</code> set<br />
          ✦ Sticker .mind files compiled + uploaded to Cloudinary as <em>Raw</em><br />
          ✦ Run <code className="text-amber-400">npx prisma db push</code> after schema changes<br />
          ✦ QRs print at 400×400px minimum for reliable scanning
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────
function StickerQRResult({ code, domain, onDownload }) {
  const url = `${domain}/sticker/${code}`;
  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-green-400/[0.03] border border-green-400/20 rounded-xl mt-2">
      <div className="font-mono text-[10px] text-green-400 tracking-widest uppercase">✦ Created Successfully</div>
      <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.15)]">
        <QRCodeCanvas id={`qr-s-${code}`} value={url} size={200} level="H" includeMargin />
      </div>
      <div className="text-center">
        <div className="font-serif text-xl text-white tracking-wide mb-1">{code}</div>
        <div className="font-mono text-[10px] text-white/25 break-all">{url}</div>
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={() => onDownload(code)} className="flex-1 py-3 bg-white text-black font-bold text-xs rounded-xl cursor-pointer border-none font-serif tracking-wide hover:bg-gray-100 transition-colors">
          ↓ Download QR
        </button>
        <a href={`/sticker/${code}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 font-bold text-xs rounded-xl text-center no-underline font-serif tracking-wide hover:bg-cyan-400/15 transition-colors">
          Test AR ↗
        </a>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-mono">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-white/25 leading-relaxed font-mono">{hint}</div>}
    </div>
  );
}

function TextInput({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-mono outline-none focus:border-cyan-400/40 transition-colors placeholder:text-white/20"
      {...props}
    />
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-4 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 mt-2 ${
        loading
          ? "bg-white/[0.05] text-white/20 cursor-not-allowed"
          : "bg-gradient-to-r from-cyan-400 to-blue-500 text-black cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.2)]"
      }`}
    >
      {loading ? "GENERATING…" : `✦  ${label.toUpperCase()}`}
    </button>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl font-mono text-xs text-red-400">
      ❌ {msg}
    </div>
  );
}

function SmallBtn({ onClick, href, children }) {
  const cls = "px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg font-mono text-[10px] text-white/40 cursor-pointer no-underline hover:text-white/60 transition-colors";
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls + " border-none"}>{children}</button>;
}