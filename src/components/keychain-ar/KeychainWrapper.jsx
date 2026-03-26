// components/keychain-ar/KeychainWrapper.jsx
// Dynamic import wrapper — prevents SSR of MindAR (browser-only APIs).
"use client";

import dynamic from "next/dynamic";

const KeychainARScene = dynamic(
  () => import("@/components/keychain-ar/KeychainARScene"),
  {
    ssr    : false,
    loading: () => (
      <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center gap-4 font-mono text-white/40 text-xs tracking-[0.15em]">
        <div className="w-9 h-9 border-2 border-[#00e5ff]/30 border-t-[#00e5ff] rounded-full animate-spin" />
        LOADING AR ENGINE…
      </div>
    ),
  }
);

export default function KeychainWrapper({ imageUrl, message, theme, code }) {
  return (
    <KeychainARScene
      imageUrl={imageUrl}
      message={message}
      theme={theme}
      code={code}
    />
  );
}