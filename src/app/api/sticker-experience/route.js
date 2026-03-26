// src/app/api/sticker-experience/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateShortCode } from "@/lib/utils";

// Authorization check
function isAuthorized(request) {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    console.error("[sticker-experience] ADMIN_API_KEY not configured");
    return false;
  }

  if (!apiKey || apiKey !== expectedKey) {
    return false;
  }

  return true;
}

// Input validation
function validateInput(targetImage, assetUrl, message) {
  const errors = [];

  if (!targetImage?.trim()) {
    errors.push("targetImage (image URL) is required");
  } else {
    try {
      new URL(targetImage.trim());
    } catch {
      errors.push("targetImage must be a valid URL");
    }
  }

  if (assetUrl?.trim()) {
    try {
      new URL(assetUrl.trim());
    } catch {
      errors.push("assetUrl must be a valid URL");
    }
  }

  if (message && message.length > 200) {
    errors.push("message must be less than 200 characters");
  }

  return errors;
}

export async function POST(request) {
  // Authorization check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or missing API key." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { targetImage, assetUrl, message } = body;

    // Validate input
    const errors = validateInput(targetImage, assetUrl, message);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    // Generate unique code with "s-" prefix
    const code = generateShortCode("s");

    // Save to database
    const experience = await prisma.stickerExperience.create({
      data: {
        code,
        targetImage: targetImage.trim(),
        assetUrl: assetUrl?.trim() || "",
        message: message?.trim() ?? "",
      },
    });

    console.log(`[sticker-experience] Created: ${code}`);

    return NextResponse.json(
      {
        success: true,
        code: experience.code,
        message: "Sticker experience created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/sticker-experience]", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Code collision. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Server error. Failed to create sticker experience." },
      { status: 500 }
    );
  }
}
