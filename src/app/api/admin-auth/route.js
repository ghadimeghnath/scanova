// src/app/api/admin-auth/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST — login
export async function POST(request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!adminPassword || !sessionToken) {
      console.error("[admin-auth] ADMIN_PASSWORD or ADMIN_SESSION_TOKEN not set");
      return NextResponse.json({ error: "Admin auth not configured on server." }, { status: 503 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin-auth POST]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// DELETE — logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin-auth DELETE]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}