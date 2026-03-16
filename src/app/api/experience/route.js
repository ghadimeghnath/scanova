import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto"; 

// Helper function to generate a fast, unique 6-character string (e.g., 'f4a9b2')
function generateShortCode() {
  return crypto.randomBytes(3).toString("hex"); 
}

export async function POST(request) {
  try {
    // 1. Parse the incoming data from the frontend form
    const body = await request.json();
    const { message, imageUrl } = body;

    // 2. Validate the input (Don't let them buy an empty keychain!)
    if (!message || !imageUrl) {
      return NextResponse.json(
        { error: "A custom message and an uploaded photo are required." },
        { status: 400 }
      );
    }

    // 3. Generate the unique code that will be printed as the QR code
    const shortCode = generateShortCode();

    // 4. Save everything to Postgress using Prisma
    const newExperience = await prisma.ARExperience.create({
      data: {
        shortCode,
        message,
        imageUrl,
      },
    });

    // 5. Send success response back to the frontend
    return NextResponse.json(
      { 
        success: true, 
        shortCode: newExperience.shortCode,
        message: "AR Keychain data securely saved!" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AR experience. Please try again." },
      { status: 500 }
    );
  }
}