// src/app/api/experience/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive, message, imageUrl, theme } = body;

    const data = {};
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (message !== undefined) data.message = message;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (theme !== undefined) data.theme = theme;

    const experience = await prisma.aRExperience.update({ where: { id }, data });
    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("[PATCH /api/experience/[id]]", error);
    if (error.code === "P2025") return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.aRExperience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/experience/[id]]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}