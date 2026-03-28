// src/app/api/sticker-experience/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/sticker-experience — admin list all
export async function GET(request) {
  try {
    const experiences = await prisma.stickerExperience.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("[GET /api/sticker-experience]", error);
    return NextResponse.json({ error: "Failed to fetch sticker experiences" }, { status: 500 });
  }
}

// POST /api/sticker-experience — admin create
export async function POST(request) {
  try {
    const { code, targetImage, assetUrl = "", message = "" } = await request.json();

    if (!code?.trim()) return NextResponse.json({ error: "Code is required" }, { status: 400 });
    if (!targetImage?.trim()) return NextResponse.json({ error: "Target image URL is required" }, { status: 400 });

    const existing = await prisma.stickerExperience.findUnique({ where: { code: code.trim() } });
    if (existing) return NextResponse.json({ error: "Code already exists" }, { status: 409 });

    const experience = await prisma.stickerExperience.create({
      data: { code: code.trim(), targetImage: targetImage.trim(), assetUrl, message },
    });

    return NextResponse.json({ success: true, experience }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sticker-experience]", error);
    if (error.code === "P2002") return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create sticker experience" }, { status: 500 });
  }
}