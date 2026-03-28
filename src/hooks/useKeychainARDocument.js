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
    @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Gochi+Hand&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
    
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
      group.scale.set(0, 0, 0); 
      anchor.group.add(group);

      const floaters = [];

      // ── 1. Photo plane (FIXED Z-FIGHTING FLICKER) ─────────────────────────
      const photoUrl = \`${safeImage}\`;
      if (photoUrl) {
        const loader  = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        const tex = await new Promise((resolve, reject) => {
          loader.load(photoUrl, resolve, undefined, reject);
        }).catch(() => null);

        if (tex) {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipMapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;

          // Hard black offset shadow (Pushed furthest back)
          const shadowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.05, 1.05),
            new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
          );
          shadowMesh.position.set(0.04, -0.04, -0.04); 
          
          // Thick Black Border
          const borderMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.05, 1.05),
            new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
          );
          borderMesh.position.set(0, 0, -0.02);

          // Inner White Frame
          const frameMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.0, 1.0),
            new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
          );
          frameMesh.position.set(0, 0, 0.01);

          // Photo itself (Pulled furthest forward)
          const photoMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.95, 0.95),
            new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
          );
          photoMesh.position.set(0, 0, 0.03);
          
          const photoGroup = new THREE.Group();
          photoGroup.add(shadowMesh, borderMesh, frameMesh, photoMesh);
          photoGroup.userData = { baseY: 0 };
          group.add(photoGroup);
          floaters.push(photoGroup);
        }
      }

      // ── 2. Funky Typography ─────────────────────────
      const msg = \`${safeMsg}\`;
      if (msg.trim()) {
        try { await document.fonts.load('90px "Titan One"'); } catch(e) { console.warn("Font load failed"); }

        const canvas  = document.createElement('canvas');
        canvas.width  = 1024;
        canvas.height = 256;
        const ctx     = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1024, 256);

        const textToRender = msg.slice(0, 30);
        let fontSize = 90;
        ctx.font = \`\${fontSize}px "Titan One", cursive\`;
        
        const maxWidth = 960;
        while (ctx.measureText(textToRender).width > maxWidth && fontSize > 30) {
          fontSize -= 2;
          ctx.font = \`\${fontSize}px "Titan One", cursive\`;
        }

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor   = '#000000';
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        
        ctx.lineWidth   = Math.max(8, fontSize / 6);
        ctx.strokeStyle = '#000000';
        ctx.strokeText(textToRender, 512, 128);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle   = '#22D3EE'; 
        ctx.fillText(textToRender, 512, 128);

        const textTex = new THREE.CanvasTexture(canvas);
        textTex.colorSpace = THREE.SRGBColorSpace;
        textTex.minFilter = THREE.LinearFilter;

        const textMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.4, 0.35),
          new THREE.MeshBasicMaterial({
            map        : textTex,
            transparent: true,
            side       : THREE.DoubleSide,
          })
        );
        // Pulled forward slightly so it doesn't clip the shadow
        textMesh.position.set(0, -0.7, 0.05);
        textMesh.userData = { baseY: -0.7 };
        group.add(textMesh);
        floaters.push(textMesh);
      }

      // ── 3. Solid Particle Confetti ────────────────────
      const particleGroup = new THREE.Group();
      const COUNT = 40;
      const pos   = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const a = (i / COUNT) * Math.PI * 2;
        pos[i*3]   = Math.cos(a) * 0.85; 
        pos[i*3+1] = 0.02; // Brought forward to avoid clipping
        pos[i*3+2] = Math.sin(a) * 0.85;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      
      particleGroup.add(new THREE.Points(pGeo,
        new THREE.PointsMaterial({
          color       : 0xF472B6, 
          size        : 0.035,    
          transparent : true,
          opacity     : 1.0,
          blending    : THREE.NormalBlending
        })
      ));
      group.add(particleGroup);

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
        renderer.toneMapping         = THREE.NoToneMapping; 
        renderer.outputColorSpace    = THREE.SRGBColorSpace; 
        renderer.setClearColor(0x000000, 0); 

        const anchor = mindarThree.addAnchor(themeIndex);
        const { mainGroup, floaters, particleGroup } = await buildARContent(anchor);

        let isAnimated = false;
        
        anchor.onTargetFound = () => {
          notify('found');
          
          if (!isAnimated) {
            isAnimated = true;

            gsap.fromTo(mainGroup.scale, 
              { x: 0, y: 0, z: 0 }, 
              { x: 1, y: 1, z: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
            );

            floaters.forEach((floater, i) => {
              gsap.to(floater.position, {
                y: floater.userData.baseY + 0.05,
                duration: 2 + (i * 0.2), 
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
              });
            });

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
        };

        await mindarThree.start();
        notify('tracking');

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