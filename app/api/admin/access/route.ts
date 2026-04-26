import { NextRequest, NextResponse } from "next/server";
import { getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";

const ADMIN_ACCESS_PASSWORD = "kdsuterahall2026!";

export async function POST(request: NextRequest) {
  const isAdmin = await getIsCurrentUserAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "This account is not listed as a Sutera Kasih admin." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;

  if ((body?.password ?? "").trim() !== ADMIN_ACCESS_PASSWORD) {
    return NextResponse.json({ error: "The admin access password is incorrect." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
