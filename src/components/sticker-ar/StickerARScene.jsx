// components/StickerARScene.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AROverlay from "./AROverlay";
import CameraPermissionScreen from "../CameraPermissionScreen";
import { buildMindARDocument } from "@/hooks/useMindARDocument";

export default function StickerARScene({ targetImage, assetUrl, message, code }) {
  const [phase, setPhase]                     = useState("idle");
  const [compileProgress, setCompileProgress] = useState(0);
  const [errorDetail, setErrorDetail]         = useState("");
  const [permDenied, setPermDenied]           = useState(false);
  const [iframeSrc, setIframeSrc]             = useState(null);
  const blobUrlRef                            = useRef(null);

  // ── Analytics ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!code) return;
    fetch("/api/track", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ shortCode: code, type: "sticker" }),
    }).catch(() => {});
  }, [code]);

  // ── Build iframe blob URL once ──────────────────────────────────────────
  useEffect(() => {
    if (!targetImage) return;
    const html   = buildMindARDocument({ targetImage, assetUrl, message });
    const blob   = new Blob([html], { type: "text/html" });
    const url    = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    setIframeSrc(url);

    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [targetImage, assetUrl, message]);

  // ── Listen for postMessage from MindAR iframe ───────────────────────────
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== "mindar-phase") return;
      const { phase: p, progress, message: errMsg } = event.data;

      if (p === "loading")   setPhase("loading");
      if (p === "compiling") { setPhase("compiling"); if (progress != null) setCompileProgress(progress); }
      if (p === "tracking")  setPhase("tracking");
      if (p === "found")     setPhase("found");
      if (p === "error") {
        const msg = errMsg || "";
        if (msg.toLowerCase().includes("notallowed") || msg.toLowerCase().includes("permission")) {
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

  // ── Full-bleed layout ────────────────────────────────────────────────────
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

  // ── Handle start tap ─────────────────────────────────────────────────────
  // We check camera permission first from the parent page (user gesture),
  // then show the iframe. The iframe's MindAR will then request camera again
  // and the browser grants it because permission was already given.
  const handleStart = useCallback(async () => {
    setPhase("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
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

      {/* ── MindAR iframe ─────────────────────────────────────────────────
          KEY ATTRIBUTES:
          • allowtransparency="true"  → iframe bg is transparent, video shows
          • allow="camera"            → required for camera inside iframe
          • sandbox="allow-scripts allow-same-origin" → allows modules + postMessage
          • No `background` CSS on iframe → stays transparent
      ─────────────────────────────────────────────────────────────────── */}
      {iframeSrc && phase !== "idle" && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          allow="camera; microphone; autoplay"
          allowFullScreen
          allowtransparency="true"
          sandbox="allow-scripts allow-same-origin"
          title="SCANOVA AR"
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

      {/* ── React overlay sits above iframe ─────────────────────────────── */}
      <AROverlay
        phase={phase}
        compileProgress={compileProgress}
        errorDetail={errorDetail}
        onStart={handleStart}
      />
    </div>
  );
}