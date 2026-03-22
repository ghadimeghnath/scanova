// app/(admin)/admin/page.jsx
"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://scanova.co");

// ─────────────────────────────────────────────────────────────────────────────
// Tab: KEYCHAINS
// Admin pre-generates N blank QR codes. Users activate them on first scan.
// ─────────────────────────────────────────────────────────────────────────────
function KeychainTab({ apiKey }) {
  const [count,    setCount]    = useState(10);
  const [status,   setStatus]   = useState("idle");
  const [codes,    setCodes]    = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const generate = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setCodes([]);

    try {
      const res = await fetch("/api/keychain-bulk", {
        method : "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body   : JSON.stringify({ count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
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
    a.download = `SCANOVA_KEYCHAIN_${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => codes.forEach((c) => setTimeout(() => downloadQR(c), 0));

  return (
    <div className="flex flex-col gap-6">
      <div className="font-mono text-xs text-white/40 leading-relaxed p-4 bg-cyan-400/5 border border-cyan-400/15 rounded-xl">
        <strong className="text-cyan-400">Flow:</strong> Generate blank codes → print QR stickers onto keychains →
        customer scans → uploads their photo + message on first scan → AR activates permanently.
      </div>

      <form onSubmit={generate} className="flex flex-col gap-5">
        <Field label="Number of Codes (1–200)" hint="Each code is a unique keychain QR">
          <div className="flex items-center gap-3">
            <input
              type="number" min={1} max={200}
              value={count}
              onChange={(e) => setCount(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-32 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-cyan-400/40 transition-colors"
            />
            <span className="font-mono text-xs text-white/30">QR codes</span>
          </div>
        </Field>

        <SubmitBtn loading={status === "loading"} label={`Generate ${count} Keychain Code${count > 1 ? "s" : ""}`} />
      </form>

      {status === "error" && <ErrorBox msg={errorMsg} />}

      {status === "success" && codes.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/20 rounded-xl">
            <div>
              <div className="font-mono text-[10px] text-green-400/70 uppercase tracking-widest mb-1">✦ Generated Successfully</div>
              <div className="font-serif text-white text-lg">{codes.length} keychain code{codes.length > 1 ? "s" : ""} ready</div>
            </div>
            <button
              onClick={downloadAll}
              className="px-4 py-2.5 bg-green-400/15 border border-green-400/30 rounded-xl font-mono text-xs text-green-400 cursor-pointer hover:bg-green-400/20 transition-colors"
            >
              ↓ Download All QRs
            </button>
          </div>

          {/* Code grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
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
        <div>
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
                {/* Hidden QR */}
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
    <div className="h-dvh overflow-y-auto bg-[#080808] text-white font-mono px-5 py-10">
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.3em] text-cyan-400/70 uppercase mb-2">Drop 001 · Internal Tool</div>
          <h1 className="font-serif text-3xl font-normal text-white mb-1">SCANOVA Command Center</h1>
          <p className="text-xs text-white/35">Generate keychain QR codes and sticker AR experiences.</p>
        </div>

        {/* API Key — always visible */}
        <div className="p-5 bg-white/[0.02] border border-white/[0.07] rounded-xl mb-6">
          <Field label="Admin API Key *" hint="Required for all operations">
            <TextInput
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-••••••••••••"
            />
          </Field>
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
              className={`flex-1 py-2.5 rounded-lg font-mono text-xs tracking-widest transition-all duration-200 border-none cursor-pointer ${
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
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-6">
          {tab === "keychain" && <KeychainTab apiKey={apiKey} />}
          {tab === "sticker"  && <StickerTab  apiKey={apiKey} />}
        </div>

        {/* Checklist */}
        <div className="mt-8 p-4 bg-amber-400/[0.04] border border-amber-400/15 rounded-xl text-[11px] text-amber-400/60 leading-[1.9]">
          <strong className="text-amber-400 block mb-1">Production Checklist</strong>
          ✦ <code className="text-amber-400">ADMIN_API_KEY</code> set in .env.local<br />
          ✦ <code className="text-amber-400">NEXT_PUBLIC_SITE_URL=https://scanova.co</code> set<br />
          ✦ Sticker .mind files compiled + uploaded to Cloudinary as <em>Raw</em><br />
          ✦ Run <code className="text-amber-400">npx prisma db push</code> after schema changes<br />
          ✦ Keychain QRs print at 400×400px minimum for reliable scanning
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
    <div className="flex flex-col items-center gap-5 p-6 bg-green-400/[0.03] border border-green-400/20 rounded-xl">
      <div className="font-mono text-[10px] text-green-400 tracking-widest">✦ CREATED SUCCESSFULLY</div>
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
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] tracking-[0.2em] text-cyan-400/70 uppercase">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-white/25 leading-relaxed">{hint}</div>}
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
      className={`w-full py-4 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 ${
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
