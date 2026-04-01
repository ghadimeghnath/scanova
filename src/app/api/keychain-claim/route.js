// src/app/api/keychain-claim/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const VALID_COLOR_INDICES = [0, 1, 2, 3, 4];

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, imageUrl, message, themeIndex } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.trim().length > 40) {
      return NextResponse.json({ error: "Message must be 40 characters or less." }, { status: 400 });
    }

    // ── Resolve colorIndex from the user's theme picker choice ────────────
    // themeIndex here is ONLY the color palette choice (0-4).
    // It is stored in colorIndex, NOT in theme.
    // theme stays as the physical target index set at bulk-generate — never overwritten.
    const colorIndex =
      typeof themeIndex === "number" && VALID_COLOR_INDICES.includes(themeIndex)
        ? themeIndex
        : 0;

    const experience = await prisma.aRExperience.findUnique({ where: { code } });

    if (!experience) {
      return NextResponse.json(
        { error: "Keychain not found. Check your QR code and try again." },
        { status: 404 }
      );
    }
    if (!experience.isActive) {
      return NextResponse.json(
        { error: "This keychain has been deactivated." },
        { status: 403 }
      );
    }
    if (experience.claimed) {
      return NextResponse.json(
        { alreadyClaimed: true, code: experience.code },
        { status: 409 }
      );
    }

    const updated = await prisma.aRExperience.update({
      where: { code },
      data: {
        claimed    : true,
        imageUrl   : imageUrl.trim(),
        message    : message.trim(),
        colorIndex,           // ✅ User's color choice → colorIndex
        // theme is intentionally NOT touched — it stays as the physical target
      },
    });

    return NextResponse.json({ success: true, code: updated.code }, { status: 200 });
  } catch (error) {
    console.error("[keychain-claim] Error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}