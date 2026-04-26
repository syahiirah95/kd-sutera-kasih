import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation/booking-schema";
import { createSupabaseServerClient } from "@/lib/auth/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in before submitting a booking request." },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid booking payload." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse({
    ...payload,
    guestCount: Number.parseInt(String((payload as { guestCount?: unknown }).guestCount ?? ""), 10),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your booking details." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("kd_sutera_kasih_create_booking", {
    p_payload: payload,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const booking = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({ booking });
}
