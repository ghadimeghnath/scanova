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
  <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-6 z-50">
    <div className="w-16 h-16 bg-sc-cyan border-4 border-black sc-blob animate-spin shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
    <div className="font-heading text-2xl uppercase text-foreground tracking-wide">
      Loading Engine...
    </div>
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
    setScannedCode(code);
    setScanState("fetching");
 
    // Strip protocol + www for predictable parsing
    const cleanUrl = code.replace(/^(https?:\/\/)?(www\.)?/, "");
    const parts    = cleanUrl.split("/").filter(Boolean);
 
    if (parts.includes("sticker")) {
      // ── Sticker: the page route already does the DB lookup + AR render.
      // Just navigate there directly — no sticker-payload API needed.
      const idx  = parts.indexOf("sticker");
      const stickerCode = parts[idx + 1] || parts[parts.length - 1];
      window.location.href = `/sticker/${stickerCode}`;
      return;
    }
 
    // ── Keychain: fetch payload then decide claimed vs setup ──────────────
    let keychainCode = code;
    if (parts.includes("keychain")) {
      const idx = parts.indexOf("keychain");
      keychainCode = parts[idx + 1] || parts[parts.length - 1];
    } else {
      keychainCode = parts[parts.length - 1];
    }
 
    setProductType("keychain");
 
    try {
      const res = await fetch(`/api/keychain-payload/${encodeURIComponent(keychainCode)}`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
 
      if (!res.ok) {
        const errText = await res.text();
        try {
          const data = JSON.parse(errText);
          setError(data.error || "Code not found in database.");
        } catch {
          setError(`API Error ${res.status}: Is your database connected?`);
        }
        return;
      }
 
      const data = await res.json();
      setPayload(data);
      setScanState(data.claimed ? "ar" : "setup");
 
    } catch {
      setError("Network failed. Check your internet connection.");
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
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-background">

      {scanState === "init" && (
        <div className="flex flex-col items-center gap-6 px-6 text-center z-10">
          <div className="sc-blob w-32 h-32 bg-sc-cyan border-4 border-black flex items-center justify-center text-6xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-funky mb-4">
            📸
          </div>
          
          <div className="sc-card flex flex-col items-center">
            <div className="sc-slogan mb-1 text-sc-pink">scanova unchained</div>
            <h1 className="text-5xl md:text-6xl text-foreground mb-4 drop-shadow-[4px_4px_0_var(--color-sc-yellow)]">
              Scan Code
            </h1>
            <p className="font-sans font-bold text-lg text-foreground/80 leading-relaxed max-w-sm mb-6">
              Point your camera at the QR code on your keychain or sticker packaging to activate the AR experience!
            </p>
            
            <button
              onClick={handleStart}
              className="w-full py-4 bg-sc-purple text-white font-heading text-2xl tracking-wide rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
            >
              LET'S GO! 🚀
            </button>
          </div>
          <p className="font-handwritten text-lg text-foreground/60 font-bold mt-2">
            * Camera access required
          </p>
        </div>
      )}

      {scanState === "scanning" && (
        <>
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {/* Funky AR Frame Overlay */}
          <div className="ar-funky-frame hidden md:block" />

          <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 pointer-events-none">
            <h2 className="font-heading text-3xl tracking-widest text-white drop-shadow-[4px_4px_0_var(--color-sc-purple-dark)] uppercase">
              Scanova
            </h2>

            <div className="relative w-72 h-72 border-8 border-sc-yellow rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_var(--color-sc-pink)] box-content bg-black/20 backdrop-blur-sm">
              {/* Animated scanning bar */}
              <div className="absolute inset-x-0 top-0 h-4 bg-sc-cyan border-y-2 border-black animate-[scan-move_2s_ease-in-out_infinite_alternate] shadow-[0_0_20px_var(--color-sc-cyan)]" />
            </div>

            <div className="ar-status-pill animate-funky pointer-events-auto text-xl">
              POINT AT QR CODE
            </div>
          </div>

          <style>{`
            @keyframes scan-move {
              0%   { transform: translateY(0); }
              100% { transform: translateY(270px); }
            }
          `}</style>
        </>
      )}

      {scanState === "fetching" && (
        <div className="sc-card flex flex-col items-center gap-6 max-w-sm text-center animate-funky z-10">
          <div className="w-16 h-16 bg-sc-pink border-4 border-black sc-blob animate-spin shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          
          <div>
            <h2 className="text-3xl text-foreground mb-2">
              Found {productType === 'sticker' ? 'Sticker' : 'Keychain'}!
            </h2>
            <div className="font-handwritten text-2xl text-sc-purple-dark mb-4 break-all">
              ID: {scannedCode.split("/").pop()}
            </div>
          </div>
          
          <div className="ar-status-pill text-lg w-full">
            FETCHING PAYLOAD...
          </div>
        </div>
      )}

      {scanState === "error" && (
        <div className="sc-card border-sc-pink flex flex-col items-center gap-6 max-w-sm text-center z-10">
          <div className="text-6xl animate-bounce-slow drop-shadow-[4px_4px_0_var(--color-sc-pink)]">
            💥
          </div>
          
          <div className="w-full">
            <h2 className="text-3xl text-sc-pink mb-4">Scan Failed</h2>
            <div className="font-sans font-bold text-base text-foreground bg-gray-100 dark:bg-zinc-800 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {errorMsg}
            </div>
          </div>
          
          <button
            onClick={restart}
            className="w-full py-3 mt-2 bg-sc-yellow text-black font-heading text-xl rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
          >
            TRY AGAIN 🔄
          </button>
        </div>
      )}
    </div>
  );
}