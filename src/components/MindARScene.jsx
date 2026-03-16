"use client";

import { useEffect, useRef, useState } from "react";

export default function WebXRScene({ message, imageUrl }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent double-init on React StrictMode / HMR
    if (window.__aframeInitialized) {
      buildScene();
      return;
    }

    // ── Force the body/html to be truly full screen ──────────────────────
    document.documentElement.style.cssText = "width:100%;height:100%;margin:0;padding:0;overflow:hidden;";
    document.body.style.cssText = "width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;";

    const loadAFrame = () => {
      if (window.AFRAME) {
        registerComponents();
        buildScene();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://aframe.io/releases/1.4.0/aframe.min.js";
      script.async = true;

      script.onload = () => {
        window.__aframeInitialized = true;
        registerComponents();
        buildScene();
      };

      script.onerror = () => {
        setError("Failed to load A-Frame. Check your connection.");
      };

      document.head.appendChild(script);
    };

    loadAFrame();

    return () => {
      document.documentElement.style.cssText = "";
      document.body.style.cssText = "";
    };
  }, []);

  const registerComponents = () => {
    const AFRAME = window.AFRAME;

    // ── Hit-test: moves reticle to wherever camera points at floor ────────
    if (!AFRAME.components["xr-hit-test"]) {
      AFRAME.registerComponent("xr-hit-test", {
        init() {
          this.hitTestSource = null;
          this.hitTestSourceRequested = false;
          this.placed = false;

          this.el.sceneEl.addEventListener("enter-vr", async () => {
            this.placed = false;
            this.hitTestSourceRequested = false;
            this.hitTestSource = null;
            setStatus("ar-active");
          });

          this.el.sceneEl.addEventListener("exit-vr", () => {
            this.hitTestSource = null;
            this.hitTestSourceRequested = false;
            setStatus("ready");
          });
        },

        async tick() {
          if (this.placed) return;

          const sceneEl = this.el.sceneEl;
          const renderer = sceneEl.renderer;
          const xr = renderer?.xr;
          if (!xr?.isPresenting) return;

          const session = xr.getSession?.() || sceneEl.xrSession;
          if (!session) return;

          // Request hit test source once
          if (!this.hitTestSourceRequested) {
            this.hitTestSourceRequested = true;
            try {
              const viewerSpace = await session.requestReferenceSpace("viewer");
              this.hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
            } catch (e) {
              console.warn("Hit test source failed:", e);
            }
          }

          if (!this.hitTestSource) return;

          const frame = sceneEl.frame;
          if (!frame) return;

          let refSpace;
          try {
            refSpace = await session.requestReferenceSpace("local-floor").catch(
              () => session.requestReferenceSpace("local")
            );
          } catch (e) { return; }

          const results = frame.getHitTestResults(this.hitTestSource);
          const reticle = document.getElementById("reticle");

          if (results.length > 0) {
            const pose = results[0].getPose(refSpace);
            if (pose && reticle) {
              const p = pose.transform.position;
              reticle.setAttribute("position", `${p.x} ${p.y} ${p.z}`);
              reticle.setAttribute("visible", "true");
            }
          } else if (reticle) {
            reticle.setAttribute("visible", "false");
          }
        },
      });
    }

    // ── Tap-to-place ──────────────────────────────────────────────────────
    if (!AFRAME.components["tap-to-place-scene"]) {
      AFRAME.registerComponent("tap-to-place-scene", {
        init() {
          this.el.sceneEl.addEventListener("select", () => {
            const reticle = document.getElementById("reticle");
            const payload = document.getElementById("ar-payload");
            if (!reticle || !payload) return;
            const pos = reticle.object3D.position;
            if (reticle.getAttribute("visible") === true || reticle.getAttribute("visible") === "true") {
              payload.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
              payload.setAttribute("visible", "true");
              reticle.setAttribute("visible", "false");
            }
          });
        },
      });
    }
  };

  const buildScene = () => {
    const container = containerRef.current;
    if (!container) return;
    if (container.querySelector("a-scene")) return; // already built

    const safeMsg = (message || "").replace(/\\/g, "\\\\").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const safeImg = imageUrl || "";

    // ── KEY FIX: NO `embedded` attribute. Let A-Frame own the full viewport.
    // We inject the scene as a full-page child and let A-Frame set canvas size.
    container.innerHTML = `
      <a-scene
        id="xr-scene"
        tap-to-place-scene
        webxr="requiredFeatures: hit-test; optionalFeatures: dom-overlay; overlayElement: #ar-overlay;"
        vr-mode-ui="enabled: true"
        renderer="antialias: true; colorManagement: true;"
        loading-screen="enabled: false"
        style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;"
      >
        <a-assets timeout="10000">
          <img id="ar-img" src="${safeImg}" crossorigin="anonymous" />
        </a-assets>

        <!-- Floor-tracking reticle ring -->
        <a-entity
          id="reticle"
          xr-hit-test
          visible="false"
          geometry="primitive:ring; radiusInner:0.04; radiusOuter:0.07; segmentsTheta:32"
          material="color:#00E5FF; shader:flat; opacity:0.85; side:double"
          rotation="-90 0 0"
        ></a-entity>

        <!-- AR payload: photo + message, shown after tap -->
        <a-entity id="ar-payload" visible="false">
          <a-image
            src="#ar-img"
            position="0 0.55 0"
            width="0.85"
            height="0.85"
            material="shader:flat; transparent:true"
          ></a-image>
          <a-text
            value="${safeMsg}"
            color="#FBBF24"
            align="center"
            position="0 1.1 0"
            scale="1.3 1.3 1.3"
            wrap-count="18"
            font="mozillavr"
          ></a-text>
        </a-entity>

        <a-camera
          id="camera"
          position="0 1.6 0"
          look-controls="enabled:true; magicWindowTrackingEnabled:true;"
          wasd-controls="enabled:false"
        ></a-camera>
      </a-scene>
    `;

    setStatus("ready");
  };

  return (
    // ── Outermost wrapper: truly fullscreen, black base ───────────────────
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* DOM Overlay: stays on top inside AR session */}
      <div
        id="ar-overlay"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 48,
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        {error && (
          <div style={pill("#7f1d1d", "#fca5a5")}>⚠️ {error}</div>
        )}
        {!error && status === "loading" && (
          <div style={pill("rgba(0,0,0,0.75)", "#fff")}>
            ⏳ Loading AR engine…
          </div>
        )}
        {!error && status === "ready" && (
          <div style={pill("rgba(0,0,0,0.8)", "#fff")}>
            👉 Tap <span style={{ color: "#00E5FF", fontWeight: "bold" }}>AR</span> at the bottom-right to start
          </div>
        )}
        {!error && status === "ar-active" && (
          <div style={pill("rgba(0,0,0,0.8)", "#fff")}>
            🎯 Point at the floor — then tap to place!
          </div>
        )}
      </div>

      {/* A-Frame scene container */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// tiny style helper
function pill(bg, color) {
  return {
    background: bg,
    color,
    padding: "10px 22px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    fontSize: 13,
    textAlign: "center",
    maxWidth: "90vw",
  };
}