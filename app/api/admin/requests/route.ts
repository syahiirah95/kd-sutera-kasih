import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";

function getAdminRequestErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return "Unable to submit admin request.";
  }

  if (error.code === "42P01") {
    return "Admin request storage is not set up in Supabase yet. Run the latest Supabase migration first.";
  }

  if (error.code === "42501") {
    return "Supabase blocked this admin request write. Please check the row-level security policies.";
  }

  return "Unable to submit admin request.";
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Please sign in before requesting admin access." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const requestedEmail = body?.email?.trim().toLowerCase();

  if (requestedEmail && requestedEmail !== user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Use the same email as the signed-in account before requesting admin access." },
      { status: 400 },
    );
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email.split("@")[0];

  const { data: existingRequest, error: existingRequestError } = await supabase
    .from("kd_sutera_kasih_admin_access_requests")
    .select("id, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existingRequestError) {
    return NextResponse.json({ error: getAdminRequestErrorMessage(existingRequestError) }, { status: 500 });
  }

  if (existingRequest?.status === "approved") {
    return NextResponse.json({ request: existingRequest });
  }

  if (existingRequest?.status === "pending") {
    return NextResponse.json({ request: existingRequest });
  }

  if (existingRequest?.status === "rejected") {
    return NextResponse.json(
      { error: "Your previous admin request was rejected. Please contact an existing admin for review." },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("kd_sutera_kasih_admin_access_requests")
    .upsert(
      {
        auth_user_id: user.id,
        display_name: displayName,
        email: user.email,
        requested_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null,
        status: "pending",
      },
      { onConflict: "auth_user_id" },
    )
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: getAdminRequestErrorMessage(error) }, { status: 500 });
  }

  return NextResponse.json({ request: data });
}
