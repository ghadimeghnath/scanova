// app/api/track/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { code, type = "keychain" } = await request.json();
    if (!code) return NextResponse.json({ ok: false }, { status: 400 });

    if (type === "sticker") {
      await prisma.stickerExperience.update({
        where: { code },
        data : { scanCount: { increment: 1 } },
      });
    } else {
      await prisma.aRExperience.update({
        where: { code },
        data : { scanCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (_) {
    return NextResponse.json({ ok: false });
  }
}
