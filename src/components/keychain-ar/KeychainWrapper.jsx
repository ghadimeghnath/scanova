// components/keychain-ar/KeychainWrapper.jsx
// Dynamic import wrapper — prevents SSR of MindAR (browser-only APIs).
"use client";

import dynamic from "next/dynamic";

const KeychainARScene = dynamic(
  () => import("@/components/keychain-ar/KeychainARScene"),
  {
    ssr    : false,
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