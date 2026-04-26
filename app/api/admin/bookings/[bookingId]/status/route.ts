import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { type BookingStatus } from "@/lib/types/booking";

const ALLOWED_STATUSES: BookingStatus[] = ["approved", "pending", "rejected"];

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { bookingId } = await context.params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    reason?: string;
    status?: BookingStatus;
  } | null;

  if (!body?.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid booking status." }, { status: 400 });
  }

  const { error } = await supabase.rpc("kd_sutera_kasih_update_booking_status", {
    p_booking_id: bookingId,
    p_next_status: body.status,
    p_reason: body.reason ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
