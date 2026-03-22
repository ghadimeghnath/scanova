// src/app/api/experience/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Helper function to generate a fast, unique 6-character string
function generateShortCode() {
  return crypto.randomBytes(3).toString("hex");
}

// Input validation
function validateInput(message, imageUrl) {
  const errors = [];

  if (!message?.trim()) {
    errors.push("Message is required");
  } else if (message.length > 100) {
    errors.push("Message must be less than 100 characters");
  }

  if (!imageUrl?.trim()) {
    errors.push("Image URL is required");
  } else {
    try {
      new URL(imageUrl);
    } catch {
      errors.push("Image URL must be a valid URL");
    }
  }

  return errors;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, imageUrl } = body;

    // Validate input
    const errors = validateInput(message, imageUrl);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join("; ") },
        { status: 400 }
      );
    }

    // Generate unique code
    const shortCode = generateShortCode();

    // Save to database with error handling
    const newExperience = await prisma.aRExperience.create({
      data: {
        shortCode,
        message: message.trim(),
        imageUrl: imageUrl.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        shortCode: newExperience.shortCode,
        message: "AR experience created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/experience]", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This code already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create AR experience. Please try again later." },
      { status: 500 }
    );
  }
}