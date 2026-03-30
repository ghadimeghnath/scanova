"use client";

import dynamic from "next/dynamic";

const StickerARScene = dynamic(() => import("./StickerARScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 z-50">
      {/* Funky Neobrutalist Spinner */}
        <div className="w-16 h-16 bg-sc-yellow border-4 rounded-full border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-[spin_1.5s_linear_infinite]" />
      
      {/* Bold Typography */}
      <div className="font-heading text-xl tracking-widest uppercase text-foreground drop-shadow-[2px_2px_0_var(--color-sc-purple)]">
        Loading AR Engine...
      </div>
    </div>
  ),
});

export default function StickerWrapper({ targetImage, assetUrl, message, code }) {
  return (
    <StickerARScene 
      targetImage={targetImage} 
      assetUrl={assetUrl} 
      message={message} 
      code={code} 
    />
  );
}