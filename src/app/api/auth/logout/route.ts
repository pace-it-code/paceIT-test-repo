import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    cookie.serialize("auth_token_jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    })
  );

  return NextResponse.json({ message: "Logged out" }, { headers });
}

