import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";

type Params = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const isAdmin = await getIsCurrentUserAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as {
    decision?: "approved" | "rejected";
  } | null;
  const decision = body?.decision;

  if (decision !== "approved" && decision !== "rejected") {
    return NextResponse.json({ error: "Invalid admin request decision." }, { status: 400 });
  }

  const { requestId } = await params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accessRequest, error: requestError } = await supabase
    .from("kd_sutera_kasih_admin_access_requests")
    .select("id, auth_user_id")
    .eq("id", requestId)
    .single();

  if (requestError || !accessRequest) {
    return NextResponse.json({ error: "Admin request not found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("kd_sutera_kasih_admin_access_requests")
    .update({
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null,
      status: decision,
    })
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update admin request." }, { status: 500 });
  }

  if (decision === "approved") {
    const { error: adminError } = await supabase
      .from("kd_sutera_kasih_admin_users")
      .upsert(
        {
          auth_user_id: accessRequest.auth_user_id,
          role: "admin",
        },
        { onConflict: "auth_user_id" },
      );

    if (adminError) {
      return NextResponse.json({ error: "Request approved, but admin role could not be created." }, { status: 500 });
    }
  }

  return NextResponse.json({ request: data });
}
