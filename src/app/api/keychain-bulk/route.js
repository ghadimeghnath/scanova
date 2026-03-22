// app/api/keychain-bulk/route.js
// Admin generates N empty keychain codes in one shot.
// These are "blank" — no image/message yet. Printed on keychains.
// Users activate them on first scan.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateShortCode } from "@/lib/utils";

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
    const count = Math.min(Math.max(parseInt(body.count) || 1, 1), 200); // 1–200

    // Generate N unique codes
    const codes = Array.from({ length: count }, () => generateShortCode("k"));

    // Bulk insert — all unclaimed with empty image/message
    await prisma.ARExperience.createMany({
      data: codes.map((code) => ({
        code,
        message : "",
        imageUrl: "",
        claimed : false,
        type    : "keychain",
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, codes }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/keychain-bulk]", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
