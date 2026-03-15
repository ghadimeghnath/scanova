"use client"

import dynamic from "next/dynamic"

// Force Client-Side Rendering only
const MindARNoSSR = dynamic(() => import("@/components/MindARScene"), {
  ssr: false
})

export default function MindARPage() {
  return (
    <main className="h-screen w-screen bg-transparent">
      <MindARNoSSR />
    </main>
  )
}
