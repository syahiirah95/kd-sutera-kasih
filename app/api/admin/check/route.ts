import { NextResponse } from "next/server";
import { getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";

export async function GET() {
  const isAdmin = await getIsCurrentUserAdmin();

  return NextResponse.json({ isAdmin });
}
