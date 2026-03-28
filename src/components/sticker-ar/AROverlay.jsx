// components/sticker-ar/AROverlay.jsx
"use client";

// ── Status chip ───────────────────────────────────────────────────────────────
function Chip({ text, pulse = false, accent = false, green = false, red = false }) {
  const base =
    "px-6 py-3 rounded-2xl border-4 border-black dark:border-white font-heading text-sm md:text-base tracking-wide uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all";
  
  const variant = green
    ? "bg-green-400 text-black"
    : red
    ? "bg-sc-pink text-black"
    : accent
    ? "bg-sc-cyan text-black"
    : "bg-white text-black dark:bg-zinc-900 dark:text-white";

  return (
    <div className={`${base} ${variant} ${pulse ? "animate-pulse" : "animate-funky"}`}>
      {text}
    </div>
  );
}

// ── Compile progress bar ──────────────────────────────────────────────────────
function CompileProgress({ progress }) {
  return (
    <div className="absolute inset-x-6 top-20 flex flex-col gap-3 sc-card max-w-sm mx-auto animate-funky">
      <div className="flex justify-between font-heading text-sm tracking-wide text-foreground uppercase">
        <span>Compiling Target...</span>
        <span>{progress}%</span>
      </div>
      <div className="h-6 bg-gray-100 dark:bg-zinc-800 border-4 border-black dark:border-white rounded-full overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]">
        <div
          className="h-full bg-sc-pink border-r-4 border-black dark:border-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 font-sans font-bold text-xs text-foreground/70 text-center leading-relaxed">
        Analysing image features — first scan takes ~5–15 seconds. Hang tight!
      </p>
    </div>
  );
}

// ── Corner scan brackets ──────────────────────────────────────────────────────
function ScanCorners() {
  return (
    <>
      <div className="absolute top-[80px] left-6  w-12 h-12 border-t-8 border-l-8 border-sc-yellow rounded-tl-2xl opacity-90 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
      <div className="absolute top-[80px] right-6 w-12 h-12 border-t-8 border-r-8 border-sc-yellow rounded-tr-2xl opacity-90 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
      <div className="absolute bottom-[160px] left-6  w-12 h-12 border-b-8 border-l-8 border-sc-yellow rounded-bl-2xl opacity-90 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
      <div className="absolute bottom-[160px] right-6 w-12 h-12 border-b-8 border-r-8 border-sc-yellow rounded-br-2xl opacity-90 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
    </>
  );
}

// ── Found border flash ────────────────────────────────────────────────────────
function FoundFlash() {
  return (
    <div className="ar-funky-frame border-green-400 opacity-80 animate-ping transition-colors duration-300" />
  );
}

// ── Start button (required to unlock camera on iOS) ───────────────────────────
function StartButton({ onStart }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <div className="sc-blob w-24 h-24 bg-sc-pink border-4 border-black flex items-center justify-center text-5xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-funky mb-6">
        ✨
      </div>
      
      <div className="sc-card flex flex-col items-center text-center max-w-sm w-full">
        <div className="sc-slogan mb-2 text-sc-cyan">scanova unchained</div>
        <h1 className="text-4xl text-foreground mb-4 drop-shadow-[4px_4px_0_var(--color-sc-purple)] uppercase">
          Ready?
        </h1>
        <p className="font-sans font-bold text-base text-foreground/80 leading-relaxed mb-6">
          Point your camera at your sticker to reveal the 3D art!
        </p>
        
        <button
          onClick={onStart}
          className="w-full py-4 bg-sc-yellow text-black font-heading text-xl tracking-wide rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
        >
          START AR 🚀
        </button>
      </div>
      
      <p className="font-handwritten text-base text-foreground/60 font-bold mt-4">
        * Camera access required
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
        <div className="absolute top-6 left-6 font-heading text-2xl tracking-widest text-white drop-shadow-[4px_4px_0_var(--color-sc-purple-dark)] uppercase select-none">
          Scanova
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
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {phase === "loading"   && <Chip text="LOADING AR ENGINE…"          pulse />}
          {phase === "compiling" && <Chip text="COMPILING TARGET…"           pulse accent />}
          {phase === "tracking"  && <Chip text="POINT CAMERA AT STICKER"     accent />}
          {phase === "found"     && <Chip text="✦ STICKER RECOGNISED!"       green />}
          {phase === "error"     && <Chip text={`❌ ${errorDetail || "AR failed"}`} red />}
        </div>
      )}
    </div>
  );
}