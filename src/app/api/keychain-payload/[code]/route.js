// app/api/keychain-payload/[code]/route.js
// Called by the Universal Scanner to fetch the AR payload for a given QR code.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    if (!code?.trim()) {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    const experience = await prisma.aRExperience.findUnique({
      where : { code: code.trim() },
      select: {
        code    : true,
        imageUrl: true,
        message : true,
        theme   : true,
        claimed : true,
        isActive: true,
      },
    });

    if (!experience) {
      return NextResponse.json({ error: "QR code not found." }, { status: 404 });
    }

    if (!experience.isActive) {
      return NextResponse.json({ error: "This QR code has been deactivated." }, { status: 403 });
    }

    return NextResponse.json({
      code    : experience.code,
      imageUrl: experience.imageUrl,
      message : experience.message,
      theme   : experience.theme,
      claimed : experience.claimed,
    });
  } catch (error) {
    console.error("[GET /api/keychain-payload]", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}