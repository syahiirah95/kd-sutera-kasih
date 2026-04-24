"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CircleDollarSign,
  LayoutTemplate,
  Users,
  XCircle,
} from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type BookingStatus } from "@/lib/types/booking";
import { cn } from "@/lib/utils";

type StatusFilter = BookingStatus | "all";
type PaymentStatus = "not-paid" | "paid" | "pending";

type AdminBooking = {
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
  timeSlotLabel: string;
  venueName: string;
};

type StoredAdminBooking = Omit<AdminBooking, "depositAmount" | "depositStatus" | "fullPaymentAmount" | "fullPaymentStatus"> &
  Partial<Pick<AdminBooking, "depositAmount" | "depositStatus" | "fullPaymentAmount" | "fullPaymentStatus">>;

const ADMIN_ACTION_BUTTON_CLASS =
  "!h-7 !w-24 !rounded-lg !px-2 !text-[11px] !font-semibold !leading-none";

const ADMIN_APPROVE_BUTTON_CLASS =
  "booking-form-nav-primary !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";

const ADMIN_VIEW_BUTTON_CLASS =
  "booking-form-nav-neutral !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";

const ADMIN_REJECT_BUTTON_CLASS =
  "booking-form-nav-secondary !border-[#ff1f2d] !bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] !text-white shadow-[0_0_16px_rgba(255,31,45,0.24),0_6px_16px_rgba(224,0,18,0.22)] hover:brightness-105";

const INITIAL_BOOKINGS: AdminBooking[] = [
  {
    contactEmail: "aina.rahman@example.com",
    contactName: "Aina Rahman",
    contactPhone: "+60 13-820 1142",
    createdAt: "2026-04-20T10:28:00",
    depositAmount: 500,
    depositStatus: "paid",
    eventDate: "2026-06-14",
    eventType: "Wedding Reception",
    fullPaymentAmount: 3200,
    fullPaymentStatus: "pending",
    guestCount: 320,
    id: "booking-001",
    layoutObjects: 42,
    reference: "KD-SK-2026-001",
    setupNotes: "Ivory and gold pelamin with family seating close to the stage.",
    specialRequests: "Reserve vendor access from 8:00 AM for decor setup.",
    status: "pending",
    timeSlotLabel: "3:00 PM - 7:00 PM",
    venueName: "Sutera Cinta",
  },
  {
    contactEmail: "nabilah@example.com",
    contactName: "Nabilah Yusuf",
    contactPhone: "+60 14-330 9648",
    createdAt: "2026-04-18T15:42:00",
    depositAmount: 480,
    depositStatus: "paid",
    eventDate: "2026-05-30",
    eventType: "Graduation Event",
    fullPaymentAmount: 2900,
    fullPaymentStatus: "paid",
    guestCount: 180,
    id: "booking-002",
    layoutObjects: 18,
    reference: "KD-SK-2026-002",
    status: "approved",
    timeSlotLabel: "10:00 AM - 2:00 PM",
    venueName: "Sutera Bahagia",
  },
  {
    contactEmail: "faris.z@example.com",
    contactName: "Faris Zulkifli",
    contactPhone: "+60 12-502 7714",
    createdAt: "2026-04-16T09:10:00",
    depositAmount: 650,
    depositStatus: "not-paid",
    eventDate: "2026-05-22",
    eventType: "Corporate Dinner",
    fullPaymentAmount: 4200,
    fullPaymentStatus: "not-paid",
    guestCount: 380,
    id: "booking-003",
    layoutObjects: 0,
    reference: "KD-SK-2026-003",
    specialRequests: "Needs projector support and award stage lighting.",
    status: "rejected",
    timeSlotLabel: "8:00 PM - 11:00 PM",
    venueName: "Sutera Pesona",
  },
  {
    contactEmail: "hakim@example.com",
    contactName: "Hakim Ismail",
    contactPhone: "+60 17-441 2035",
    createdAt: "2026-04-22T12:05:00",
    depositAmount: 450,
    depositStatus: "pending",
    eventDate: "2026-07-05",
    eventType: "Engagement Ceremony",
    fullPaymentAmount: 2600,
    fullPaymentStatus: "not-paid",
    guestCount: 140,
    id: "booking-004",
    layoutObjects: 25,
    reference: "KD-SK-2026-004",
    setupNotes: "Compact stage with two family dining rows.",
    status: "pending",
    timeSlotLabel: "10:00 AM - 2:00 PM",
    venueName: "Sutera Rindu",
  },
];

