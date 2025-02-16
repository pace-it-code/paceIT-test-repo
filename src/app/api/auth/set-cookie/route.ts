import { NextResponse, NextRequest } from "next/server";
import cookie from "cookie";

// ✅ Handle POST request to set cookie
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // ✅ Set cookie with token (HTTP-only, Secure, SameSite)
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      cookie.serialize("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
        path: "/",
      })
    );

    return NextResponse.json({ message: "Cookie set" }, { headers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}
