import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import WebXRWrapper from "@/components/WebXRWrapper";

export default async function ARViewerPage({ params }) {
  const { shortCode } = await params;

  const experience = await prisma.aRExperience.findUnique({
    where: { shortCode },
  });

  if (!experience || !experience.isActive) {
    notFound();
  }

  // ── No <main> wrapper — let A-Frame own the full viewport ──────────────
  return (
    <WebXRWrapper
      message={experience.message}
      imageUrl={experience.imageUrl}
    />
  );
}