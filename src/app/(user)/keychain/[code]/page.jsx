// app/keychain/[code]/page.jsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import WebXRWrapper from "@/components/WebXRWrapper";
import KeychainSetupPage from "@/components/keychain-ar/KeychainSetupPage";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return {
    title      : `SCANOVA Keychain — ${code}`,
    description: "Activate your SCANOVA AR keychain.",
  };
}

export default async function KeychainViewerPage({ params }) {
  const { code } = await params;

  const experience = await prisma.aRExperience.findUnique({
    where: { code },
  });

  // Invalid or deactivated code
  if (!experience || !experience.isActive) notFound();

  // ── CLAIMED → show AR directly ────────────────────────────────────────────
  if (experience.claimed) {
    return (
      <WebXRWrapper
        message={experience.message}
        imageUrl={experience.imageUrl}
        shortCode={experience.code}
      />
    );
  }

  // ── UNCLAIMED → show one-time setup form ──────────────────────────────────
  return <KeychainSetupPage code={experience.code} />;
}
