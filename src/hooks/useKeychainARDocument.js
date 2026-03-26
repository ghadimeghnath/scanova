// hooks/useKeychainARDocument.js

export const THEME_INDEX = {
  love        : 0,
  celebration : 1,
  memory      : 2,
  achievement : 3,
  custom      : 4,
};

export function buildKeychainARDocument({ imageUrl, message, themeIndex = 0 }) {
  const safeMsg   = (message  || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  const safeImage = (imageUrl || "").replace(/`/g, "\\`");
  const idx       = Number.isInteger(themeIndex) ? themeIndex : 0;

  return /* html */`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      margin: 0; padding: 0;
      overflow: hidden;
      background: transparent;
    }
    #container {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      overflow: hidden;
    }
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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

  <script type="importmap">
  {
    "imports": {
      "three":              "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/":      "https://unpkg.com/three@0.160.0/examples/jsm/",
      "mindar-image-three": "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
    }
  }
  </script>
</head>
<body>
  <div id="container"></div>

  <script type="module">
    import * as THREE from 'three';
    import { MindARThree } from 'mindar-image-three';

    const notify = (phase, extra = {}) =>
      window.parent.postMessage({ type: 'mindar-phase', phase, ...extra }, '*');

    async function buildARContent(anchor) {
      const group = new THREE.Group();
      // Hide initially for GSAP entrance animation
      group.scale.set(0, 0, 0); 
      anchor.group.add(group);

      // We will store objects we want to animate continuously
      const floaters = [];

      // ── 1. Photo plane (Fixing dullness!) ──────────────────────────────────
      const photoUrl = \`${safeImage}\`;
      if (photoUrl) {
        const loader  = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        const tex = await new Promise((resolve, reject) => {
          loader.load(photoUrl, resolve, undefined, reject);
        }).catch(() => null);

        if (tex) {
          // 🔥 CRITICAL FIX FOR DULL IMAGES: Use proper SRGB Color Space
          tex.colorSpace = THREE.SRGBColorSpace;
          
          // Better texture filtering for clarity
          tex.minFilter = THREE.LinearMipMapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;

          // Glowing backlight behind the photo to make it pop from the background
          const glowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.85, 0.85),
            new THREE.MeshBasicMaterial({
              color: 0x00e5ff,
              transparent: true,
              opacity: 0.3,
              blending: THREE.AdditiveBlending // Makes it glow brightly
            })
          );
          glowMesh.position.set(0, 0.35, -0.005);
          group.add(glowMesh);

          // White border frame
          const frameMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.82, 0.82),
            new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
          );
          frameMesh.position.set(0, 0.35, 0.001);
          group.add(frameMesh);

          // Photo itself
          const photoMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.78, 0.78),
            new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
          );
          photoMesh.position.set(0, 0.35, 0.002);
          
          // Group the photo and frame together so they float together
          const photoGroup = new THREE.Group();
          photoGroup.add(glowMesh, frameMesh, photoMesh);
          photoGroup.userData = { baseY: 0 };
          group.add(photoGroup);
          floaters.push(photoGroup);
        }
      }

      // ── 2. Glowing message text (Fixing clarity!) ──────────────────────────
      const msg = \`${safeMsg}\`;
      if (msg.trim()) {
        const canvas  = document.createElement('canvas');
        // 🔥 CRITICAL FIX FOR BLURRY TEXT: Double the canvas resolution (DPI scaling)
        canvas.width  = 1024;
        canvas.height = 256;
        const ctx     = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1024, 256);

        // Heavy dark drop-shadow so text is readable on bright backgrounds
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur  = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        ctx.font        = 'bold 90px Georgia, serif';
        ctx.textAlign   = 'center';
        ctx.textBaseline= 'middle';
        
        // Base white text
        ctx.fillStyle   = '#ffffff';
        ctx.fillText(msg.slice(0, 24), 512, 128);

        // Additive Glow Layer
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur  = 30;
        ctx.fillStyle   = '#00e5ff';
        ctx.fillText(msg.slice(0, 24), 512, 128);

        const textTex = new THREE.CanvasTexture(canvas);
        textTex.colorSpace = THREE.SRGBColorSpace; // Keeps colors true
        textTex.minFilter = THREE.LinearFilter;

        const textMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.2, 0.3), // Scaled to match new canvas ratio
          new THREE.MeshBasicMaterial({
            map        : textTex,
            transparent: true,
            side       : THREE.DoubleSide,
          })
        );
        textMesh.position.set(0, -0.2, 0.005);
        textMesh.userData = { baseY: -0.2 };
        group.add(textMesh);
        floaters.push(textMesh);
      }

      // ── 3. Particle ring ─────────────────────────────────────────────────
      const particleGroup = new THREE.Group();
      const COUNT = 60;
      const pos   = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const a = (i / COUNT) * Math.PI * 2;
        pos[i*3]   = Math.cos(a) * 0.5;
        pos[i*3+1] = 0.005;
        pos[i*3+2] = Math.sin(a) * 0.5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      particleGroup.add(new THREE.Points(pGeo,
        new THREE.PointsMaterial({
          color      : 0x00e5ff,
          size       : 0.015,
          transparent: true,
          opacity    : 0.9,
          blending   : THREE.AdditiveBlending
        })
      ));
      group.add(particleGroup);

      // Return both the main group, the elements to float, and the particles
      return { mainGroup: group, floaters, particleGroup };
    }

    // ── MAIN ───────────────────────────────────────────────────────────────
    async function main() {
      try {
        notify('loading');

        const mindSrc    = 'https://res.cloudinary.com/dcwlvb4kb/raw/upload/v1774536751/master-themes_vtfoan.mind';
        const themeIndex = ${idx}; 

        const mindarThree = new MindARThree({
          container      : document.querySelector('#container'),
          imageTargetSrc : mindSrc,
          maxTrack       : 1,
          filterMinCF    : 0.0001,
          filterBeta     : 0.001,
          missTolerance  : 5,
          warmupTolerance: 3,
          uiLoading      : 'no',
          uiScanning     : 'no',
          uiError        : 'no',
        });

        const { renderer, scene, camera } = mindarThree;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Tone mapping isn't strictly needed for MeshBasicMaterial, but good for overall scene config
        renderer.toneMapping         = THREE.NoToneMapping; 
        renderer.outputColorSpace    = THREE.SRGBColorSpace; // CRITICAL for accurate colors
        renderer.setClearColor(0x000000, 0); 

        const anchor = mindarThree.addAnchor(themeIndex);
        const { mainGroup, floaters, particleGroup } = await buildARContent(anchor);

        // ── GSAP ANIMATIONS ────────────────────────────────────────────────
        let isAnimated = false;
        
        anchor.onTargetFound = () => {
          notify('found');
          
          if (!isAnimated) {
            isAnimated = true;

            // 1. Entrance Pop Animation
            gsap.fromTo(mainGroup.scale, 
              { x: 0, y: 0, z: 0 }, 
              { x: 1, y: 1, z: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
            );

            // 2. Continuous Floating Animation for Photo and Text
            floaters.forEach((floater, i) => {
              gsap.to(floater.position, {
                y: floater.userData.baseY + 0.05, // Float up by 5cm
                duration: 2 + (i * 0.2), // Slight offset between photo and text
                yoyo: true, // Go back down
                repeat: -1, // Loop forever
                ease: "sine.inOut"
              });
            });

            // 3. Continuous Spinning Particle Ring
            gsap.to(particleGroup.rotation, {
              y: Math.PI * 2,
              duration: 8,
              repeat: -1,
              ease: "none"
            });
          }
        };

        anchor.onTargetLost = () => {
          notify('tracking');
          // Optional: You could reset 'isAnimated' here if you want it to pop in every single time they lose/regain tracking.
          // isAnimated = false; 
        };

        await mindarThree.start();
        notify('tracking');

        // Render loop (no manual math needed, GSAP handles all the movement!)
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('[KeychainAR iframe]', err);
        notify('error', { message: err.message });
      }
    }

    main();
  </script>
</body>
</html>`;
}