// src/app/api/experience/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function generateShortCode() {
  return crypto.randomBytes(3).toString("hex");
}

// GET /api/experience — list experiences (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "keychain";
    const limit = parseInt(searchParams.get("limit") || "200");

    const experiences = await prisma.aRExperience.findMany({
      where: { type },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("[GET /api/experience]", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

// POST /api/experience — create a single keychain (used by create page)
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, imageUrl, theme = "love" } = body;

    const errors = [];
    if (!message?.trim()) errors.push("Message is required");
    else if (message.length > 100) errors.push("Message must be less than 100 characters");
    if (!imageUrl?.trim()) errors.push("Image URL is required");
    else { try { new URL(imageUrl); } catch { errors.push("Image URL must be valid"); } }
    if (errors.length > 0) return NextResponse.json({ error: errors.join("; ") }, { status: 400 });

    let shortCode, attempts = 0;
    do {
      shortCode = generateShortCode();
      attempts++;
    } while (attempts < 10 && await prisma.aRExperience.findUnique({ where: { code: shortCode } }));

    const newExperience = await prisma.aRExperience.create({
      data: { code: shortCode, message: message.trim(), imageUrl: imageUrl.trim(), theme, claimed: true },
    });

    return NextResponse.json({ success: true, shortCode: newExperience.code, message: "AR experience created!" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/experience]", error);
    if (error.code === "P2002") return NextResponse.json({ error: "Code already exists. Try again." }, { status: 409 });
    return NextResponse.json({ error: "Failed to create AR experience." }, { status: 500 });
  }
}