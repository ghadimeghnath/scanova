// src/app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/products/[id] — admin: update product
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, imageUrl, features, isActive, theme } = body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Math.round(Number(price) * 100);
    if (stock !== undefined) data.stock = Number(stock);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (features !== undefined) data.features = features;
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (theme !== undefined) data.theme = theme;

    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[PATCH /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — admin: delete product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}