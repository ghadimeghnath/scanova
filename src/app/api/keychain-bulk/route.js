// src/app/api/keychain-bulk/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";


export function generateShortCode(prefix = "k") {
  const raw = crypto.randomBytes(3).toString("hex"); // 6 chars
  return prefix ? `${prefix}-${raw}` : raw;
}

export async function POST(request) {
  try {
    const { count = 10, theme = "love" } = await request.json();

    const n = Math.min(Math.max(1, parseInt(count)), 100);
    if (isNaN(n)) return NextResponse.json({ error: "Invalid count" }, { status: 400 });

    // Generate unique codes — fetch existing to avoid collisions
    const existingCodes = new Set(
      (await prisma.aRExperience.findMany({ select: { code: true } })).map((e) => e.code)
    );

    const newCodes = [];
    let attempts = 0;
    while (newCodes.length < n && attempts < n * 10) {
      const code = generateShortCode();
      if (!existingCodes.has(code) && !newCodes.includes(code)) {
        newCodes.push(code);
      }
      attempts++;
    }

    if (newCodes.length < n) {
      return NextResponse.json({ error: "Could not generate enough unique codes. Try again." }, { status: 500 });
    }

    // Bulk insert
    await prisma.aRExperience.createMany({
      data: newCodes.map((code) => ({
        code,
        theme,
        claimed: false,
        isActive: true,
        message: "",
        imageUrl: "",
      })),
    });

    return NextResponse.json({ success: true, codes: newCodes, count: newCodes.length }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/keychain-bulk]", error);
    return NextResponse.json({ error: "Failed to generate codes" }, { status: 500 });
  }
}