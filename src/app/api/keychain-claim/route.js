// app/api/keychain-claim/route.js
// Called once by the user on first scan.
// Validates the code exists and is unclaimed, then saves their photo + message.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { code, imageUrl, message } = await request.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }
    if (!imageUrl?.trim()) {
      return NextResponse.json({ error: "Photo is required." }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 40) {
      return NextResponse.json({ error: "Message must be 40 characters or fewer." }, { status: 400 });
    }

    // Find the experience
    const experience = await prisma.aRExperience.findUnique({
      where: { code: code.trim() },
    });

    if (!experience) {
      return NextResponse.json({ error: "QR code not found." }, { status: 404 });
    }
    if (!experience.isActive) {
      return NextResponse.json({ error: "This QR code has been deactivated." }, { status: 403 });
    }
    if (experience.claimed) {
      // Already claimed — return the existing data so the client can redirect to AR
      return NextResponse.json(
        { error: "This keychain has already been activated.", alreadyClaimed: true },
        { status: 409 }
      );
    }

    // Claim it — atomic update
    const updated = await prisma.aRExperience.update({
      where: { code: code.trim() },
      data: {
        imageUrl: imageUrl.trim(),
        message : message.trim(),
        claimed : true,
      },
    });

    return NextResponse.json(
      { success: true, code: updated.code },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/keychain-claim]", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
