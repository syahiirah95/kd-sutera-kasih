import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";

type PaymentTarget = "deposit" | "full";

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
    paymentMethod?: string;
    paymentTarget?: PaymentTarget;
  } | null;

  const paymentTarget = body?.paymentTarget ?? "full";

  if (paymentTarget !== "deposit" && paymentTarget !== "full") {
    return NextResponse.json({ error: "Invalid payment target." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("kd_sutera_kasih_submit_booking_mock_payment", {
    p_booking_id: bookingId,
    p_payment_method: body?.paymentMethod ?? null,
    p_payment_target: paymentTarget,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    booking: data
      ? {
          depositStatus: data.deposit_status,
          fullPaymentStatus: data.full_payment_status,
          id: data.id,
          paymentMethod: data.payment_method,
        }
      : null,
    ok: true,
  });
}
