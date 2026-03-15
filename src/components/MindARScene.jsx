"use client";

import { useEffect, useState } from "react";

export default function MindARScene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 1. Load the scripts safely
  useEffect(() => {
    const loadScripts = async () => {
      const aframeScript = document.createElement("script");
      aframeScript.src = "https://aframe.io/releases/1.3.0/aframe.min.js";
      document.head.appendChild(aframeScript);

      aframeScript.onload = () => {
        const mindarScript = document.createElement("script");
        mindarScript.src = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";
        document.head.appendChild(mindarScript);

        mindarScript.onload = () => setIsLoaded(true);
      };
    };
    loadScripts();
  }, []);

  // 2. The Magic Bridge: Listen for MindAR finding the image
  useEffect(() => {
    if (!isLoaded) return;

    // We poll briefly to wait for A-Frame to inject the DOM element
    const interval = setInterval(() => {
      const target = document.getElementById("card-target");
      if (target) {
        // Once MindAR sees the physical card, unlock the experience!
        target.addEventListener("targetFound", () => {
          setIsUnlocked(true);
        });
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-white font-mono">
        Loading AR Engine...
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent">
      
      {/* --- UI STATE 1: SCANNING --- */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-4 border-white/50 border-dashed rounded-2xl animate-pulse"></div>
          <p className="mt-6 text-white font-bold drop-shadow-lg text-lg bg-black/50 px-4 py-2 rounded-full">
            Point camera at the Raccoon card...
          </p>
        </div>
      )}

      {/* --- UI STATE 2: UNLOCKED & FLOATING --- */}
      {isUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl backdrop-blur-md max-w-sm w-full text-center transform transition-all duration-700 ease-out animate-in fade-in zoom-in">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
              Happy Birthday!
            </h1>
            <p className="text-white text-lg">
              You've unlocked this secret AR message. You can put the card down now!
            </p>
            <button 
              onClick={() => setIsUnlocked(false)}
              className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors border border-white/30"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}

      {/* --- THE AR ENGINE (Runs invisibly in the background once unlocked) --- */}
      <div className="absolute inset-0 z-0">
        <div
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{
            __html: `
              <a-scene 
                mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind; autoStart: true; uiLoading: no; uiError: no;" 
                vr-mode-ui="enabled: false" 
                device-orientation-permission-ui="enabled: false"
              >
                <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
                
                <a-entity id="card-target" mindar-image-target="targetIndex: 0"></a-entity>
              </a-scene>
            `,
          }}
        />
      </div>
    </div>
  );
}