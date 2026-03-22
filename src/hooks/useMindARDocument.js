// hooks/useMindARDocument.js

export function buildMindARDocument({ targetImage, assetUrl, message }) {
  const safeMsg    = (message   || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  const safeTarget = (targetImage || "").replace(/`/g, "\\`");
  const safeAsset  = (assetUrl   || "").replace(/`/g, "\\`");

  return /* html */`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      margin: 0; padding: 0;
      overflow: hidden;
      background: transparent; /* CRITICAL: iframe bg must be transparent */
    }

    /* ── MindAR mounts here ── */
    #container {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      overflow: hidden;
    }

    /*
     * MindAR injects a <video> and a <canvas> into #container.
     * We must force them to fill the container and sit behind the canvas.
     * Without this the video is 0x0 or mispositioned.
     */
    #container video {
      position: absolute !important;
      top: 0 !important; left: 0 !important;
      width: 100% !important; height: 100% !important;
      object-fit: cover !important;
      z-index: 0 !important;
      display: block !important;
    }
    #container canvas {
      position: absolute !important;
      top: 0 !important; left: 0 !important;
      width: 100% !important; height: 100% !important;
      z-index: 1 !important;
    }
  </style>

  <!-- importmap MUST be the first script and declared before any module script -->
  <script type="importmap">
  {
    "imports": {
      "three":               "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/":       "https://unpkg.com/three@0.160.0/examples/jsm/",
      "mindar-image-three":  "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
    }
  }
  </script>
</head>
<body>
  <div id="container"></div>

  <script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { MindARThree } from 'mindar-image-three';

    // ── PostMessage to parent React overlay ────────────────────────────────
    const notify = (phase, extra = {}) =>
      window.parent.postMessage({ type: 'mindar-phase', phase, ...extra }, '*');

    // ── Resolve .mind: direct URL or compile from raw image ────────────────
    async function resolveMindSrc(imageUrl) {
      if (!imageUrl) throw new Error('No target image provided');

      const lc = imageUrl.toLowerCase();
      if (lc.includes('.mind')) return imageUrl; // already compiled

      // Raw image → compile on-device via MindAR Compiler
      notify('compiling', { progress: 0 });
      const { Compiler } = await import('mindar-image-three');

      const res = await fetch(imageUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('Image fetch failed: ' + res.status);

      const blobUrl = URL.createObjectURL(await res.blob());
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.crossOrigin = 'anonymous';
        el.onload  = () => resolve(el);
        el.onerror = () => reject(new Error('Image element load failed'));
        el.src = blobUrl;
      });

      const compiler = new Compiler();
      await compiler.compileImageTargets([img], (p) =>
        notify('compiling', { progress: Math.round(p * 100) })
      );

      const buffer = await compiler.exportData();
      URL.revokeObjectURL(blobUrl);
      return URL.createObjectURL(new Blob([buffer]));
    }

    // ── Procedural chrome art ──────────────────────────────────────────────
    function buildProceduralArt(group) {
      // Chrome torus knot
      const torus = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.15, 0.04, 128, 16),
        new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.96, roughness: 0.04 })
      );
      torus.position.set(0, 0.35, 0.05);
      torus.castShadow = true;
      torus.userData = { spin: true };
      group.add(torus);

      // Cyan particle orbit ring
      const COUNT = 48;
      const pos = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const a = (i / COUNT) * Math.PI * 2;
        pos[i*3] = Math.cos(a) * 0.3; pos[i*3+1] = 0.05; pos[i*3+2] = Math.sin(a) * 0.3;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      group.add(new THREE.Points(pGeo,
        new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.016, transparent: true, opacity: 0.85 })
      ));

      // Ground glow disc
      const discGeo = new THREE.CircleGeometry(0.3, 48);
      discGeo.rotateX(-Math.PI / 2);
      group.add(new THREE.Mesh(discGeo,
        new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
      ));

      // Floating message
      const msg = \`${safeMsg}\`;
      if (msg.trim()) {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 512, 96);
        ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 52px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(msg.slice(0, 22), 256, 48);
        ctx.shadowBlur = 10; ctx.fillStyle = '#FBBF24';
        ctx.fillText(msg.slice(0, 22), 256, 48);
        const textMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.65, 0.12),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, side: THREE.DoubleSide })
        );
        textMesh.position.set(0, -0.12, 0.01);
        textMesh.userData = { float: true, baseY: -0.12 };
        group.add(textMesh);
      }
    }

    // ── GLB loader with procedural fallback ────────────────────────────────
    function loadGLB(url, group) {
      return new Promise((resolve) => {
        new GLTFLoader().load(url,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.12, 0.12, 0.12);
            model.userData = { float: true, baseY: 0 };
            model.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
            group.add(model);
            resolve();
          },
          undefined,
          () => { buildProceduralArt(group); resolve(); }
        );
      });
    }

    // ── MAIN ───────────────────────────────────────────────────────────────
    async function main() {
      try {
        notify('loading');

        const targetSrc = \`${safeTarget}\`;
        const assetSrc  = \`${safeAsset}\`;

        // 1. Resolve .mind file
        const mindSrc = await resolveMindSrc(targetSrc);
        notify('loading');

        // 2. Create MindARThree
        const mindarThree = new MindARThree({
          container      : document.querySelector('#container'),
          imageTargetSrc : mindSrc,
          maxTrack       : 1,
          uiLoading      : 'no',
          uiScanning     : 'no',
          uiError        : 'no',
          filterMinCF    : 0.0001,
          filterBeta     : 0.001,
          missTolerance  : 5,
          warmupTolerance: 3,
        });

        const { renderer, scene, camera } = mindarThree;

        // 3. Renderer settings
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping         = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled   = true;
        renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
        // CRITICAL: renderer canvas background must be transparent
        renderer.setClearColor(0x000000, 0);

        // 4. Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffd9a0, 1.3);
        dirLight.position.set(2, 4, 2);
        dirLight.castShadow = true;
        scene.add(dirLight);
        const rimLight = new THREE.PointLight(0x00e5ff, 0.9, 6);
        rimLight.position.set(-2, 2, -1);
        scene.add(rimLight);

        // 5. Anchor + art
        const anchor   = mindarThree.addAnchor(0);
        const artGroup = new THREE.Group();
        anchor.group.add(artGroup);

        if (assetSrc && /\\.(glb|gltf)$/i.test(assetSrc)) {
          await loadGLB(assetSrc, artGroup);
        } else {
          buildProceduralArt(artGroup);
        }

        // 6. Tracking events
        anchor.onTargetFound = () => notify('found');
        anchor.onTargetLost  = () => notify('tracking');

        // 7. Start MindAR (opens camera, starts tracking)
        await mindarThree.start();
        notify('tracking');

        // 8. After start(), force video styles again
        // MindAR re-injects the video element during start() so CSS from
        // above may not have applied yet — we enforce it here too.
        const container = document.querySelector('#container');
        const video = container.querySelector('video');
        if (video) {
          video.style.cssText = [
            'position:absolute', 'top:0', 'left:0',
            'width:100%', 'height:100%',
            'object-fit:cover', 'z-index:0',
            'display:block',
          ].join('!important;') + '!important';
          video.setAttribute('playsinline', 'true');
          video.setAttribute('muted', 'true');
        }

        // 9. Render loop
        let t = 0;
        renderer.setAnimationLoop(() => {
          t += 0.016;
          artGroup.traverse(c => {
            if (c.userData.spin)  c.rotation.y += 0.018;
            if (c.userData.float) c.position.y = (c.userData.baseY ?? 0) + Math.sin(t * 1.4) * 0.04;
          });
          rimLight.position.set(Math.cos(t * 0.9) * 2.5, 2, Math.sin(t * 0.9) * 2.5);
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('[MindAR iframe]', err);
        notify('error', { message: err.message });
      }
    }

    main();
  </script>
</body>
</html>`;
}