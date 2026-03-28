// src/app/api/products/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products — public product listing
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // optional filter

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products — admin: create product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, type, price, stock, imageUrl, features, theme } = body;

    if (!name || !type || !price) {
      return NextResponse.json({ error: "name, type, price are required" }, { status: 400 });
    }
    if (!["keychain", "sticker"].includes(type)) {
      return NextResponse.json({ error: "type must be keychain or sticker" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        type,
        price: Math.round(Number(price) * 100), // convert ₹ to paise
        stock: Number(stock) || 0,
        imageUrl: imageUrl || "",
        features: features || [],
        theme: theme || "love",
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}