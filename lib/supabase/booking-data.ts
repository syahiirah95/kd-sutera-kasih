import { createSupabaseServerClient } from "@/lib/auth/server";
import { type BookingStatus } from "@/lib/types/booking";

export type PaymentStatus = "not_paid" | "paid" | "pending";

export type AdminBookingRecord = {
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  depositAmount: number;
  depositStatus: PaymentStatus;
  eventDate: string;
  eventType: string;
  fullPaymentAmount: number;
  fullPaymentStatus: PaymentStatus;
  guestCount: number;
  id: string;
  layoutObjects: number;
  reference: string;
  setupNotes?: string;
  specialRequests?: string;
  status: BookingStatus;
  statusReason?: string;
  timeSlotLabel: string;
  venueName: string;
  venueSlug: string;
};

export type UserBookingRecord = {
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  depositAmount: number;
  depositStatus: PaymentStatus;
  estimatedTotalAmount: number;
  eventDate: string;
  eventType: string;
  fullPaymentAmount: number;
  fullPaymentStatus: PaymentStatus;
  guestCount: number;
  id: string;
  organization?: string;
  reference: string;
  specialRequests?: string;
  status: BookingStatus;
  submittedAt: string;
  themeStyle?: string;
  timeSlotLabel: string;
  venueName: string;
  venueSlug: string;
};

export type BookingAvailabilityRecord = {
  eventDate: string;
  id: string;
  status: BookingStatus;
  timeSlotLabel: string;
  venueName: string;
  venueSlug: string;
};

type AdminBookingRow = {
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  created_at: string;
  deposit_amount: number;
  deposit_status: PaymentStatus;
  event_date: string;
  event_type: string;
  full_payment_amount: number;
  full_payment_status: PaymentStatus;
  guest_count: number;
  id: string;
  layout_objects: number;
  reference: string;
  setup_notes: string | null;
  special_requests: string | null;
  status: BookingStatus;
  status_reason: string | null;
  time_slot_label: string;
  venue_name: string;
  venue_slug: string;
};

type UserBookingRow = {
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  deposit_amount: number;
  deposit_status: PaymentStatus;
  estimated_total_amount: number;
  event_date: string;
  event_type: string;
  full_payment_amount: number;
  full_payment_status: PaymentStatus;
  guest_count: number;
  id: string;
  organization: string | null;
  reference: string;
  special_requests: string | null;
  status: BookingStatus;
  submitted_at: string;
  theme_style: string | null;
  time_slot_label: string;
  venue_name: string;
  venue_slug: string;
};

type BookingAvailabilityRow = {
  event_date: string;
  id: string;
  status: BookingStatus;
  time_slot_label: string;
  venue_name: string;
  venue_slug: string;
};

function mapAdminBooking(row: AdminBookingRow): AdminBookingRecord {
  return {
    contactEmail: row.contact_email,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    createdAt: row.created_at,
    depositAmount: row.deposit_amount,
    depositStatus: row.deposit_status,
    eventDate: row.event_date,
    eventType: row.event_type,
    fullPaymentAmount: row.full_payment_amount,
    fullPaymentStatus: row.full_payment_status,
    guestCount: row.guest_count,
    id: row.id,
    layoutObjects: row.layout_objects,
    reference: row.reference,
    setupNotes: row.setup_notes ?? undefined,
    specialRequests: row.special_requests ?? undefined,
    status: row.status,
    statusReason: row.status_reason ?? undefined,
    timeSlotLabel: row.time_slot_label,
    venueName: row.venue_name,
    venueSlug: row.venue_slug,
  };
}

function mapUserBooking(row: UserBookingRow): UserBookingRecord {
  return {
    contactEmail: row.contact_email,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    depositAmount: row.deposit_amount,
    depositStatus: row.deposit_status,
    estimatedTotalAmount: row.estimated_total_amount,
    eventDate: row.event_date,
    eventType: row.event_type,
    fullPaymentAmount: row.full_payment_amount,
    fullPaymentStatus: row.full_payment_status,
    guestCount: row.guest_count,
    id: row.id,
    organization: row.organization ?? undefined,
    reference: row.reference,
    specialRequests: row.special_requests ?? undefined,
    status: row.status,
    submittedAt: row.submitted_at,
    themeStyle: row.theme_style ?? undefined,
    timeSlotLabel: row.time_slot_label,
    venueName: row.venue_name,
    venueSlug: row.venue_slug,
  };
}

function mapBookingAvailability(row: BookingAvailabilityRow): BookingAvailabilityRecord {
  return {
    eventDate: row.event_date,
    id: row.id,
    status: row.status,
    timeSlotLabel: row.time_slot_label,
    venueName: row.venue_name,
    venueSlug: row.venue_slug,
  };
}

export async function getIsCurrentUserAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return false;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase.rpc("kd_sutera_kasih_is_admin", {
    p_user_id: user.id,
  });

  return !error && Boolean(data);
}

export async function getAdminBookings(): Promise<AdminBookingRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("kd_sutera_kasih_admin_booking_overview")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as AdminBookingRow[]).map(mapAdminBooking);
}

export async function getUserBookings(): Promise<UserBookingRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("kd_sutera_kasih_bookings")
    .select(
      "id, reference, contact_name, contact_email, contact_phone, organization, theme_style, special_requests, event_date, event_type, time_slot_label, guest_count, status, deposit_amount, deposit_status, full_payment_amount, full_payment_status, estimated_total_amount, venue_slug, venue_name:venue_name_snapshot, submitted_at",
    )
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as UserBookingRow[]).map(mapUserBooking);
}

export async function getBookingAvailabilityRecords(): Promise<BookingAvailabilityRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.rpc("kd_sutera_kasih_booking_calendar_overview");

  if (error || !data) {
    return [];
  }

  return (data as BookingAvailabilityRow[]).map(mapBookingAvailability);
}
