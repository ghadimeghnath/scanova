"use client";

import { useEffect, useRef, useState } from "react";

const createLogger = (setLogs) => (msg, type = "info") => {
  const icons = { info: "▸", success: "✅", warn: "⚠️", error: "❌" };
  const entry = `${icons[type] || "▸"} ${msg}`;
  console.log("[AR]", entry);
  setLogs((prev) => [...prev.slice(-20), entry]);
};

export default function WebXRScene({ message, imageUrl }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [logs, setLogs] = useState(["Starting..."]);
  const [showLogs, setShowLogs] = useState(true);
  const logRef = useRef(null);
  const log = useRef(null);

  useEffect(() => {
    log.current = createLogger(setLogs);
  }, [setLogs]);

  useEffect(() => {
    if (logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cleanedUp = false;
    const L = () => log.current;

    const onError = (e) =>
      L()?.(`${e.message} (${e.filename}:${e.lineno})`, "error");
    const onUnhandled = (e) =>
      L()?.(`Unhandled: ${e.reason?.message ?? e.reason}`, "error");
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);

    document.documentElement.style.cssText =
      "width:100%;height:100%;margin:0;padding:0;overflow:hidden;";
    document.body.style.cssText =
      "width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;";

    if (!navigator.xr) {
      L()?.("navigator.xr not found", "error");
      setStatus("unsupported");
      return;
    }

    L()?.("navigator.xr found", "success");

    navigator.xr
      .isSessionSupported("immersive-ar")
      .then((supported) => {
        if (!supported) {
          L()?.("immersive-ar not supported", "error");
          setStatus("unsupported");
          return;
        }
        L()?.("immersive-ar supported!", "success");
        loadThree();
      })
      .catch((e) => {
        L()?.(`isSessionSupported error: ${e.message}`, "error");
        setStatus("unsupported");
      });

    // ── Use Three.js directly — bypass A-Frame entirely ─────────────────
    // A-Frame 1.5's webxr component has a null-ref bug with our setup.
    // Three.js WebXRManager gives us full control with zero surprises.
    const loadThree = () => {
      if (window.THREE) { initAR(); return; }
      L()?.("Loading Three.js...");

      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload = () => { L()?.("Three.js loaded", "success"); initAR(); };
      s.onerror = () => { L()?.("Three.js load failed", "error"); setStatus("error"); };
      document.head.appendChild(s);
    };

    const initAR = async () => {
      if (cleanedUp) return;
      const THREE = window.THREE;
      const container = containerRef.current;
      if (!container) return;

      // ── Renderer ──────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.domElement.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;";
      container.appendChild(renderer.domElement);

      // ── Scene & Camera ────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.01, 20
      );

      // ── Reticle (ring on floor) ───────────────────────────────────────
      const reticleGeo = new THREE.RingGeometry(0.06, 0.1, 32);
      reticleGeo.rotateX(-Math.PI / 2); // lay flat
      const reticleMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const reticle = new THREE.Mesh(reticleGeo, reticleMat);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // ── Payload: image plane + text canvas ───────────────────────────
      const payload = new THREE.Group();
      payload.visible = false;
      scene.add(payload);

      // Image plane
      const texLoader = new THREE.TextureLoader();
      const safeImg = imageUrl ||
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";
      texLoader.crossOrigin = "anonymous";
      texLoader.load(safeImg, (tex) => {
        const imgGeo = new THREE.PlaneGeometry(0.4, 0.4);
        const imgMat = new THREE.MeshBasicMaterial({
          map: tex, side: THREE.DoubleSide, transparent: true,
        });
        const imgMesh = new THREE.Mesh(imgGeo, imgMat);
        imgMesh.position.set(0, 0.25, 0);
        payload.add(imgMesh);
        L()?.("Image texture loaded", "success");
      });

      // Text canvas
      const safeMsg = message || "Hello AR!";
      const canvas2d = document.createElement("canvas");
      canvas2d.width = 512; canvas2d.height = 128;
      const ctx = canvas2d.getContext("2d");
      ctx.fillStyle = "transparent";
      ctx.clearRect(0, 0, 512, 128);
      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(safeMsg.slice(0, 24), 256, 64);
      const textTex = new THREE.CanvasTexture(canvas2d);
      const textGeo = new THREE.PlaneGeometry(0.5, 0.125);
      const textMat = new THREE.MeshBasicMaterial({
        map: textTex, side: THREE.DoubleSide, transparent: true,
      });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(0, 0.55, 0);
      payload.add(textMesh);

      // ── Hit test state ────────────────────────────────────────────────
      let hitTestSource = null;
      let hitTestSourceRequested = false;
      let placed = false;

      // ── Enter AR button ───────────────────────────────────────────────
      const btn = document.createElement("button");
      btn.textContent = "🚀  ENTER AR";
      btn.style.cssText = `
        position: fixed; bottom: 36px; left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        background: #00E5FF; color: #000;
        border: none; border-radius: 99px;
        padding: 18px 48px;
        font-size: 18px; font-weight: 900; font-family: sans-serif;
        box-shadow: 0 0 40px rgba(0,229,255,0.6);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;
      container.appendChild(btn);

btn.addEventListener("click", async () => {
  L()?.("Requesting AR session...");
  try {

    // ── FIX: hit-test moved to optionalFeatures ──────────────────────
    // Some Android Chrome builds reject requiredFeatures:hit-test on
    // cold page loads even though isSessionSupported returns true.
    // Making it optional means the session always starts; we just
    // won't show the reticle if hit-test isn't available.
    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.getElementById("ar-overlay") },
    });

    L()?.("AR session granted!", "success");
    btn.style.display = "none";
    setStatus("ar-active");

    renderer.xr.setReferenceSpaceType("local-floor");
    await renderer.xr.setSession(session);

    session.addEventListener("end", () => {
      L()?.("Session ended");
      hitTestSource?.cancel();
      hitTestSource = null;
      hitTestSourceRequested = false;
      placed = false;
      btn.style.display = "block";
      setStatus("ready");
      setShowLogs(true);
    });

    session.addEventListener("select", () => {
      if (reticle.visible && !placed) {
        payload.position.setFromMatrixPosition(reticle.matrix);
        payload.visible = true;
        placed = true;
        reticle.visible = false;
        L()?.("Payload placed!", "success");
        setShowLogs(false);
      } else if (!placed) {
        // hit-test unavailable fallback: place 1m in front of camera
        const camPos = new THREE.Vector3();
        const camDir = new THREE.Vector3();
        camera.getWorldPosition(camPos);
        camera.getWorldDirection(camDir);
        payload.position.copy(camPos).addScaledVector(camDir, 1.0);
        payload.position.y -= 0.3;
        payload.visible = true;
        placed = true;
        L()?.("Placed via fallback (no reticle)", "warn");
        setShowLogs(false);
      }
    });

  } catch (e) {
    L()?.(`requestSession failed: ${e.message}`, "error");

    // ── Secondary fallback: try without local-floor ──────────────────
    L()?.("Retrying without local-floor...", "warn");
    try {
      const session2 = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: [],
        optionalFeatures: ["hit-test", "local-floor", "dom-overlay"],
        domOverlay: { root: document.getElementById("ar-overlay") },
      });

      L()?.("Session granted on retry!", "success");
      btn.style.display = "none";
      setStatus("ar-active");
      renderer.xr.setReferenceSpaceType("local");
      await renderer.xr.setSession(session2);

      session2.addEventListener("end", () => {
        hitTestSource?.cancel();
        hitTestSource = null;
        hitTestSourceRequested = false;
        placed = false;
        btn.style.display = "block";
        setStatus("ready");
      });

      session2.addEventListener("select", () => {
        if (!placed) {
          const camPos = new THREE.Vector3();
          const camDir = new THREE.Vector3();
          camera.getWorldPosition(camPos);
          camera.getWorldDirection(camDir);
          payload.position.copy(camPos).addScaledVector(camDir, 1.2);
          payload.position.y -= 0.2;
          payload.visible = true;
          placed = true;
          reticle.visible = false;
          L()?.("Placed via fallback!", "warn");
          setShowLogs(false);
        }
      });

    } catch (e2) {
      L()?.(`Retry also failed: ${e2.message}`, "error");
      L()?.("Try: close other tabs, clear site data, reopen Chrome", "warn");
      btn.style.display = "block";
      setStatus("ready");
    }
  }
});

      // ── Render loop ───────────────────────────────────────────────────
      renderer.setAnimationLoop(async (_, frame) => {
        if (!frame) return;

        const session = renderer.xr.getSession();
        const refSpace = renderer.xr.getReferenceSpace();

        // Request hit-test source once per session
        if (session && !hitTestSourceRequested) {
          hitTestSourceRequested = true;
          try {
            const viewerSpace = await session.requestReferenceSpace("viewer");
            hitTestSource = await session.requestHitTestSource({
              space: viewerSpace,
            });
            L()?.("Hit-test source ready", "success");
          } catch (e) {
            L()?.(`Hit-test source error: ${e.message}`, "error");
          }
        }

        // Update reticle from hit-test results
        if (hitTestSource && refSpace && !placed) {
          const results = frame.getHitTestResults(hitTestSource);
          if (results.length > 0) {
            const hit = results[0];
            const pose = hit.getPose(refSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
          }
        }

        renderer.render(scene, camera);
      });

      // ── Resize handler ────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      L()?.("Three.js scene ready", "success");
      setStatus("ready");

      // Store for cleanup
      container._threeRenderer = renderer;
      container._threeBtn = btn;
      container._threeResizeHandler = onResize;
    };

    return () => {
      cleanedUp = true;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
      document.documentElement.style.cssText = "";
      document.body.style.cssText = "";
      try {
        const c = containerRef.current;
        if (c?._threeResizeHandler)
          window.removeEventListener("resize", c._threeResizeHandler);
        c?._threeRenderer?.setAnimationLoop(null);
        c?._threeRenderer?.dispose();
        if (c) c.innerHTML = "";
      } catch (_) {}
    };
  }, [message, imageUrl]);

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", overflow:"hidden" }}>

      <div
        id="ar-overlay"
        style={{ position:"fixed", inset:0, zIndex:10000, pointerEvents:"none" }}
      >
        {/* Debug terminal */}
        {showLogs && (
          <div
            ref={logRef}
            style={{
              position:"absolute", top:12, left:12, right:12,
              maxHeight:"42vh", overflowY:"auto",
              background:"rgba(0,0,0,0.88)",
              border:"1px solid #00FF88", borderRadius:10,
              padding:"10px 12px",
              fontFamily:"monospace", fontSize:12,
              color:"#00FF88", whiteSpace:"pre-wrap",
              wordBreak:"break-all", zIndex:10001,
              pointerEvents:"none",
            }}
          >
            <div style={{ color:"#fff", marginBottom:6, fontWeight:"bold" }}>
              📟 AR Debug Log
            </div>
            {logs.map((l, i) => (
              <div key={i} style={{
                color: l.includes("❌") ? "#ff6b6b"
                  : l.includes("⚠️") ? "#ffd93d"
                  : l.includes("✅") ? "#00FF88"
                  : "#aaa",
                lineHeight: 1.5,
              }}>
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Toggle */}
        <div style={{ position:"absolute", top:12, right:12, zIndex:10002, pointerEvents:"auto" }}>
          <button
            onClick={() => setShowLogs((v) => !v)}
            style={{
              background:"rgba(0,0,0,0.8)", color:"#00FF88",
              border:"1px solid #00FF88", borderRadius:8,
              padding:"6px 12px", fontFamily:"monospace",
              fontSize:12, cursor:"pointer",
            }}
          >
            {showLogs ? "Hide Logs" : "Show Logs"}
          </button>
        </div>

        {/* Status pill */}
        <div style={{
          position:"absolute", bottom:130,
          left:"50%", transform:"translateX(-50%)",
          whiteSpace:"nowrap",
        }}>
          {status === "loading"     && <Pill>⏳ Loading engine…</Pill>}
          {status === "unsupported" && <Pill color="#ff6b6b">❌ AR not supported</Pill>}
          {status === "error"       && <Pill color="#ff6b6b">❌ Error — check logs</Pill>}
          {status === "ready"       && <Pill pulse>👆 Tap ENTER AR below</Pill>}
          {status === "ar-active"   && <Pill color="#00FF88" dark>🎯 Scan floor — tap to place!</Pill>}
        </div>
      </div>

      {/* Three.js canvas + button mount here */}
      <div
        ref={containerRef}
        style={{ position:"fixed", inset:0, zIndex:1 }}
      />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
      `}</style>
    </div>
  );
}

function Pill({ children, color="#fff", dark=false, pulse=false }) {
  return (
    <div style={{
      background: dark ? color : "rgba(0,0,0,0.85)",
      backdropFilter: "blur(12px)",
      color: dark ? "#000" : color,
      padding: "12px 26px",
      borderRadius: 999,
      border: `1px solid ${color}55`,
      fontSize: 13,
      fontFamily: "monospace",
      fontWeight: 600,
      textAlign: "center",
      animation: pulse ? "pulse 2s infinite" : "none",
      boxShadow: `0 0 20px ${color}22`,
    }}>
      {children}
    </div>
  );
}