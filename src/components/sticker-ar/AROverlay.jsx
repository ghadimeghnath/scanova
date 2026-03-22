// components/sticker-ar/AROverlay.jsx
"use client";

// ── Status chip ───────────────────────────────────────────────────────────────
function Chip({ text, pulse = false, accent = false, green = false, red = false }) {
  const base =
    "px-6 py-3 rounded-full border font-mono text-xs tracking-widest backdrop-blur-md transition-all";
  const variant = green
    ? "bg-green-400/10 border-green-400/40 text-green-400 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
    : red
    ? "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(255,80,80,0.2)]"
    : accent
    ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
    : "bg-black/80 border-white/10 text-white/60";

  return (
    <div className={`${base} ${variant} ${pulse ? "animate-pulse" : ""}`}>
      {text}
    </div>
  );
}

// ── Compile progress bar ──────────────────────────────────────────────────────
function CompileProgress({ progress }) {
  return (
    <div className="absolute inset-x-6 top-20 flex flex-col gap-2">
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-cyan-400/70 uppercase">
        <span>Compiling target image…</span>
        <span>{progress}%</span>
      </div>
      <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-[11px] text-white/30 text-center leading-relaxed">
        Analysing image features — first scan takes ~5–15 seconds.
      </p>
    </div>
  );
}

// ── Corner scan brackets ──────────────────────────────────────────────────────
function ScanCorners() {
  return (
    <>
      <div className="absolute top-[60px] left-5  w-7 h-7 border-t-2 border-l-2 border-cyan-400 opacity-70 animate-pulse" />
      <div className="absolute top-[60px] right-5 w-7 h-7 border-t-2 border-r-2 border-cyan-400 opacity-70 animate-pulse" />
      <div className="absolute bottom-[140px] left-5  w-7 h-7 border-b-2 border-l-2 border-cyan-400 opacity-70 animate-pulse" />
      <div className="absolute bottom-[140px] right-5 w-7 h-7 border-b-2 border-r-2 border-cyan-400 opacity-70 animate-pulse" />
    </>
  );
}

// ── Found border flash ────────────────────────────────────────────────────────
function FoundFlash() {
  return (
    <div className="absolute inset-0 border-2 border-green-400/40 animate-pulse pointer-events-none" />
  );
}

// ── Start button (required to unlock camera on iOS) ───────────────────────────
function StartButton({ onStart }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-6">
      {/* Logo */}
      <div className="font-serif text-3xl tracking-[0.3em] text-white/80 uppercase">
        SCANOVA
      </div>
      <p className="font-mono text-xs tracking-widest text-white/40 text-center px-10 leading-relaxed">
        Point at your sticker to reveal the 3D art
      </p>
      <button
        onClick={onStart}
        className="mt-2 px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-black font-bold text-base tracking-widest font-serif border-none cursor-pointer shadow-[0_0_40px_rgba(0,229,255,0.4)]"
      >
        ✦ TAP TO START AR
      </button>
      <p className="font-mono text-[10px] text-white/20 tracking-widest">
        Camera access required
      </p>
    </div>
  );
}

// ── Main overlay component ────────────────────────────────────────────────────
export default function AROverlay({ phase, compileProgress, errorDetail, onStart }) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">

      {/* Start gate — pointer-events enabled so button is clickable */}
      {phase === "idle" && (
        <div className="pointer-events-auto">
          <StartButton onStart={onStart} />
        </div>
      )}

      {/* Brand wordmark */}
      {phase !== "idle" && (
        <div className="absolute top-5 left-5 font-serif text-lg tracking-[0.25em] text-white/50 uppercase select-none">
          SCANOVA
        </div>
      )}

      {/* Compile progress */}
      {phase === "compiling" && <CompileProgress progress={compileProgress} />}

      {/* Scan corners */}
      {phase === "tracking" && <ScanCorners />}

      {/* Found flash */}
      {phase === "found" && <FoundFlash />}

      {/* Status chip */}
      {phase !== "idle" && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {phase === "loading"   && <Chip text="LOADING AR ENGINE…"           pulse />}
          {phase === "compiling" && <Chip text="COMPILING TARGET…"            pulse accent />}
          {phase === "tracking"  && <Chip text="POINT CAMERA AT YOUR STICKER" accent />}
          {phase === "found"     && <Chip text="✦  STICKER RECOGNISED"        green />}
          {phase === "error"     && <Chip text={`❌  ${errorDetail || "AR failed — check console"}`} red />}
        </div>
      )}
    </div>
  );
}