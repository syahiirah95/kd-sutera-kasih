"use client";

import { Fragment, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Cuboid,
  Download,
  LayoutGrid,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { downloadBookingPdf } from "@/components/booking/booking-confirmation-step";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { BookingAvailabilityRecord, PaymentStatus, UserBookingRecord } from "@/lib/supabase/booking-data";
import { cn } from "@/lib/utils";

type AccountOverviewProps = {
  availability: BookingAvailabilityRecord[];
  bookings: UserBookingRecord[];
  plannerItems: PlannerItem[];
  plannerVariantsByItemId: Record<string, PlannerItemVariant[]>;
  venues: Array<{
    name: string;
    operatingHours?: string;
    slug: string;
  }>;
};

const ACCOUNT_PRIMARY_BUTTON_CLASS =
  "booking-form-nav-primary inline-flex !h-7 !w-32 items-center justify-center !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-2 text-center !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";
const ACCOUNT_SECONDARY_BUTTON_CLASS =
  "booking-form-nav-neutral inline-flex !h-7 !w-36 items-center justify-center !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(246,226,207,0.76)_100%)] !px-3 text-center !text-[11px] !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";
const ACCOUNT_RECEIPT_BUTTON_CLASS =
  "booking-form-nav-neutral inline-flex !h-7 items-center justify-center gap-1.5 !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(246,226,207,0.76)_100%)] !px-3 text-center !text-[11px] !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";
function normalizeBookings(bookings: UserBookingRecord[]): UserBookingRecord[] {
  return bookings.map((booking) => ({
    ...booking,
    depositStatus: "paid",
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    currency: "MYR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatPaymentStatus(value: PaymentStatus) {
  return value.replace("_", " ");
}

function formatSubmittedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimeRangeLabel(value: string) {
  const [startTime, endTime] = value.split("-").map((segment) => segment.trim());

  return {
    endTime: endTime ?? value,
    startTime: startTime ?? value,
  };
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

function BookingEmptyState() {
  return (
    <Card className="rounded-[var(--radius-sm)]">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <ReceiptText className="size-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">No booking yet</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your submitted venue booking requests will appear here once you send one.
        </p>
        <Button asLink className={`mt-6 ${ACCOUNT_PRIMARY_BUTTON_CLASS}`} href="/booking">
          Start Booking
        </Button>
      </CardContent>
    </Card>
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
          hideToolbar
          isEditMode={false}
          isMoveMode={false}
          items={plannerItems}
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

function PaymentStatusCell({
  booking,
  onDownloadReceipt,
  status,
}: Readonly<{
  booking: UserBookingRecord;
  onDownloadReceipt?: () => void;
  status: PaymentStatus;
}>) {
  const isPaid = status === "paid";
  const Icon = isPaid ? CheckCircle2 : XCircle;
  const iconClassName = isPaid ? "text-[#3d8f5d]" : "text-[#d14b55]";

  return (
    <div className="inline-flex items-center justify-center gap-2" title={formatPaymentStatus(status)}>
      <Icon className={cn("size-4 shrink-0", iconClassName)} />
      {onDownloadReceipt && isPaid ? (
        <button
          aria-label={`Download receipt for ${booking.reference}`}
          className="inline-flex size-7 items-center justify-center rounded-full border border-border/70 bg-white/72 text-[#8d542d] transition hover:border-[#c8893e]/70 hover:bg-white hover:text-[#5f3f2f]"
          onClick={onDownloadReceipt}
          type="button"
        >
          <Download className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function BookingTable({
  bookings,
  plannerItems,
  plannerVariantsByItemId,
}: Readonly<{
  bookings: UserBookingRecord[];
  plannerItems: PlannerItem[];
  plannerVariantsByItemId: Record<string, PlannerItemVariant[]>;
}>) {
  const { toast } = useToast();
  const [bookingRows, setBookingRows] = useState(() => normalizeBookings(bookings));
  const [expandedBookingIds, setExpandedBookingIds] = useState<string[]>([]);
  const [paymentModalBookingId, setPaymentModalBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Online banking");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const bookingById = useMemo(
    () => new Map(bookingRows.map((booking) => [booking.id, booking])),
    [bookingRows],
  );

  const paymentModalBooking = paymentModalBookingId
    ? bookingById.get(paymentModalBookingId) ?? null
    : null;

  const toggleExpanded = (bookingId: string) => {
    setExpandedBookingIds((current) =>
      current.includes(bookingId) ? current.filter((id) => id !== bookingId) : [...current, bookingId],
    );
  };

  const payFullPayment = async (bookingId: string) => {
    setIsSubmittingPayment(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/payment`, {
        body: JSON.stringify({
          paymentMethod,
          paymentTarget: "full",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json().catch(() => null)) as
        | {
            booking?: {
              depositStatus?: PaymentStatus;
              fullPaymentStatus?: PaymentStatus;
              id: string;
            } | null;
            error?: string;
          }
        | null;

      if (!response.ok || !result?.booking) {
        throw new Error(result?.error || "Unable to save payment right now.");
      }

      setBookingRows((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                depositStatus: result.booking?.depositStatus ?? booking.depositStatus,
                fullPaymentStatus: result.booking?.fullPaymentStatus ?? booking.fullPaymentStatus,
              }
            : booking,
        ),
      );

      toast({
        message: "Full payment received. A very satisfying little victory.",
        title: "Paid up",
        variant: "success",
      });

      setPaymentModalBookingId(null);
    } catch (error) {
      toast({
        message: error instanceof Error ? error.message : "Unable to save payment right now.",
        title: "Payment not saved",
        variant: "error",
      });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const downloadReceipt = (booking: UserBookingRecord, kind: "deposit" | "full") => {
    const { startTime, endTime } = formatTimeRangeLabel(booking.timeSlotLabel);

    downloadBookingPdf({
      bookingReference: booking.reference,
      fileName:
        kind === "deposit"
          ? `${booking.reference.toLowerCase()}-deposit-receipt.pdf`
          : `${booking.reference.toLowerCase()}-full-payment-receipt.pdf`,
      formData: {
        contactEmail: booking.contactEmail,
        contactName: booking.contactName,
        endTime,
        eventDate: booking.eventDate,
        eventType: booking.eventType,
        guestCount: String(booking.guestCount),
        organization: booking.organization ?? "",
        phoneNumber: booking.contactPhone,
        specialRequests: booking.specialRequests ?? "",
        startTime,
        themeStyle: booking.themeStyle ?? "",
        vendorNotes: "",
        venueSlug: booking.venueSlug,
      },
      paymentMethod,
      paymentSectionTitle: kind === "deposit" ? "Payment Deposit" : "Full Payment",
      paymentStatusLabel:
        kind === "deposit"
          ? `Mock payment ${formatPaymentStatus(booking.depositStatus)}`
          : `Mock payment ${formatPaymentStatus(booking.fullPaymentStatus)}`,
      receiptTitle: kind === "deposit" ? "Deposit Receipt" : "Full Payment Receipt",
      selectedEventType: booking.eventType,
      selectedTimeRange: booking.timeSlotLabel,
      selectedVenueContactPhone: "+60 13-820 1142",
      selectedVenueName: booking.venueName,
      selectedVenuePricing: {
        depositAmount: kind === "deposit" ? booking.depositAmount : booking.fullPaymentAmount,
        furniturePackage: 650,
        hallPackage: booking.estimatedTotalAmount - 650 - 850,
        propsPackage: 850,
      },
    });
  };

  return (
    <>
      <Card className="overflow-hidden rounded-[var(--radius-sm)] border-white/75 bg-white/72 shadow-[0_18px_46px_rgba(114,76,43,0.16)]">
        <div className="booking-layout-preview-scroll overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[58rem] border-collapse text-left text-sm leading-6 lg:min-w-0">
            <thead>
              <tr className="border-b border-[#d49b6a]/35 bg-[linear-gradient(135deg,rgba(220,164,83,0.28)_0%,rgba(255,250,244,0.46)_42%,rgba(191,118,47,0.22)_100%)] text-xs uppercase tracking-[0.16em] text-[#9b5f20] shadow-[0_10px_26px_rgba(114,76,43,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
                <th className="w-12 px-3 py-3 font-bold text-[#9b5f20]" />
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Reference</th>
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Venue</th>
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Event</th>
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Schedule</th>
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Guests</th>
                <th className="px-5 py-3 font-bold text-[#9b5f20]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              {bookingRows.map((booking) => {
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
                          {formatSubmittedDate(booking.submittedAt)}
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
                    </tr>

                    {isExpanded ? (
                      <tr>
                        <td className="p-0" colSpan={7}>
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
                                          <td className="px-3 py-3 font-semibold text-foreground">
                                            {formatCurrency(booking.depositAmount)}
                                          </td>
                                          <td className="px-3 py-3 text-center">
                                            <PaymentStatusCell
                                              booking={booking}
                                              onDownloadReceipt={() => downloadReceipt(booking, "deposit")}
                                              status={booking.depositStatus}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-3 font-semibold text-foreground">Full Repayment</td>
                                          <td className="px-3 py-3 font-semibold text-foreground">
                                            {formatCurrency(booking.fullPaymentAmount)}
                                          </td>
                                          <td className="px-3 py-3 text-center">
                                            <PaymentStatusCell
                                              booking={booking}
                                              onDownloadReceipt={() => downloadReceipt(booking, "full")}
                                              status={booking.fullPaymentStatus}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-3 font-semibold text-foreground">Total Payment</td>
                                          <td className="px-3 py-3 font-semibold text-foreground">
                                            {formatCurrency(booking.estimatedTotalAmount)}
                                          </td>
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

                                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                    {booking.depositStatus === "paid" ? (
                                      <Button
                                        className={ACCOUNT_RECEIPT_BUTTON_CLASS}
                                        onClick={() => downloadReceipt(booking, "deposit")}
                                        type="button"
                                        variant="secondary"
                                      >
                                        <Download className="size-3.5" />
                                        Deposit Receipt
                                      </Button>
                                    ) : null}
                                    {booking.fullPaymentStatus === "paid" ? (
                                      <Button
                                        className={ACCOUNT_RECEIPT_BUTTON_CLASS}
                                        onClick={() => downloadReceipt(booking, "full")}
                                        type="button"
                                        variant="secondary"
                                      >
                                        <Download className="size-3.5" />
                                        Full Receipt
                                      </Button>
                                    ) : (
                                      <Button
                                        className={ACCOUNT_PRIMARY_BUTTON_CLASS}
                                        onClick={() => setPaymentModalBookingId(booking.id)}
                                        type="button"
                                      >
                                        Pay
                                      </Button>
                                    )}
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
      </Card>

      <Dialog open={Boolean(paymentModalBooking)} onOpenChange={(open) => {
        if (!open) {
          setPaymentModalBookingId(null);
        }
      }}>
        <DialogContent className="w-[min(92vw,28rem)] rounded-[var(--radius-sm)]">
          <DialogHeader className="pr-0 text-center">
            <DialogTitle>
              <span className="inline-flex items-center" data-butterfly-anchor="payment-dialog-title">
                Complete Payment
              </span>
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-[22rem] text-center">
              Mock payment only, but we can still make it feel reassuringly official.
            </DialogDescription>
          </DialogHeader>

          {paymentModalBooking ? (
            <div className="space-y-4">
              <div className="rounded-[var(--radius-sm)] border border-border/70 bg-white/72 p-4 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{paymentModalBooking.venueName}</p>
                    <p className="text-xs">{paymentModalBooking.reference}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(paymentModalBooking.fullPaymentAmount)}</p>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-[13px]" htmlFor="mock-payment-method">Payment method</Label>
                <Select
                  id="mock-payment-method"
                  className="h-10 rounded-lg border-[#c9a27e]/45 bg-white/80 px-3 text-sm font-semibold text-[#5f3f2f]"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                >
                  <option value="Online banking">Online banking</option>
                  <option value="Card">Card</option>
                  <option value="Pay at venue">Pay at venue</option>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className={ACCOUNT_SECONDARY_BUTTON_CLASS}
                  disabled={isSubmittingPayment}
                  onClick={() => setPaymentModalBookingId(null)}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  className={ACCOUNT_PRIMARY_BUTTON_CLASS}
                  disabled={isSubmittingPayment}
                  onClick={() => {
                    void payFullPayment(paymentModalBooking.id);
                  }}
                  type="button"
                >
                  {isSubmittingPayment ? "Saving" : "Confirm Payment"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AccountOverview({
  availability,
  bookings,
  plannerItems,
  plannerVariantsByItemId,
  venues,
}: AccountOverviewProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex">
          <EyebrowPill>Profile</EyebrowPill>
        </div>
        <h1
          className="inline-block font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl"
          data-butterfly-anchor="my-bookings-title"
        >
          My Booking
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          Review every venue booking request you have submitted and keep track of payment details in one place.
        </p>
      </div>

      {bookings.length === 0 ? (
        <BookingEmptyState />
      ) : (
        <BookingTable
          bookings={bookings}
          plannerItems={plannerItems}
          plannerVariantsByItemId={plannerVariantsByItemId}
        />
      )}

      {venues.length > 0 ? (
        <BookingAvailabilityCalendar
          bookings={availability}
          initialVenueSlug={bookings[0]?.venueSlug ?? venues[0]?.slug}
          title="Hall Availability"
          venues={venues}
        />
      ) : null}
    </section>
  );
}
