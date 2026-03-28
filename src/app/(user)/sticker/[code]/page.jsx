// app/(user)/sticker/[code]/page.jsx

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import StickerWrapper from "@/components/sticker-ar/StickerWrapper";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return {
    title: `SCANOVA Sticker — ${code}`,
    description: "Point your camera at the sticker to activate the AR art.",
  };
}

export default async function StickerViewerPage({ params }) {
  const { code } = await params;

  const experience = await prisma.stickerExperience.findUnique({
    where: { code },
  });

  if (!experience || !experience.isActive) notFound();

  return (
    <StickerWrapper
      targetImage={experience.targetImage}
      assetUrl={experience.assetUrl}
      message={experience.message ?? ""}
      code={experience.code}
    />
  );
}
