"use client";

import dynamic from "next/dynamic";

const StickerARScene = dynamic(() => import("./StickerARScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center gap-4 font-mono text-white/40 text-xs tracking-[0.15em]">
      <div className="w-9 h-9 border-2 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full animate-spin" />
      LOADING AR ENGINE…
    </div>
  ),
});

export default function StickerWrapper({ targetImage, assetUrl, message, code }) {
  return <StickerARScene targetImage={targetImage} assetUrl={assetUrl} message={message} code={code} />;
}