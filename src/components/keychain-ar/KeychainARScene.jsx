// src/components/keychain-ar/KeychainARScene.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AROverlay from "@/components/sticker-ar/AROverlay";
import CameraPermissionScreen from "@/components/CameraPermissionScreen";
import { buildKeychainARDocument } from "@/hooks/useKeychainARDocument";
import { getTheme, resolveThemeId } from "@/config/keychainThemes";

export default function KeychainARScene({
  imageUrl,
  message,
  theme,
  colorIndex,
  code,
}) {
  const [phase, setPhase] = useState("idle");
  const [compileProgress, setCompileProgress] = useState(0);
  const [errorDetail, setErrorDetail] = useState("");
  const [permDenied, setPermDenied] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const blobUrlRef = useRef(null);

  // theme      → MindAR target index (physical keychain design, set by admin)
  // colorIndex → AR overlay palette (user's choice at claim time)
  const targetIndex = resolveThemeId(theme);
  const paletteIndex =
    colorIndex !== undefined && colorIndex !== null
      ? resolveThemeId(colorIndex)
      : targetIndex;
  const palette = getTheme(paletteIndex);

  useEffect(() => {
    if (!code) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortCode: code, type: "keychain" }),
    }).catch(() => {});
  }, [code]);

  useEffect(() => {
    const html = buildKeychainARDocument({
      imageUrl,
      message,
      themeIndex: targetIndex,
      themeBg: palette.bg,
      themeText: palette.text,
    });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    setIframeSrc(url);
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [imageUrl, message, targetIndex, palette.bg, palette.text]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== "mindar-phase") return;
      const { phase: p, progress, message: errMsg } = event.data;
      if (p === "loading") setPhase("loading");
      if (p === "compiling") {
        setPhase("compiling");
        if (progress != null) setCompileProgress(progress);
      }
      if (p === "tracking") setPhase("tracking");
      if (p === "found") setPhase("found");
      if (p === "error") {
        const msg = errMsg || "";
        if (
          msg.toLowerCase().includes("notallowed") ||
          msg.toLowerCase().includes("permission")
        )
          setPermDenied(true);
        else {
          setErrorDetail(msg || "AR failed");
          setPhase("error");
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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

  const handleStart = useCallback(async () => {
    setPhase("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError")
        setPermDenied(true);
      else {
        setErrorDetail(`Camera: ${e.message}`);
        setPhase("error");
      }
    }
  }, []);

  if (permDenied) return <CameraPermissionScreen />;

  return (
    <div
      className='fixed inset-0 overflow-hidden'
      style={{ background: "#000" }}
    >
      {iframeSrc && phase !== "idle" && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          allow='camera; microphone; autoplay'
          allowFullScreen
          allowtransparency='true'
          sandbox='allow-scripts allow-same-origin'
          title='SCANOVA Keychain AR'
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            zIndex: 1,
          }}
        />
      )}
      <AROverlay
        phase={phase}
        compileProgress={compileProgress}
        errorDetail={errorDetail}
        onStart={handleStart}
      />
    </div>
  );
}