const STATUS_FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  const resolvedValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-MY", {
    currency: "MYR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(resolvedValue);
}

function normalizeBooking(booking: StoredAdminBooking): AdminBooking {
  const fallback = INITIAL_BOOKINGS.find((initialBooking) => initialBooking.id === booking.id);

  return {
    ...booking,
    depositAmount: booking.depositAmount ?? fallback?.depositAmount ?? 0,
    depositStatus: booking.depositStatus ?? fallback?.depositStatus ?? "not-paid",
    fullPaymentAmount: booking.fullPaymentAmount ?? fallback?.fullPaymentAmount ?? 0,
    fullPaymentStatus: booking.fullPaymentStatus ?? fallback?.fullPaymentStatus ?? "not-paid",
  };
}

function PaymentBadge({
  amount,
  status,
}: Readonly<{
  amount: number;
  status: PaymentStatus;
}>) {
  const label = {
    "not-paid": "Not paid",
    paid: "Paid",
    pending: "Pending",
  }[status];

  const iconClassName = {
    "not-paid": "border-destructive/30 bg-destructive/15 text-destructive",
    paid: "border-success/30 bg-success/15 text-success",
    pending: "border-warning/30 bg-warning/15 text-warning",
  }[status];

  const Icon = status === "paid" ? CheckCircle : status === "pending" ? Clock : CircleDollarSign;

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs font-semibold text-foreground">{formatCurrency(amount)}</p>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={`Payment status: ${label}`}
            className={cn("inline-flex size-6 items-center justify-center rounded-full border", iconClassName)}
          >
            <Icon className="size-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: number;
}>) {
  return (
    <Card className="rounded-[var(--radius-sm)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          {icon}
        </div>
        <p className="mt-3 font-display text-3xl font-semibold text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<StoredAdminBooking[]>(INITIAL_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const normalizedBookings = useMemo(
    () => bookings.map((booking) => normalizeBooking(booking)),
    [bookings],
  );

  const stats = useMemo(() => {
    const approvedBookings = normalizedBookings.filter((booking) => booking.status === "approved");

    return {
      approved: approvedBookings.length,
      pending: normalizedBookings.filter((booking) => booking.status === "pending").length,
      rejected: normalizedBookings.filter((booking) => booking.status === "rejected").length,
      totalGuests: approvedBookings.reduce((total, booking) => total + booking.guestCount, 0),
      upcoming: approvedBookings.filter((booking) => new Date(booking.eventDate) >= new Date("2026-04-24")).length,
    };
  }, [normalizedBookings]);

  const filteredBookings = useMemo(
    () =>
      statusFilter === "all"
        ? normalizedBookings
        : normalizedBookings.filter((booking) => booking.status === statusFilter),
    [normalizedBookings, statusFilter],
  );

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Admin Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Manage venue bookings and requests.
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-muted-foreground">
            Review incoming booking details, check layout notes, and approve or reject requests from one focused dashboard.
          </p>
        </div>
        <ContextHelp
          label="Admin dashboard help"
          tooltip="Review booking requests and update statuses."
          title="Admin dashboard"
          description="Use this dashboard to filter booking requests, open booking details, review event notes, and update customer request statuses."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Pending" value={stats.pending} icon={<Clock className="size-4 text-warning" />} />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle className="size-4 text-success" />} />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle className="size-4 text-destructive" />} />
        <StatCard label="Upcoming" value={stats.upcoming} icon={<CalendarDays className="size-4 text-primary" />} />
        <StatCard label="Total Guests" value={stats.totalGuests} icon={<Users className="size-4 text-primary" />} />
      </div>

      <Card className="overflow-hidden rounded-[var(--radius-sm)]">
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <CardTitle className="font-display text-2xl">Recent Bookings</CardTitle>
            <div className="booking-planner-mode-toggle inline-flex flex-wrap gap-1 rounded-lg border border-[#c9a27e]/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] p-1 shadow-[0_6px_16px_rgba(114,76,43,0.12)]">
              {STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.value;

                return (
                  <button
                    className={cn(
                      "booking-planner-control h-7 rounded-md px-3 !text-[11px] font-semibold !leading-none transition",
                      isActive
                        ? "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] text-white shadow-[0_5px_14px_rgba(184,111,41,0.26)]"
                        : "text-[#5f3f2f] hover:text-[#8d542d]",
                    )}
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden grid-cols-[0.74fr_1.16fr_0.94fr_0.94fr_0.76fr_0.74fr_0.78fr_0.56fr] gap-3 border-b border-border/70 bg-white/38 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground xl:grid">
            <span>Ref</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Type</span>
            <span>Status</span>
            <span>Deposit</span>
            <span>Full Payment</span>
            <span className="text-center">Actions</span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No bookings found for this status.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredBookings.map((booking) => (
                <div
                  className="grid gap-3 px-5 py-4 xl:grid-cols-[0.74fr_1.16fr_0.94fr_0.94fr_0.76fr_0.74fr_0.78fr_0.56fr] xl:items-center"
                  key={booking.id}
                >
                  <div className="font-mono text-xs font-semibold text-foreground">
                    {booking.reference}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{booking.contactName}</p>
                    <p className="truncate text-xs text-muted-foreground">{booking.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{formatDate(booking.eventDate)}</p>
                    <p className="text-xs text-muted-foreground">{booking.timeSlotLabel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{booking.eventType}</p>
                    <p className="text-xs text-muted-foreground">{booking.guestCount} guests</p>
                  </div>
                  <StatusBadge status={booking.status} />
                  <div className="space-y-1 xl:space-y-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground xl:hidden">Deposit</p>
                    <PaymentBadge amount={booking.depositAmount} status={booking.depositStatus} />
                  </div>
                  <div className="space-y-1 xl:space-y-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground xl:hidden">Full Payment</p>
                    <PaymentBadge amount={booking.fullPaymentAmount} status={booking.fullPaymentStatus} />
                  </div>
                  <div className="flex flex-wrap justify-start gap-2 xl:justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_VIEW_BUTTON_CLASS)} size="default" variant="secondary">
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90dvh] w-[min(94vw,44rem)] overflow-y-auto rounded-[var(--radius-sm)]">
                        <DialogHeader>
                          <DialogTitle className="flex flex-wrap items-center gap-2">
                            Booking Details
                            <Badge className="font-mono">{booking.reference}</Badge>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Customer</p>
                            <p className="mt-2 font-semibold text-foreground">{booking.contactName}</p>
                            <p className="text-muted-foreground">{booking.contactEmail}</p>
                            <p className="text-muted-foreground">{booking.contactPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Event</p>
                            <p className="mt-2 font-semibold text-foreground">{booking.eventType}</p>
                            <p className="text-muted-foreground">{booking.venueName}</p>
                            <p className="text-muted-foreground">{formatDate(booking.eventDate)} | {booking.timeSlotLabel}</p>
                            <p className="text-muted-foreground">{booking.guestCount} guests</p>
                          </div>
                        </div>

                        <div className="grid gap-3 border-t border-border/70 pt-4 text-sm md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Deposit Status</p>
                            <div className="mt-2">
                              <PaymentBadge amount={booking.depositAmount} status={booking.depositStatus} />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Full Payment Status</p>
                            <div className="mt-2">
                              <PaymentBadge amount={booking.fullPaymentAmount} status={booking.fullPaymentStatus} />
                            </div>
                          </div>
                        </div>

                        {(booking.setupNotes || booking.specialRequests) ? (
                          <div className="space-y-3 border-t border-border/70 pt-4 text-sm">
                            {booking.setupNotes ? (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Setup Notes</p>
                                <p className="mt-2 rounded-[var(--radius-sm)] bg-white/60 p-3 text-muted-foreground">{booking.setupNotes}</p>
                              </div>
                            ) : null}
                            {booking.specialRequests ? (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Special Requests</p>
                                <p className="mt-2 rounded-[var(--radius-sm)] bg-white/60 p-3 text-muted-foreground">{booking.specialRequests}</p>
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {booking.layoutObjects > 0 ? (
                          <div className="border-t border-border/70 pt-4 text-sm">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              <LayoutTemplate className="size-4" />
                              Layout Map Included
                            </p>
                            <p className="mt-2 rounded-[var(--radius-sm)] bg-white/60 p-3 text-muted-foreground">
                              Total objects: {booking.layoutObjects}
                            </p>
                          </div>
                        ) : null}

                        <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs text-muted-foreground">
                            Created {formatCreatedAt(booking.createdAt)}
                          </span>
                          <div className="flex gap-2">
                            {booking.status !== "approved" ? (
                              <Button
                                className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_APPROVE_BUTTON_CLASS)}
                                onClick={() => updateBookingStatus(booking.id, "approved")}
                              >
                                Approve
                              </Button>
                            ) : null}
                            {booking.status !== "rejected" ? (
                              <Button
                                className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_REJECT_BUTTON_CLASS)}
                                onClick={() => updateBookingStatus(booking.id, "rejected")}
                              >
                                Reject
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
