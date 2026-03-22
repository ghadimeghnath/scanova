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
  const [showLogs, setShowLogs] = useState(false);
  const [placed, setPlacedState] = useState(false);
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

    const onError = (e) => L()?.(`${e.message}`, "error");
    const onUnhandled = (e) => L()?.(`Unhandled: ${e.reason?.message ?? e.reason}`, "error");
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);

    document.documentElement.style.cssText = "width:100%;height:100%;margin:0;padding:0;overflow:hidden;";
    document.body.style.cssText = "width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;";

    if (!navigator.xr) {
      L()?.("navigator.xr not found", "error");
      setStatus("unsupported");
      return;
    }

    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (!supported) { L()?.("immersive-ar not supported", "error"); setStatus("unsupported"); return; }
      L()?.("immersive-ar supported!", "success");
      loadThree();
    }).catch((e) => { L()?.(`isSessionSupported error: ${e.message}`, "error"); setStatus("unsupported"); });

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

      // ── Renderer ────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.xr.enabled = true;
      renderer.domElement.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      // ── Lighting for 3D depth feel ───────────────────────────────────────
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffd9a0, 1.2);
      dirLight.position.set(1, 3, 2);
      dirLight.castShadow = true;
      scene.add(dirLight);
      const rimLight = new THREE.PointLight(0x00e5ff, 0.8, 3);
      rimLight.position.set(-1, 1, -1);
      scene.add(rimLight);

      // ── Premium animated reticle ─────────────────────────────────────────
      const reticleGroup = new THREE.Group();
      reticleGroup.visible = false;
      reticleGroup.matrixAutoUpdate = false;
      scene.add(reticleGroup);

      // Outer ring
      const outerGeo = new THREE.RingGeometry(0.10, 0.12, 64);
      outerGeo.rotateX(-Math.PI / 2);
      const outerMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
      const outerRing = new THREE.Mesh(outerGeo, outerMat);
      reticleGroup.add(outerRing);

      // Inner dot
      const innerGeo = new THREE.CircleGeometry(0.025, 32);
      innerGeo.rotateX(-Math.PI / 2);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
      const innerDot = new THREE.Mesh(innerGeo, innerMat);
      innerDot.position.y = 0.001;
      reticleGroup.add(innerDot);

      // Scanning pulse ring
      const pulseGeo = new THREE.RingGeometry(0.12, 0.135, 64);
      pulseGeo.rotateX(-Math.PI / 2);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
      pulseRing.position.y = 0.001;
      reticleGroup.add(pulseRing);

      // Corner tick marks (luxury detail)
      const tickMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      for (let i = 0; i < 4; i++) {
        const tickGeo = new THREE.PlaneGeometry(0.04, 0.008);
        tickGeo.rotateX(-Math.PI / 2);
        const tick = new THREE.Mesh(tickGeo, tickMat);
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        tick.position.set(Math.cos(angle) * 0.16, 0.001, Math.sin(angle) * 0.16);
        tick.rotation.y = -angle;
        reticleGroup.add(tick);
      }

      // ── Payload group ────────────────────────────────────────────────────
      const payload = new THREE.Group();
      payload.visible = false;
      scene.add(payload);

      // Shadow blob under payload
      const shadowGeo = new THREE.CircleGeometry(0.22, 32);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
      });
      const shadowBlob = new THREE.Mesh(shadowGeo, shadowMat);
      shadowBlob.position.y = 0.001;
      payload.add(shadowBlob);

      // Glow ring at base
      const glowGeo = new THREE.RingGeometry(0.17, 0.22, 64);
      glowGeo.rotateX(-Math.PI / 2);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const glowRing = new THREE.Mesh(glowGeo, glowMat);
      glowRing.position.y = 0.002;
      payload.add(glowRing);

      // Image frame (slightly larger plane as border) 
      const frameMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), frameMat);
      frameMesh.position.set(0, 0.28, 0);
      payload.add(frameMesh);

      // Image plane
      const texLoader = new THREE.TextureLoader();
      const safeImg = imageUrl || "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";
      texLoader.crossOrigin = "anonymous";
      texLoader.load(safeImg, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        const imgMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
        const imgMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), imgMat);
        imgMesh.position.set(0, 0.28, 0.001);
        payload.add(imgMesh);
        L()?.("Image loaded", "success");
      });

      // Text with glow canvas
      const safeMsg = (message || "Hello AR!").slice(0, 28);
      const canvas2d = document.createElement("canvas");
      canvas2d.width = 768; canvas2d.height = 160;
      const ctx = canvas2d.getContext("2d");
      ctx.clearRect(0, 0, 768, 160);
      // Glow effect
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(safeMsg, 384, 80);
      // Second pass for extra brightness
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#FBBF24";
      ctx.fillText(safeMsg, 384, 80);

      const textTex = new THREE.CanvasTexture(canvas2d);
      const textMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.65, 0.14),
        new THREE.MeshBasicMaterial({ map: textTex, side: THREE.DoubleSide, transparent: true })
      );
      textMesh.position.set(0, 0.62, 0);
      payload.add(textMesh);

      // Vertical connector line
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 });
      const lineMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.003, 0.06), lineMat);
      lineMesh.position.set(0, 0.03, 0);
      payload.add(lineMesh);

      // ── Particle burst system ────────────────────────────────────────────
      let particles = null;
      let particleVelocities = [];
      let particleAge = 0;
      const PARTICLE_COUNT = 60;

      const spawnParticles = (pos) => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        particleVelocities = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          positions[i * 3] = pos.x;
          positions[i * 3 + 1] = pos.y + 0.01;
          positions[i * 3 + 2] = pos.z;
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.008 + Math.random() * 0.018;
          const vy = 0.005 + Math.random() * 0.012;
          particleVelocities.push({ vx: Math.cos(angle) * speed, vy, vz: Math.sin(angle) * speed, life: 1 });
        }
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.012, transparent: true, opacity: 1, sizeAttenuation: true });
        if (particles) scene.remove(particles);
        particles = new THREE.Points(geo, mat);
        scene.add(particles);
        particleAge = 0;
      };

      // ── Animation state ──────────────────────────────────────────────────
      let hitTestSource = null;
      let hitTestSourceRequested = false;
      let isPlaced = false;
      let clock = { t: 0 };
      let payloadScale = 0;
      let entryAnimating = false;

      // ── ENTER AR button ──────────────────────────────────────────────────
      const btn = document.createElement("button");
      btn.innerHTML = `<span style="font-size:22px">✦</span> &nbsp;ENTER AR`;
      btn.style.cssText = `
        position:fixed; bottom:44px; left:50%;
        transform:translateX(-50%);
        z-index:9999;
        background:linear-gradient(135deg,#00e5ff,#0072ff);
        color:#000; border:none; border-radius:99px;
        padding:20px 52px;
        font-size:17px; font-weight:900; font-family:'Georgia',serif;
        letter-spacing:0.08em;
        box-shadow:0 0 0 2px rgba(0,229,255,0.3), 0 8px 40px rgba(0,229,255,0.5);
        cursor:pointer;
      `;
      container.appendChild(btn);

      // Pulse animation via JS (CSS keyframes don't work on dynamic buttons reliably)
      let btnPulse = 0;
      const animateBtn = () => {
        btnPulse += 0.04;
        const s = 1 + Math.sin(btnPulse) * 0.03;
        btn.style.transform = `translateX(-50%) scale(${s})`;
        if (!isPlaced) requestAnimationFrame(animateBtn);
      };
      animateBtn();

      const startSession = async (requiredFeatures, optionalFeatures, refSpaceType) => {
        const session = await navigator.xr.requestSession("immersive-ar", {
          requiredFeatures,
          optionalFeatures,
          domOverlay: { root: document.getElementById("ar-overlay") },
        });
        renderer.xr.setReferenceSpaceType(refSpaceType);
        await renderer.xr.setSession(session);
        return session;
      };

      btn.addEventListener("click", async () => {
        L()?.("Requesting AR session...");
        let session = null;

        try {
          session = await startSession(["local-floor"], ["hit-test", "dom-overlay"], "local-floor");
          L()?.("Session granted (local-floor)", "success");
        } catch {
          L()?.("local-floor failed, retrying...", "warn");
          try {
            session = await startSession([], ["hit-test", "local-floor", "dom-overlay"], "local");
            L()?.("Session granted (local fallback)", "success");
          } catch (e2) {
            L()?.(`All attempts failed: ${e2.message}`, "error");
            setStatus("ready");
            return;
          }
        }

        btn.style.display = "none";
        setStatus("ar-active");

        session.addEventListener("end", () => {
          L()?.("Session ended");
          hitTestSource?.cancel(); hitTestSource = null;
          hitTestSourceRequested = false; isPlaced = false;
          payloadScale = 0; payload.visible = false;
          btn.style.display = "block";
          setStatus("ready"); setPlacedState(false);
        });

        session.addEventListener("select", () => {
          if (isPlaced) return;

          let pos;
          if (reticleGroup.visible) {
            pos = new THREE.Vector3().setFromMatrixPosition(reticleGroup.matrix);
          } else {
            // Fallback: place 1.2m in front of camera
            const camPos = new THREE.Vector3();
            const camDir = new THREE.Vector3();
            camera.getWorldPosition(camPos);
            camera.getWorldDirection(camDir);
            pos = camPos.clone().addScaledVector(camDir, 1.2);
            pos.y -= 0.3;
          }

          payload.position.copy(pos);
          payload.visible = true;
          payloadScale = 0;
          entryAnimating = true;
          isPlaced = true;
          reticleGroup.visible = false;

          spawnParticles(pos);
          setPlacedState(true);
          L()?.("✨ Placed!", "success");
        });
      });

      // ── Render loop ──────────────────────────────────────────────────────
      renderer.setAnimationLoop(async (timestamp, frame) => {
        clock.t = timestamp * 0.001;

        if (!frame) { renderer.render(scene, camera); return; }

        const session = renderer.xr.getSession();
        const refSpace = renderer.xr.getReferenceSpace();

        // Request hit-test source once
        if (session && !hitTestSourceRequested) {
          hitTestSourceRequested = true;
          try {
            const viewerSpace = await session.requestReferenceSpace("viewer");
            hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
            L()?.("Hit-test ready", "success");
          } catch (e) {
            L()?.(`Hit-test error: ${e.message}`, "warn");
          }
        }

        // Update reticle
        if (hitTestSource && refSpace && !isPlaced) {
          const results = frame.getHitTestResults(hitTestSource);
          if (results.length > 0) {
            const pose = results[0].getPose(refSpace);
            if (pose) {
              reticleGroup.visible = true;
              reticleGroup.matrix.fromArray(pose.transform.matrix);
              reticleGroup.matrixWorldNeedsUpdate = true;
            }
          } else {
            reticleGroup.visible = false;
          }
        }

        // ── Reticle animations ─────────────────────────────────────────
        if (reticleGroup.visible) {
          outerRing.rotation.y = clock.t * 1.2;
          // Pulse ring breathes in/out
          const pulse = 1 + Math.sin(clock.t * 3) * 0.12;
          pulseRing.scale.set(pulse, 1, pulse);
          pulseMat.opacity = 0.2 + Math.sin(clock.t * 3) * 0.15;
          // Inner dot flickers
          innerMat.opacity = 0.7 + Math.sin(clock.t * 6) * 0.3;
        }

        // ── Payload entry animation (pop in with bounce) ───────────────
        if (entryAnimating && payload.visible) {
          payloadScale += (1 - payloadScale) * 0.18;
          if (payloadScale > 0.985) { payloadScale = 1; entryAnimating = false; }
          payload.scale.setScalar(payloadScale);
        }

        // ── Payload idle float ─────────────────────────────────────────
        if (isPlaced && !entryAnimating) {
          const baseY = payload.userData.baseY ?? payload.position.y;
          payload.userData.baseY = baseY;
          payload.position.y = baseY + Math.sin(clock.t * 1.4) * 0.018;
          payload.rotation.y = Math.sin(clock.t * 0.5) * 0.06;

          // Glow ring pulse
          const gp = 1 + Math.sin(clock.t * 2) * 0.08;
          glowRing.scale.set(gp, 1, gp);
          glowMat.opacity = 0.15 + Math.sin(clock.t * 2) * 0.1;

          // Shadow breathes inversely
          shadowMat.opacity = 0.35 - Math.sin(clock.t * 1.4) * 0.08;

          // Rim light orbits
          rimLight.position.set(
            Math.cos(clock.t * 0.8) * 1.5,
            1.2,
            Math.sin(clock.t * 0.8) * 1.5
          );
        }

        // ── Particle system update ─────────────────────────────────────
        if (particles) {
          particleAge += 0.025;
          const pos = particles.geometry.attributes.position.array;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] += particleVelocities[i].vx;
            pos[i * 3 + 1] += particleVelocities[i].vy;
            pos[i * 3 + 2] += particleVelocities[i].vz;
            particleVelocities[i].vy -= 0.0006; // gravity
            particleVelocities[i].life -= 0.018;
          }
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.opacity = Math.max(0, 1 - particleAge * 0.8);
          if (particleAge > 2.5) { scene.remove(particles); particles = null; }
        }

        renderer.render(scene, camera);
      });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      L()?.("Scene ready", "success");
      setStatus("ready");

      container._threeRenderer = renderer;
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
        if (c?._threeResizeHandler) window.removeEventListener("resize", c._threeResizeHandler);
        c?._threeRenderer?.setAnimationLoop(null);
        c?._threeRenderer?.dispose();
        if (c) c.innerHTML = "";
      } catch (_) {}
    };
  }, [message, imageUrl]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>

      {/* DOM Overlay */}
      <div id="ar-overlay" style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none" }}>

        {/* Debug terminal (hidden by default) */}
        {showLogs && (
          <div ref={logRef} style={{
            position: "absolute", top: 12, left: 12, right: 60,
            maxHeight: "38vh", overflowY: "auto",
            background: "rgba(0,0,0,0.92)", border: "1px solid #00FF88",
            borderRadius: 10, padding: "10px 12px",
            fontFamily: "monospace", fontSize: 11,
            color: "#00FF88", whiteSpace: "pre-wrap", wordBreak: "break-all",
            pointerEvents: "none",
          }}>
            <div style={{ color: "#fff", marginBottom: 6, fontWeight: "bold" }}>📟 Debug</div>
            {logs.map((l, i) => (
              <div key={i} style={{
                color: l.includes("❌") ? "#ff6b6b" : l.includes("⚠️") ? "#ffd93d" : l.includes("✅") ? "#00FF88" : "#888",
                lineHeight: 1.5,
              }}>{l}</div>
            ))}
          </div>
        )}

        {/* Debug toggle (tiny, top-right) */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 10002, pointerEvents: "auto" }}>
          <button onClick={() => setShowLogs(v => !v)} style={{
            background: "rgba(0,0,0,0.6)", color: "#666",
            border: "1px solid #333", borderRadius: 6,
            padding: "4px 8px", fontSize: 10,
            fontFamily: "monospace", cursor: "pointer",
          }}>
            {showLogs ? "✕" : "dbg"}
          </button>
        </div>

        {/* Status area */}
        <div style={{
          position: "absolute", bottom: 130, left: "50%",
          transform: "translateX(-50%)", whiteSpace: "nowrap",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          {status === "loading" && <ScanLine />}
          {status === "unsupported" && <Chip color="#ff6b6b">❌ AR not supported on this device</Chip>}
          {status === "error" && <Chip color="#ff6b6b">❌ Failed — tap debug for details</Chip>}
          {status === "ready" && (
            <>
              <Chip pulse accent>✦ &nbsp;Tap ENTER AR below</Chip>
            </>
          )}
          {status === "ar-active" && !placed && (
            <ScanPrompt />
          )}
          {status === "ar-active" && placed && (
            <Chip color="#00FF88" dark>✦ &nbsp;Tap to place again</Chip>
          )}
        </div>
      </div>

      {/* Three.js canvas */}
      <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 1 }} />

      <style>{`
        @keyframes pulse-opacity { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes scan-move { 0%{transform:translateY(0)} 100%{transform:translateY(60px)} }
        @keyframes chip-in { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Chip({ children, color = "#fff", dark = false, pulse = false, accent = false }) {
  return (
    <div style={{
      background: dark
        ? color
        : accent
          ? "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(0,114,255,0.1))"
          : "rgba(0,0,0,0.82)",
      backdropFilter: "blur(16px)",
      color: dark ? "#000" : color,
      padding: "13px 28px",
      borderRadius: 999,
      border: accent ? "1px solid rgba(0,229,255,0.5)" : `1px solid ${color}44`,
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textAlign: "center",
      animation: pulse ? "pulse-opacity 2s infinite" : "none",
      boxShadow: accent
        ? "0 0 24px rgba(0,229,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
        : `0 0 20px ${color}22`,
    }}>
      {children}
    </div>
  );
}

function ScanPrompt() {
  return (
    <div style={{
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0,229,255,0.4)",
      borderRadius: 16,
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 0 30px rgba(0,229,255,0.15)",
    }}>
      {/* Animated scan icon */}
      <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid #00e5ff",
          borderRadius: 4,
        }} />
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg,transparent,#00e5ff,transparent)",
          top: "40%",
          animation: "scan-move 1.2s ease-in-out infinite alternate",
        }} />
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: 13, fontFamily: "'Georgia',serif", fontWeight: 700, letterSpacing: "0.05em" }}>
          Scanning surface…
        </div>
        <div style={{ color: "rgba(0,229,255,0.7)", fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>
          Point at floor · Tap cyan ring to place
        </div>
      </div>
    </div>
  );
}

function ScanLine() {
  return (
    <div style={{
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999,
      padding: "12px 26px",
      color: "rgba(255,255,255,0.6)",
      fontSize: 12,
      fontFamily: "monospace",
      letterSpacing: "0.1em",
      animation: "pulse-opacity 1.5s infinite",
    }}>
      INITIALIZING SPATIAL ENGINE…
    </div>
  );
}