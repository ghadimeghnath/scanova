// src/app/keychain/[code]/page.jsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import KeychainSetupPage from "@/components/keychain-ar/KeychainSetupPage";
import KeychainARScene  from "@/components/keychain-ar/KeychainARScene";

export default async function KeychainPage({ params }) {
  const { code } = await params;

  const experience = await prisma.aRExperience.findUnique({ where: { code } });

  if (!experience || !experience.isActive) notFound();

  if (!experience.claimed) {
    return <KeychainSetupPage code={code} />;
  }

  return (
    <KeychainARScene
      imageUrl={experience.imageUrl}
      message={experience.message}
      // theme      = physical target index → tells MindAR WHICH keychain design to track
      // colorIndex = user's color choice   → drives AR overlay palette
      // These are now independent fields. Never pass one where the other is expected.
      theme={experience.theme}
      colorIndex={experience.colorIndex}
      code={code}
    />
  );
}