import { NextResponse } from "next/server";
import { DEMO_MODE_COOKIE, isDemoMode } from "@/lib/constants/demo-mode";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    mode?: string;
  } | null;

  if (!body?.mode || !isDemoMode(body.mode)) {
    return NextResponse.json({ error: "Invalid demo mode." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, mode: body.mode });

  response.cookies.set(DEMO_MODE_COOKIE, body.mode, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
