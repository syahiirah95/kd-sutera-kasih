"use client";

import { Fragment, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  CircleDollarSign,
  CreditCard,
  Cuboid,
  LayoutGrid,
  LayoutTemplate,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { createPlannerVariantSelections } from "@/components/planner/planner-object-variants";
import { PlannerThreeDView } from "@/components/planner/planner-three-d-view";
import {
  type PlannerItem,
  type PlannerItemVariant,
  type PlannerPlacedItem,
  type PlannerVariantSelections,
} from "@/components/planner/planner-types";
import { BookingAvailabilityCalendar } from "@/components/shared/booking-availability-calendar";
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
import { useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type AdminAccessRequestRecord } from "@/lib/supabase/admin-access-requests";
import { type AdminBookingRecord, type BookingAvailabilityRecord, type PaymentStatus } from "@/lib/supabase/booking-data";
import { type BookingStatus } from "@/lib/types/booking";
import { cn } from "@/lib/utils";

type StatusFilter = BookingStatus | "all";
type AdminBooking = AdminBookingRecord;

const ADMIN_ACTION_BUTTON_CLASS =
  "!h-7 !w-24 !rounded-lg !px-2 !text-[11px] !font-semibold !leading-none";

const ADMIN_APPROVE_BUTTON_CLASS =
  "booking-form-nav-primary !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";

const ADMIN_VIEW_BUTTON_CLASS =
  "booking-form-nav-neutral !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";

const ADMIN_REJECT_BUTTON_CLASS =
  "booking-form-nav-secondary !border-[#ff1f2d] !bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] !text-white shadow-[0_0_16px_rgba(255,31,45,0.24),0_6px_16px_rgba(224,0,18,0.22)] hover:brightness-105";

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

function formatPaymentStatusPillLabel(value: PaymentStatus) {
  if (value === "not_paid") {
    return "Not Paid";
  }

  if (value === "paid") {
    return "Paid";
  }

  return "Pending";
}

function getPaymentStatusPillClassName(value: PaymentStatus) {
  if (value === "paid") {
    return "border-success/45 bg-[linear-gradient(135deg,#78a979_0%,#5f8a65_56%,#a8cfa7_100%)] text-white shadow-[0_8px_20px_rgba(95,138,101,0.18)]";
  }

  if (value === "not_paid") {
    return "border-[#ff1f2d]/60 bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] text-white shadow-[0_0_16px_rgba(255,31,45,0.18),0_8px_20px_rgba(224,0,18,0.16)]";
  }

  return "border-[#d7c2ac]/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(246,226,207,0.76)_100%)] text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.08)]";
}

function normalizeAdminBookings(bookings: AdminBooking[]) {
  return bookings.map((booking) => ({
    ...booking,
    depositStatus: "paid" as const,
  }));
}

function createPreviewItems(tableCountValue: string, tableType: string, stageType: string): PlannerPlacedItem[] {
  const tableCount = Math.min(24, Math.max(1, Number.parseInt(tableCountValue, 10) || 1));
  const defaultTableItemId = tableType === "rectangle" ? "rect-table" : "round-table";
  const defaultTableLabel = tableType === "rectangle" ? "Guest table" : "Round table";
  const columns = tableCount <= 8 ? 4 : tableCount <= 16 ? 5 : 6;
  const rows = Math.ceil(tableCount / columns);
  const startX = columns <= 4 ? 27 : 22;
  const gapX = columns <= 4 ? 14 : 11;
  const startY = rows <= 2 ? 50 : 42;
  const gapY = rows <= 2 ? 16 : 12;
  const items: PlannerPlacedItem[] = [];

  if (stageType !== "no-stage") {
    items.push({
      id: "preview-stage",
      itemId: stageType === "extended-stage" ? "pelamin" : "stage",
      label: stageType === "extended-stage" ? "Extended stage" : "Main stage",
      rotation: 0,
      widthClass: "w-28",
      x: 68,
      y: 18,
      zone: "Main stage",
    });
  }

  for (let index = 0; index < tableCount; index += 1) {
    const tableItemId = tableType === "mixed" && index % 3 === 0 ? "rect-table" : defaultTableItemId;
    const tableLabel = tableItemId === "rect-table" ? "Guest table" : defaultTableLabel;

    items.push({
      id: `preview-table-${index + 1}`,
      itemId: tableItemId,
      label: `${tableLabel} ${index + 1}`,
      rotation: 0,
      widthClass: tableType === "rectangle" ? "w-24" : "w-16",
      x: startX + (index % columns) * gapX,
      y: startY + Math.floor(index / columns) * gapY,
      zone: "Dining area",
    });
  }

  items.push({
    id: "preview-registration",
    itemId: "registration",
    label: "Registration table",
    rotation: 0,
    widthClass: "w-24",
    x: 17,
    y: 18,
    zone: "Entrance",
  });

  return items;
}

function EyebrowPill({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative inline-flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.08)_100%)] shadow-[0_14px_30px_rgba(114,76,43,0.16),0_3px_10px_rgba(114,76,43,0.09)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,248,239,0.22)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(157,106,64,0.16)] backdrop-blur-xl"
      />
      <p className="relative inline-flex items-center overflow-hidden rounded-full border border-[#d49b6a]/45 bg-[linear-gradient(135deg,rgba(220,164,83,0.28)_0%,rgba(255,250,244,0.46)_42%,rgba(191,118,47,0.22)_100%)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9b5f20] shadow-[0_10px_26px_rgba(114,76,43,0.16),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl transition-transform duration-200 will-change-transform hover:scale-[1.03]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.86)_45%,rgba(255,255,255,0)_100%)]"
        />
        {children}
      </p>
    </div>
  );
}

