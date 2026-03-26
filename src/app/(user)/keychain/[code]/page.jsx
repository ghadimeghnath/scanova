// app/keychain/[code]/page.jsx
// Server component — fetches the AR experience from DB, then hands off to:
//   • KeychainARScene  (claimed — show AR)
//   • KeychainSetupPage (unclaimed — show activation wizard)
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import KeychainSetupPage from "@/components/keychain-ar/KeychainSetupPage";
import KeychainWrapper from "@/components/keychain-ar/KeychainWrapper";

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

  if (!experience || !experience.isActive) notFound();

  // ── Claimed → show AR ───────────────────────────────────────────────────
  if (experience.claimed) {
    return (
      <KeychainWrapper
        imageUrl={experience.imageUrl}
        message={experience.message}
        theme={experience.theme}
        code={experience.code}
      />
    );
  }

  // ── Unclaimed → show one-time setup wizard ──────────────────────────────
  return <KeychainSetupPage code={experience.code} />;
}