// app/api/admin-auth/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionToken  = process.env.ADMIN_SESSION_TOKEN;

    if (!adminPassword || !sessionToken) {
      console.error("[admin-auth] ADMIN_PASSWORD or ADMIN_SESSION_TOKEN not set in env");
      return NextResponse.json(
        { error: "Admin auth not configured on server." },
        { status: 503 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    // Set httpOnly cookie valid for 7 days
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
    console.error("[admin-auth]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
