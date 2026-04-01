// src/app/api/keychain-bulk/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// ── Theme name → Int index map (mirrors KeychainSetupPage + useKeychainARDocument) ──
// This is the SINGLE source of truth for name→index conversion on the server.
const THEME_NAME_TO_INDEX = {
  love        : 0,
  celebration : 1,
  memory      : 2,
  achievement : 3,
  custom      : 4,
};

// Valid range for direct numeric input
const VALID_THEME_INDICES = [0, 1, 2, 3, 4];

/**
 * Resolve whatever the admin UI sends (string name OR numeric index) to a
 * validated integer.  Falls back to 0 (Love/Pink) on any invalid input.
 */
function resolveThemeIndex(raw) {
  if (typeof raw === "number" && VALID_THEME_INDICES.includes(raw)) return raw;
  if (typeof raw === "string") {
    // Try by name first
    const byName = THEME_NAME_TO_INDEX[raw.toLowerCase()];
    if (byName !== undefined) return byName;
    // Try parsing as a number string
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && VALID_THEME_INDICES.includes(parsed)) return parsed;
  }
  return 0; // safe default
}

function generateShortCode(prefix = "k") {
  const raw = crypto.randomBytes(3).toString("hex"); // 6 hex chars
  return prefix ? `${prefix}-${raw}` : raw;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { count = 10, theme = 0 } = body;

    const n = Math.min(Math.max(1, parseInt(count)), 100);
    if (isNaN(n)) {
      return NextResponse.json({ error: "Invalid count" }, { status: 400 });
    }

    // ── Resolve theme to Int regardless of what admin UI sends ──────────────
    // The admin UI currently sends a string name ("love", "celebration", …).
    // After the schema migration it should ideally send an Int, but we handle
    // both so a deploy order mismatch never causes a crash.
    const themeIndex = resolveThemeIndex(theme);

    // ── Generate unique codes ─────────────────────────────────────────────
    const existingCodes = new Set(
      (await prisma.aRExperience.findMany({ select: { code: true } }))
        .map((e) => e.code)
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
      return NextResponse.json(
        { error: "Could not generate enough unique codes. Try again." },
        { status: 500 }
      );
    }

    // ── Bulk insert with Int theme ─────────────────────────────────────────
    await prisma.aRExperience.createMany({
      data: newCodes.map((code) => ({
        code,
        theme    : themeIndex,  // ✅ Always an Int now
        claimed  : false,
        isActive : true,
        message  : "",
        imageUrl : "",
      })),
    });

    return NextResponse.json(
      { success: true, codes: newCodes, count: newCodes.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/keychain-bulk]", error);
    return NextResponse.json(
      { error: "Failed to generate codes" },
      { status: 500 }
    );
  }
}