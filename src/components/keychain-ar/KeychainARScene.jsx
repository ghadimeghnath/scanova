// components/keychain-ar/KeychainARScene.jsx
// The MindAR image-tracking AR scene for keychains.
// Architecture: identical Blob/iframe trick as StickerARScene.jsx —
// this prevents React DOM conflicts with MindAR's canvas/video injection.
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AROverlay from "@/components/sticker-ar/AROverlay";
import CameraPermissionScreen from "@/components/CameraPermissionScreen";
import { buildKeychainARDocument, THEME_INDEX } from "@/hooks/useKeychainARDocument";

export default function KeychainARScene({ imageUrl, message, theme, code }) {
  const [phase,           setPhase]           = useState("idle");
  const [compileProgress, setCompileProgress] = useState(0);
  const [errorDetail,     setErrorDetail]     = useState("");
  const [permDenied,      setPermDenied]      = useState(false);
  const [iframeSrc,       setIframeSrc]       = useState(null);
  const blobUrlRef = useRef(null);

  // ── Resolve theme → target index ───────────────────────────────────────
  const themeIndex = THEME_INDEX[theme] ?? 0;

  // ── Analytics ping ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!code) return;
    fetch("/api/track", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ shortCode: code, type: "keychain" }),
    }).catch(() => {});
  }, [code]);

  // ── Build iframe blob URL ───────────────────────────────────────────────
  // We pre-bake the HTML string (with imageUrl, message, themeIndex embedded)
  // into a Blob URL so the iframe has no CORS/CSP issues with the MindAR scripts.
  useEffect(() => {
    const html         = buildKeychainARDocument({ imageUrl, message, themeIndex });
    const blob         = new Blob([html], { type: "text/html" });
    const url          = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    setIframeSrc(url);

    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [imageUrl, message, themeIndex]);

  // ── Listen for postMessage events from iframe ───────────────────────────
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== "mindar-phase") return;
      const { phase: p, progress, message: errMsg } = event.data;

      if (p === "loading")   setPhase("loading");
      if (p === "compiling") {
        setPhase("compiling");
        if (progress != null) setCompileProgress(progress);
      }
      if (p === "tracking") setPhase("tracking");
      if (p === "found")    setPhase("found");
      if (p === "error") {
        const msg = errMsg || "";
        if (
          msg.toLowerCase().includes("notallowed") ||
          msg.toLowerCase().includes("permission")
        ) {
          setPermDenied(true);
        } else {
          setErrorDetail(msg || "AR failed");
          setPhase("error");
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // ── Full-bleed body/html reset ───────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.cssText =
      "width:100%;height:100%;margin:0;padding:0;overflow:hidden;";
    document.body.style.cssText =
      "width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;";
    return () => {
      document.documentElement.style.cssText = "";
      document.body.style.cssText = "";
    };
  }, []);

  // ── Tap-to-start handler ─────────────────────────────────────────────────
  // We pre-warm camera permission from the parent React context (user gesture),
  // so the browser grants it inside the iframe without a second prompt.
  const handleStart = useCallback(async () => {
    setPhase("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop()); // immediately release
    } catch (e) {
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setPermDenied(true);
      } else {
        setErrorDetail(`Camera: ${e.message}`);
        setPhase("error");
      }
    }
  }, []);

  if (permDenied) return <CameraPermissionScreen />;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#000" }}>

      {/*
        ── MindAR iframe ─────────────────────────────────────────────────────
        KEY ATTRIBUTES (same as StickerARScene — do not remove any):
          • allowtransparency="true"  → iframe bg stays transparent, video shows through
          • allow="camera"            → required to access camera inside iframe
          • sandbox="allow-scripts allow-same-origin" → ES modules + postMessage work
          • No background CSS        → keeps iframe transparent
        ─────────────────────────────────────────────────────────────────────
      */}
      {iframeSrc && phase !== "idle" && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          allow="camera; microphone; autoplay"
          allowFullScreen
          allowtransparency="true"
          sandbox="allow-scripts allow-same-origin"
          title="SCANOVA Keychain AR"
          style={{
            position  : "fixed",
            inset     : 0,
            width     : "100%",
            height    : "100%",
            border    : "none",
            background: "transparent",
            zIndex    : 1,
          }}
        />
      )}

      {/* React overlay sits above the iframe at z-index 50 */}
      <AROverlay
        phase={phase}
        compileProgress={compileProgress}
        errorDetail={errorDetail}
        onStart={handleStart}
      />
    </div>
  );
}