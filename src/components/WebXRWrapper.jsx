"use client";

import dynamic from "next/dynamic";

// 1. We move the dynamic import safely into a Client Component
const WebXRSceneNoSSR = dynamic(() => import("@/components/WebXRScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full flex-col items-center justify-center text-white font-mono gap-4">
      <div className="w-8 h-8 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
      <p>Initializing Spatial Engine...</p>
    </div>
  ),
});

export default function WebXRWrapper({ message, imageUrl }) {
  // 2. We just pass the database data straight through
  return <WebXRSceneNoSSR message={message} imageUrl={imageUrl} />;
}