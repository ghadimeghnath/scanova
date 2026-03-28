
// src/app/api/sticker-experience/[code]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/sticker-experience/[code] — fetch by code for AR scene
export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const experience = await prisma.stickerExperience.findUnique({ where: { code } });

    if (!experience) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    if (!experience.isActive) return NextResponse.json({ error: "Experience is inactive" }, { status: 403 });

    // Increment scan count
    await prisma.stickerExperience.update({
      where: { code },
      data: { scanCount: { increment: 1 } },
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("[GET /api/sticker-experience/[code]]", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

// PATCH /api/sticker-experience/[id] — admin toggle or update
export async function PATCH(request, { params }) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { isActive, message, assetUrl } = body;

    const data = {};
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (message !== undefined) data.message = message;
    if (assetUrl !== undefined) data.assetUrl = assetUrl;

    // Support update by id or code
    const experience = await prisma.stickerExperience.update({
      where: { id: code }, // admin passes id
      data,
    }).catch(() =>
      prisma.stickerExperience.update({ where: { code }, data })
    );

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("[PATCH /api/sticker-experience/[code]]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}