function PaymentBadge({
  amount,
  hideAmount = false,
  status,
}: Readonly<{
  amount: number;
  hideAmount?: boolean;
  status: PaymentStatus;
}>) {
  const label = {
    not_paid: "Not paid",
    paid: "Paid",
    pending: "Pending",
  }[status];

  const iconClassName = {
    not_paid: "border-destructive/30 bg-destructive/15 text-destructive",
    paid: "border-success/30 bg-success/15 text-success",
    pending: "border-warning/30 bg-warning/15 text-warning",
  }[status];

  const Icon = status === "paid" ? CheckCircle : status === "pending" ? Clock : CircleDollarSign;

  return (
    <div className="flex items-center gap-2">
      {!hideAmount ? <p className="text-xs font-semibold text-foreground">{formatCurrency(amount)}</p> : null}
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

function PreviewCanvas({
  mode,
  plannerItems,
  plannerVariantsByItemId,
  venueName,
}: Readonly<{
  mode: "2d" | "3d";
  plannerItems: PlannerItem[];
  plannerVariantsByItemId: Record<string, PlannerItemVariant[]>;
  venueName: string;
}>) {
  const previewItems = useMemo(() => createPreviewItems("12", "round", "low-stage"), []);
  const defaultLayoutVariants: PlannerVariantSelections = useMemo(
    () => createPlannerVariantSelections(plannerItems, plannerVariantsByItemId),
    [plannerItems, plannerVariantsByItemId],
  );

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="pointer-events-none overflow-hidden rounded-[calc(var(--radius-sm)-0.2rem)] border border-border/70 bg-white shadow-[0_12px_30px_rgba(104,74,58,0.08)]">
        <PlannerThreeDView
          activeItem={null}
          cameraModeOverride={mode === "2d" ? "top" : "perspective"}
          compact
          disableControls
          hideToolbar
          isEditMode={false}
          isMoveMode={false}
          items={plannerItems}
          lowPower
          placedItems={previewItems}
          selectedPlacedItemId={null}
          selectedVariantIdsByItemId={defaultLayoutVariants}
          variantsByItemId={plannerVariantsByItemId}
          onCanvasAction={() => {}}
          onCanvasSelect={() => {}}
          onClearSelection={() => {}}
          onCopy={() => {}}
          onDelete={() => {}}
          onEditModeToggle={() => {}}
          onItemMove={() => {}}
          onMoveMode={() => {}}
          onResetLayout={() => {}}
          onRotateLeft={() => {}}
          onRotateRight={() => {}}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
            {mode === "2d" ? "2D Layout" : "3D Layout"}
          </p>
          <p className="text-xs text-muted-foreground">
            Default reception preview for {venueName}.
          </p>
        </div>
        <Badge>Default</Badge>
      </div>
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

export function AdminDashboard({
  initialAdminRequests,
  initialAvailability,
  initialBookings,
  isAdmin,
  plannerItems,
  plannerVariantsByItemId,
  venues,
}: Readonly<{
  initialAdminRequests: AdminAccessRequestRecord[];
  initialAvailability: BookingAvailabilityRecord[];
  initialBookings: AdminBooking[];
  isAdmin: boolean;
  plannerItems: PlannerItem[];
  plannerVariantsByItemId: Record<string, PlannerItemVariant[]>;
  venues: Array<{
    name: string;
    operatingHours?: string;
    slug: string;
  }>;
}>) {
  const { toast } = useToast();
  const [adminRequests, setAdminRequests] = useState(initialAdminRequests);
  const [availabilityRecords, setAvailabilityRecords] = useState(initialAvailability);
  const [bookings, setBookings] = useState<AdminBooking[]>(() => normalizeAdminBookings(initialBookings));
  const [expandedBookingIds, setExpandedBookingIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const stats = useMemo(() => {
    const approvedBookings = bookings.filter((booking) => booking.status === "approved");

    return {
      approved: approvedBookings.length,
      pending: bookings.filter((booking) => booking.status === "pending").length,
      pendingAdminRequests: adminRequests.filter((request) => request.status === "pending").length,
      rejected: bookings.filter((booking) => booking.status === "rejected").length,
      totalGuests: approvedBookings.reduce((total, booking) => total + booking.guestCount, 0),
      upcoming: approvedBookings.filter((booking) => new Date(booking.eventDate) >= new Date()).length,
    };
  }, [adminRequests, bookings]);

  const filteredBookings = useMemo(
    () =>
      statusFilter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter),
    [bookings, statusFilter],
  );

  async function updateBookingStatus(id: string, status: BookingStatus) {
    const response = await fetch(`/api/admin/bookings/${id}/status`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (response.ok) {
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === id ? { ...booking, status } : booking,
        ),
      );
      setAvailabilityRecords((currentRecords) => {
        const existingRecordIndex = currentRecords.findIndex((record) => record.id === id);

        if (status === "rejected") {
          return currentRecords.filter((record) => record.id !== id);
        }

        if (existingRecordIndex >= 0) {
          return currentRecords.map((record) =>
            record.id === id ? { ...record, status } : record,
          );
        }

        const booking = bookings.find((entry) => entry.id === id);

        if (!booking) {
          return currentRecords;
        }

        return [
          ...currentRecords,
          {
            eventDate: booking.eventDate,
            id: booking.id,
            status,
            timeSlotLabel: booking.timeSlotLabel,
            venueName: booking.venueName,
            venueSlug: booking.venueSlug,
          },
        ];
      });
      toast({
        message:
          status === "approved"
            ? "Booking approved. That one is officially moving."
            : "Booking rejected. Not the ending they wanted, but here we are.",
        title: status === "approved" ? "Done deal" : "Decision made",
        variant: "success",
      });
      return;
    }

    toast({
      message: "We couldn't update that booking status right now. The dashboard blinked first.",
      title: "Oh no",
      variant: "error",
    });
  }

  async function decideAdminRequest(id: string, decision: "approved" | "rejected") {
    const response = await fetch(`/api/admin/requests/${id}`, {
      body: JSON.stringify({ decision }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (response.ok) {
      setAdminRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                reviewedAt: new Date().toISOString(),
                status: decision,
              }
            : request,
        ),
      );
      toast({
        message:
          decision === "approved"
            ? "Admin access approved. Power has been bestowed."
            : "Admin request rejected. A noble attempt, still.",
        title: decision === "approved" ? "Request approved" : "Request rejected",
        variant: "success",
      });
      return;
    }

    toast({
      message: "We couldn't update that admin request right now. The paperwork has become theatrical.",
      title: "Oh no",
      variant: "error",
    });
  }

  function toggleExpanded(bookingId: string) {
    setExpandedBookingIds((current) =>
      current.includes(bookingId) ? current.filter((id) => id !== bookingId) : [...current, bookingId],
    );
  }

  if (!isAdmin) {
    return (
      <Card className="mx-auto max-w-2xl rounded-[var(--radius-sm)]">
        <CardContent className="space-y-3 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Admin Access
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            This account is not authorized for the admin dashboard.
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in with an account listed in kd_sutera_kasih_admin_users, then open the admin view again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <EyebrowPill>Admin Dashboard</EyebrowPill>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            <span className="inline-flex items-center" data-butterfly-anchor="admin-title">
            Manage venue bookings and requests.
            </span>
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-muted-foreground">
            Review incoming booking details, check layout notes, and approve or reject requests from one focused dashboard.
          </p>
        </div>
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
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <UserPlus className="size-5 text-primary" />
                <span data-butterfly-anchor="section">Admin Access Requests</span>
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Review users who requested permission to open the admin dashboard.
              </p>
            </div>
            <Badge>{stats.pendingAdminRequests} pending</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {adminRequests.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No admin access requests yet.
            </div>
          ) : (
            <div className="booking-layout-preview-scroll overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left text-sm leading-6">
                <thead>
                  <tr className="border-b border-border/70 bg-white/38 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Requested</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {adminRequests.map((request) => (
                    <tr className="transition hover:bg-primary/10" key={request.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">{request.displayName ?? request.email}</p>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{formatCreatedAt(request.requestedAt)}</td>
                      <td className="px-5 py-4">
                        <Badge className="capitalize">{request.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_APPROVE_BUTTON_CLASS)}
                            disabled={request.status === "approved"}
                            onClick={() => decideAdminRequest(request.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_REJECT_BUTTON_CLASS)}
                            disabled={request.status === "rejected"}
                            onClick={() => decideAdminRequest(request.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[var(--radius-sm)]">
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <CardTitle className="font-display text-2xl">
              <span data-butterfly-anchor="section">Recent Bookings</span>
            </CardTitle>
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
          {filteredBookings.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No bookings found for this status.
            </div>
          ) : (
            <div className="booking-layout-preview-scroll overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[66rem] border-collapse text-left text-sm leading-6 lg:min-w-0">
                <thead>
                  <tr className="border-b border-[#d49b6a]/35 bg-[linear-gradient(135deg,rgba(220,164,83,0.28)_0%,rgba(255,250,244,0.46)_42%,rgba(191,118,47,0.22)_100%)] text-xs uppercase tracking-[0.16em] text-[#9b5f20] shadow-[0_10px_26px_rgba(114,76,43,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
                    <th className="w-12 px-3 py-3 font-bold text-[#9b5f20]" />
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Reference</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Venue</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Event</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Schedule</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Guests</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20]">Status</th>
                    <th className="px-5 py-3 text-center font-bold text-[#9b5f20]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground">
                  {filteredBookings.map((booking) => {
                    const isExpanded = expandedBookingIds.includes(booking.id);

                    return (
                      <Fragment key={booking.id}>
                        <tr
                          className={cn(
                            "transition hover:bg-primary/10",
                            isExpanded && "bg-[linear-gradient(180deg,rgba(255,248,239,0.88)_0%,rgba(255,255,255,0.52)_100%)]",
                          )}
                        >
                          <td className="px-3 py-4 align-top">
                            <button
                              aria-expanded={isExpanded}
                              aria-label={isExpanded ? "Collapse booking details" : "Expand booking details"}
                              className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-white/72 text-[#8d542d] transition hover:border-[#c8893e]/70 hover:bg-white hover:text-[#5f3f2f]"
                              onClick={() => toggleExpanded(booking.id)}
                              type="button"
                            >
                              <ChevronDown className={cn("size-4 transition-transform", isExpanded && "rotate-180")} />
                            </button>
                          </td>
                          <td className="px-5 py-4 align-top font-mono text-xs font-semibold text-foreground">
                            {booking.reference}
                            <p className="mt-1 font-sans text-[11px] font-medium text-muted-foreground">
                              {formatCreatedAt(booking.createdAt)}
                            </p>
                          </td>
                          <td className="px-5 py-4 align-top">
                            <p className="font-display text-xl font-semibold leading-tight text-foreground">{booking.venueName}</p>
                          </td>
                          <td className="px-5 py-4 align-top text-foreground">{booking.eventType}</td>
                          <td className="px-5 py-4 align-top">
                            <p className="font-medium text-foreground">{formatDate(booking.eventDate)}</p>
                            <p className="text-xs">{booking.timeSlotLabel}</p>
                          </td>
                          <td className="px-5 py-4 align-top text-foreground">{booking.guestCount}</td>
                          <td className="px-5 py-4 align-top">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-5 py-4 align-top">
                            <div className="flex justify-center">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_VIEW_BUTTON_CLASS)} size="default" variant="secondary">
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="booking-layout-preview-scroll max-h-[90dvh] w-[min(94vw,44rem)] overflow-y-auto rounded-[var(--radius-sm)]">
                                  <DialogHeader>
                                    <DialogTitle className="flex flex-wrap items-center gap-2">
                                      <span className="inline-flex items-center" data-butterfly-anchor="booking-details-title">
                                        Booking Details
                                      </span>
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

                                  <div className="grid gap-4 border-t border-border/70 pb-3 pt-4 text-sm md:grid-cols-2">
                                    <div className="space-y-3">
                                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Deposit Status</p>
                                      <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{formatCurrency(booking.depositAmount)}</p>
                                        <Badge
                                          className={cn(
                                            "inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-semibold leading-none",
                                            getPaymentStatusPillClassName(booking.depositStatus),
                                          )}
                                        >
                                          {formatPaymentStatusPillLabel(booking.depositStatus)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Full Payment Status</p>
                                      <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{formatCurrency(booking.fullPaymentAmount)}</p>
                                        <Badge
                                          className={cn(
                                            "inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-semibold leading-none",
                                            getPaymentStatusPillClassName(booking.fullPaymentStatus),
                                          )}
                                        >
                                          {formatPaymentStatusPillLabel(booking.fullPaymentStatus)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

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

                                  <div className="space-y-3 border-t border-border/70 pt-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                                          Booking Approval
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Review booking details before approving this request for the venue schedule.
                                        </p>
                                      </div>
                                      {booking.status === "pending" ? (
                                        <div className="flex gap-2">
                                          <Button
                                            className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_APPROVE_BUTTON_CLASS)}
                                            onClick={() => updateBookingStatus(booking.id, "approved")}
                                          >
                                            Approve
                                          </Button>
                                          <Button
                                            className={cn(ADMIN_ACTION_BUTTON_CLASS, ADMIN_REJECT_BUTTON_CLASS)}
                                            onClick={() => updateBookingStatus(booking.id, "rejected")}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      ) : null}
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground">
                                        Created {formatCreatedAt(booking.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>

                        {isExpanded ? (
                          <tr>
                            <td className="p-0" colSpan={8}>
                              <div className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.94)_0%,rgba(255,248,239,0.84)_100%)] px-5 py-4">
                                <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)_minmax(0,1fr)]">
                                  <div className="flex min-w-0 h-full flex-col gap-2">
                                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                                      <div className="flex items-center gap-2">
                                        <CreditCard className="size-4 text-primary" />
                                        Payment Action
                                      </div>
                                    </div>

                                    <div className="relative flex min-w-0 h-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                                      <div className="flex-1 min-w-0 overflow-hidden rounded-[calc(var(--radius-sm)-0.2rem)] border border-border/70 bg-white shadow-[0_12px_30px_rgba(104,74,58,0.08)]">
                                        <table className="w-full border-collapse text-left text-sm">
                                          <thead>
                                            <tr className="bg-[linear-gradient(135deg,rgba(220,164,83,0.18)_0%,rgba(255,250,244,0.46)_100%)] text-[11px] uppercase tracking-[0.16em] text-[#9b5f20]">
                                              <th className="px-3 py-2 font-semibold">Payment</th>
                                              <th className="px-3 py-2 font-semibold">Amount</th>
                                              <th className="px-3 py-2 text-center font-semibold">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border/60 bg-white/72 text-muted-foreground">
                                            <tr>
                                              <td className="px-3 py-3 font-semibold text-foreground">Deposit</td>
                                              <td className="px-3 py-3 font-semibold text-foreground">{formatCurrency(booking.depositAmount)}</td>
                                              <td className="px-3 py-3 text-center">
                                                <PaymentBadge amount={booking.depositAmount} hideAmount status={booking.depositStatus} />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="px-3 py-3 font-semibold text-foreground">Full Repayment</td>
                                              <td className="px-3 py-3 font-semibold text-foreground">{formatCurrency(booking.fullPaymentAmount)}</td>
                                              <td className="px-3 py-3 text-center">
                                                <PaymentBadge amount={booking.fullPaymentAmount} hideAmount status={booking.fullPaymentStatus} />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="px-3 py-3 font-semibold text-foreground">Total Payment</td>
                                              <td className="px-3 py-3 font-semibold text-foreground">{formatCurrency(booking.depositAmount + booking.fullPaymentAmount)}</td>
                                              <td className="px-3 py-3 text-center">
                                                <span className="text-xs font-medium text-muted-foreground">Summary</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="mt-3 flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                                            Payment Summary
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Deposit is settled. Full payment is ready whenever you are.
                                          </p>
                                        </div>
                                        <Badge>
                                          {booking.fullPaymentStatus === "paid" ? "Settled" : "Pending"}
                                        </Badge>
                                      </div>

                                      <div className="mt-3 flex justify-end">
                                        <span className="text-xs font-medium text-muted-foreground">
                                          Managed in booking details
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="min-w-0 space-y-2">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                                      <LayoutGrid className="size-4 text-primary" />
                                      2D Preview
                                    </div>
                                    <PreviewCanvas
                                      mode="2d"
                                      plannerItems={plannerItems}
                                      plannerVariantsByItemId={plannerVariantsByItemId}
                                      venueName={booking.venueName}
                                    />
                                  </div>

                                  <div className="min-w-0 space-y-2">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                                      <Cuboid className="size-4 text-primary" />
                                      3D Preview
                                    </div>
                                    <PreviewCanvas
                                      mode="3d"
                                      plannerItems={plannerItems}
                                      plannerVariantsByItemId={plannerVariantsByItemId}
                                      venueName={booking.venueName}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <BookingAvailabilityCalendar
        bookings={availabilityRecords}
        initialVenueSlug={filteredBookings[0]?.venueSlug ?? venues[0]?.slug}
        title="Booking Availability"
        venues={venues}
      />
    </div>
  );
}
