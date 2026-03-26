// app/scanner/page.jsx
// Universal Web Scanner — the single entry point for all Scanova products.
// Flow: QR Scan → Auto-Detect Product Type → Fetch Payload → Render Correct AR Scene
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import CameraPermissionScreen from "@/components/CameraPermissionScreen";
import KeychainSetupPage from "@/components/keychain-ar/KeychainSetupPage";

// ── Dynamic Imports (Load heavy AR engines only on client side) ──────────────
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center gap-4 font-mono text-white/40 text-xs tracking-[0.15em]">
    <div className="w-9 h-9 border-2 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full animate-spin" />
    LOADING AR ENGINE…
  </div>
);

const KeychainARScene = dynamic(() => import("@/components/keychain-ar/KeychainARScene"), { ssr: false, loading: LoadingScreen });
const StickerARScene  = dynamic(() => import("@/components/sticker-ar/StickerARScene"),   { ssr: false, loading: LoadingScreen });

export default function ScannerPage() {
  const [scanState,   setScanState]   = useState("init");
  const [errorMsg,    setErrorMsg]    = useState("");
  const [payload,     setPayload]     = useState(null);   
  const [productType, setProductType] = useState(null); // "keychain" | "sticker"
  const [permDenied,  setPermDenied]  = useState(false);
  const [scannedCode, setScannedCode] = useState("");     

  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const streamRef    = useRef(null);
  const rafRef       = useRef(null);
  const jsQRRef      = useRef(null);
  const scanningRef  = useRef(false);

  // ── 1. Load jsQR script dynamically ─────────────────────────────────────
  useEffect(() => {
    if (window.jsQR) { jsQRRef.current = window.jsQR; return; }
    const script   = document.createElement("script");
    script.src     = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
    script.onload  = () => { jsQRRef.current = window.jsQR; };
    script.onerror = () => setError("Failed to load QR scanner library.");
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch (_) {} };
  }, []);

  // ── 2. Start camera when we hit "scanning" ───────────────────────────────
  useEffect(() => {
    if (scanState !== "scanning") return;
    let active = true;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        tick();
      } catch (e) {
        if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
          setPermDenied(true);
        } else {
          setError(`Camera error: ${e.message}`);
        }
      }
    })();

    return () => {
      active = false;
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState]);

  const tick = useCallback(() => {
    if (!scanningRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !jsQRRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (video.readyState < video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 🔥 UPGRADED: "attemptBoth" makes it scan MUCH faster on physical objects
    const code = jsQRRef.current(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code?.data) {
      handleQRFound(code.data);
      return; 
    }

    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 3. Start scanning ────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    scanningRef.current = true;
    setScanState("scanning");
  }, []);

  // ── 4. QR found → Auto-Detect Type → Fetch payload ───────────────────────
  const handleQRFound = useCallback(async (rawUrl) => {
    scanningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopCamera();
    
    let code = rawUrl.trim();
    let type = "keychain"; // Default assumption
    setScannedCode(code);
    setScanState("fetching");

    // 🔥 UPGRADED PARSING: Bulletproof string manipulation instead of URL()
    // Strips http://, https://, and www. to make splitting predictable
    const cleanUrl = code.replace(/^(https?:\/\/)?(www\.)?/, "");
    const parts = cleanUrl.split("/").filter(Boolean);

    if (parts.includes("sticker")) {
      type = "sticker";
      const idx = parts.indexOf("sticker");
      code = parts[idx + 1] || code; // Grab the part right after "sticker"
    } else if (parts.includes("keychain")) {
      type = "keychain";
      const idx = parts.indexOf("keychain");
      code = parts[idx + 1] || code; // Grab the part right after "keychain"
    } else {
      // If no keywords exist, assume the whole string (or last part) is just a keychain code
      code = parts[parts.length - 1]; 
    }

    setProductType(type);

    // Build the correct API endpoint
    const endpoint = type === "sticker" 
      ? `/api/sticker-payload/${encodeURIComponent(code)}` 
      : `/api/keychain-payload/${encodeURIComponent(code)}`;

    try {
      const res = await fetch(endpoint);
      
      // Detailed error capturing
      if (!res.ok) { 
        const errText = await res.text();
        try {
          const data = JSON.parse(errText);
          setError(data.error || `Code not found in database.`); 
        } catch {
          setError(`API Error ${res.status}: Is your database connected?`);
        }
        return; 
      }

      const data = await res.json();
      setPayload(data);

      if (type === "keychain") {
        setScanState(data.claimed ? "ar" : "setup");
      } else {
        setScanState("ar"); // Stickers skip setup phase
      }
      
    } catch (err) {
      setError(`Network failed. Check your internet connection.`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ──────────────────────────────────────────────────────────────
  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const setError = (msg) => {
    setErrorMsg(msg);
    setScanState("error");
  };

  const restart = () => {
    setErrorMsg("");
    setPayload(null);
    setProductType(null);
    setScannedCode("");
    scanningRef.current = false;
    setScanState("init");
  };

  // ── Early-exit states ────────────────────────────────────────────────────
  if (permDenied) return <CameraPermissionScreen />;

  if (scanState === "ar" && payload) {
    if (productType === "sticker") {
      return (
        <StickerARScene 
          targetImage={payload.targetImage}
          assetUrl={payload.assetUrl} 
          message={payload.message}
          code={payload.code}
        />
      );
    }
    
    if (productType === "keychain") {
      return (
        <KeychainARScene
          imageUrl={payload.imageUrl}
          message={payload.message}
          theme={payload.theme}
          code={payload.code}
        />
      );
    }
  }

  if (scanState === "setup" && payload && productType === "keychain") {
    return <KeychainSetupPage code={payload.code} />;
  }

  // ── Scanner UI ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center overflow-hidden">

      {scanState === "init" && (
        <div className="flex flex-col items-center gap-8 px-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-4xl">
            📷
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/70 uppercase mb-3">
              SCANOVA · Universal Scanner
            </div>
            <h1 className="font-serif text-3xl text-white mb-3">Scan Code</h1>
            <p className="font-mono text-xs text-white/35 leading-relaxed max-w-xs">
              Point your camera at the QR code on your keychain or sticker packaging to activate the AR experience.
            </p>
          </div>
          <button
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-black font-bold text-base tracking-widest font-serif border-none cursor-pointer shadow-[0_0_40px_rgba(0,229,255,0.3)]"
          >
            ✦ TAP TO SCAN
          </button>
          <p className="font-mono text-[10px] text-white/20 tracking-widest">Camera access required</p>
        </div>
      )}

      {scanState === "scanning" && (
        <>
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          <div className="relative z-10 flex flex-col items-center justify-between h-full py-14 pointer-events-none">
            <div className="font-serif text-lg tracking-[0.25em] text-white/60 uppercase">SCANOVA</div>

            <div className="relative w-64 h-64">
              {[
                "top-0 left-0 border-t-2 border-l-2",
                "top-0 right-0 border-t-2 border-r-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 border-cyan-400 opacity-80 ${cls}`} />
              ))}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan-move_2s_ease-in-out_infinite_alternate]" />
            </div>

            <div className="px-6 py-3 bg-black/70 border border-white/10 rounded-full font-mono text-xs text-white/50 tracking-widest backdrop-blur-md">
              SCAN COMPANION QR CODE
            </div>
          </div>

          <style>{`
            @keyframes scan-move {
              0%   { transform: translateY(0); }
              100% { transform: translateY(256px); }
            }
          `}</style>
        </>
      )}

      {scanState === "fetching" && (
        <div className="flex flex-col items-center gap-6 px-8 text-center">
          <div className="w-9 h-9 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <div>
            <div className="font-serif text-xl text-white mb-2">Found {productType === 'sticker' ? 'Sticker' : 'Keychain'}</div>
            <div className="font-mono text-[10px] text-white/30 mb-2 uppercase tracking-widest break-all">
              ID: {scannedCode.split("/").pop()}
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/40 animate-pulse">
            FETCHING SECURE PAYLOAD…
          </div>
        </div>
      )}

      {scanState === "error" && (
        <div className="flex flex-col items-center gap-6 px-8 text-center max-w-sm">
          <div className="text-4xl">⚠️</div>
          <div>
            <div className="font-serif text-xl text-white mb-2">Scan Failed</div>
            <div className="font-mono text-xs text-red-400/80 leading-relaxed bg-red-400/10 border border-red-400/20 p-3 rounded-xl">
              {errorMsg}
            </div>
          </div>
          <button
            onClick={restart}
            className="px-8 py-3.5 mt-2 bg-white/[0.06] border border-white/10 rounded-full font-mono text-sm text-white/60 cursor-pointer hover:border-white/20 transition-colors"
          >
            ← Scan Again
          </button>
        </div>
      )}
    </div>
  );
}