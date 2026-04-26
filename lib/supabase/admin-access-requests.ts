import { createSupabaseServerClient } from "@/lib/auth/server";
import { getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";

export type AdminAccessRequestStatus = "approved" | "pending" | "rejected";

export type AdminAccessRequestRecord = {
  authUserId: string;
  displayName?: string;
  email: string;
  id: string;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  status: AdminAccessRequestStatus;
};

type AdminAccessRequestRow = {
  auth_user_id: string;
  display_name: string | null;
  email: string;
  id: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  status: AdminAccessRequestStatus;
};

function mapAdminAccessRequest(row: AdminAccessRequestRow): AdminAccessRequestRecord {
  return {
    authUserId: row.auth_user_id,
    displayName: row.display_name ?? undefined,
    email: row.email,
    id: row.id,
    requestedAt: row.requested_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewedBy: row.reviewed_by ?? undefined,
    status: row.status,
  };
}

export async function getAdminAccessRequests(): Promise<AdminAccessRequestRecord[]> {
  const isAdmin = await getIsCurrentUserAdmin();

  if (!isAdmin) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("kd_sutera_kasih_admin_access_requests")
    .select("*")
    .order("requested_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as AdminAccessRequestRow[]).map(mapAdminAccessRequest);
}
