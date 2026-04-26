import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { type PaymentStatus } from "@/lib/supabase/booking-data";

const ALLOWED_PAYMENT_STATUSES: PaymentStatus[] = ["not_paid", "paid", "pending"];

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
    depositStatus?: PaymentStatus;
    fullPaymentStatus?: PaymentStatus;
  } | null;

  if (
    (body?.depositStatus && !ALLOWED_PAYMENT_STATUSES.includes(body.depositStatus)) ||
    (body?.fullPaymentStatus && !ALLOWED_PAYMENT_STATUSES.includes(body.fullPaymentStatus))
  ) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }

  const { error } = await supabase.rpc("kd_sutera_kasih_update_booking_payment_summary", {
    p_booking_id: bookingId,
    p_deposit_status: body?.depositStatus ?? null,
    p_full_payment_status: body?.fullPaymentStatus ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
