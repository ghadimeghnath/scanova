// app/api/keychain-bulk/route.js
// Admin generates N empty keychain codes for a given theme in one shot.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateShortCode } from "@/lib/utils";

const VALID_THEMES = ["love", "celebration", "memory", "achievement", "custom"];

function isAuthorized(request) {
  const key      = request.headers.get("x-api-key");
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return false;
  return key === expected;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body  = await request.json();
    const count = Math.min(Math.max(parseInt(body.count) || 1, 1), 200);
    const theme = VALID_THEMES.includes(body.theme) ? body.theme : "love";

    // Generate N unique codes
    const codes = Array.from({ length: count }, () => generateShortCode("k"));

    // Bulk insert — all unclaimed, carry the selected theme
    await prisma.aRExperience.createMany({
      data: codes.map((code) => ({
        code,
        message : "",
        imageUrl: "",
        claimed : false,
        type    : "keychain",
        theme,          // ← new field
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, codes, theme }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/keychain-bulk]", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}