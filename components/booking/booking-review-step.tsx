"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  CircleCheck,
  CreditCard,
  UserRound,
} from "lucide-react";
import { type BookingFormData } from "@/components/booking/booking-request-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

type BookingReviewStepProps = {
  formData: BookingFormData;
  layoutSkipped: boolean;
  onEditStep: (step: number) => void;
  onPaymentMethodChange: (method: string) => void;
  paymentMethod: string;
  reviewPageIndex: number;
  selectedEventType: string;
  selectedTimeRange: string;
  selectedVenueBookingVideoSrc?: string;
  selectedVenueName: string;
  selectedVenuePricing?: {
    depositAmount: number;
    furniturePackage: number;
    hallPackage: number;
    propsPackage: number;
  };
};

type ReviewRow = {
  control?: React.ReactNode;
  emphasis?: boolean;
  label: string;
  value?: string;
};

type ReviewPage = {
  editStep: number;
  icon: typeof CalendarDays;
  isPayment?: boolean;
  paymentControl?: React.ReactNode;
  rows: ReviewRow[];
  title: string;
};

const MOCK_PAYMENT_METHODS = ["Online banking", "Card", "Pay at venue"] as const;

function formatRinggit(value: number) {
  return `RM ${value.toLocaleString("en-MY")}`;
}

function ReviewRows({ rows }: Readonly<{ rows: ReviewRow[] }>) {
  return (
    <div className="divide-y divide-[rgba(145,108,84,0.16)]">
      {rows.map((row) => (
        <div
          className={`grid gap-1 ${
            row.emphasis
              ? "bg-[linear-gradient(90deg,rgba(220,164,83,0.14)_0%,rgba(255,250,244,0.24)_100%)] py-1 text-sm leading-5"
              : "py-0.5 text-[12px] leading-5"
          } sm:grid-cols-[7rem_1fr] sm:items-center`}
          key={row.label}
        >
          <p className={row.emphasis ? "font-semibold text-[#8d542d]" : "text-muted-foreground"}>{row.label}</p>
          {row.control ? (
            <div className="sm:justify-self-end">{row.control}</div>
          ) : (
            <p className={`break-words font-semibold sm:text-right ${row.emphasis ? "text-base text-[#8d542d]" : "text-foreground"}`}>
              {row.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  depositAmount,
  page,
  onEditStep,
}: Readonly<{
  depositAmount: number;
  page: ReviewPage;
  onEditStep: (step: number) => void;
}>) {
  const PageIcon = page.icon;

  return (
    <Card className="relative z-10 flex h-52 flex-col overflow-visible rounded-[var(--radius-sm)] shadow-[0_8px_20px_rgba(114,76,43,0.08)]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-3 pb-0">
        <div className="flex min-w-0 items-center gap-2">
          <PageIcon className="size-3.5 shrink-0 text-primary" />
          <CardTitle className="truncate text-sm">{page.title}</CardTitle>
        </div>
        <Button
          className="!h-7 !w-16 shrink-0 !rounded-lg !px-2 !text-[11px] !font-semibold !leading-none text-[#5f3f2f]"
          size="default"
          variant="ghost"
          onClick={() => onEditStep(page.editStep)}
        >
          Edit
        </Button>
      </CardHeader>
      <CardContent className={`booking-layout-preview-scroll min-h-0 flex-1 p-3 pt-1 ${page.isPayment ? "overflow-visible" : "overflow-y-auto"}`}>
        {page.paymentControl ? (
          <div className="mb-2 grid gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d542d]">
              Payment method
            </p>
            {page.paymentControl}
          </div>
        ) : null}
        <ReviewRows rows={page.rows} />
        {page.isPayment ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Mock payment only. Deposit due now: {formatRinggit(depositAmount)}.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function BookingReviewStep({
  formData,
  layoutSkipped,
  onEditStep,
  onPaymentMethodChange,
  paymentMethod,
  reviewPageIndex,
  selectedEventType,
  selectedTimeRange,
  selectedVenueBookingVideoSrc,
  selectedVenueName,
  selectedVenuePricing,
}: BookingReviewStepProps) {
  const pricing = selectedVenuePricing ?? {
    depositAmount: 500,
    furniturePackage: 650,
    hallPackage: 3200,
    propsPackage: 850,
  };
  const estimatedTotal = pricing.hallPackage + pricing.furniturePackage + pricing.propsPackage;
  const notePreview =
    formData.themeStyle || formData.specialRequests
      ? "Notes added for venue preparation."
      : "No extra notes were added.";
  const reviewPages = useMemo(
    () => [
      {
        editStep: 0,
        icon: CalendarDays,
        rows: [
          { label: "Hall", value: selectedVenueName },
          { label: "Type", value: selectedEventType },
          { label: "Date", value: formData.eventDate || "Not added yet" },
          { label: "Time", value: selectedTimeRange },
          { label: "Guests", value: formData.guestCount || "Not added yet" },
        ],
        title: "Event",
      },
      {
        editStep: 1,
        icon: UserRound,
        rows: [
          { label: "Name", value: formData.contactName || "Not added yet" },
          { label: "Email", value: formData.contactEmail || "Not added yet" },
          { label: "Phone", value: formData.phoneNumber || "Not added yet" },
          { label: "Organization", value: formData.organization || "Optional" },
        ],
        title: "Contact",
      },
      {
        editStep: 2,
        icon: CircleCheck,
        rows: [
          { label: "Theme / Style", value: formData.themeStyle || "Not added" },
          {
            label: "Setup notes",
            value: formData.specialRequests || "Not added",
          },
          {
            label: "Layout",
            value: layoutSkipped
              ? "Layout step was skipped. The booking request will proceed without a custom planner arrangement."
              : `Custom layout step was included. ${notePreview}`,
          },
        ],
        title: "Layout",
      },
      {
        editStep: 2,
        icon: CreditCard,
        rows: [
          { label: "Hall package", value: formatRinggit(pricing.hallPackage) },
          { label: "Furniture", value: formatRinggit(pricing.furniturePackage) },
          { label: "Props / decor", value: formatRinggit(pricing.propsPackage) },
          { emphasis: true, label: "Estimated total", value: formatRinggit(estimatedTotal) },
          { label: "Deposit now", value: formatRinggit(pricing.depositAmount) },
        ],
        title: "Pricing",
      },
      {
        editStep: 2,
        icon: CreditCard,
        isPayment: true,
        paymentControl: (
          <Select
            aria-label="Payment method"
            className="h-8 rounded-lg border-[#c9a27e]/45 bg-white/65 px-3 text-[12px] font-semibold text-[#5f3f2f]"
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
          >
            {MOCK_PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
        ),
        rows: [
          { label: "Deposit now", value: formatRinggit(pricing.depositAmount) },
          { label: "Status", value: "Mock payment pending" },
        ],
        title: "Payment",
      },
    ],
    [
      formData.contactEmail,
      formData.contactName,
      formData.eventDate,
      formData.guestCount,
      formData.organization,
      formData.phoneNumber,
      formData.specialRequests,
      formData.themeStyle,
      layoutSkipped,
      notePreview,
      estimatedTotal,
      pricing.depositAmount,
      pricing.furniturePackage,
      pricing.hallPackage,
      pricing.propsPackage,
      paymentMethod,
      onPaymentMethodChange,
      selectedEventType,
      selectedTimeRange,
      selectedVenueName,
    ],
  );
  const activePage = reviewPages[reviewPageIndex] ?? reviewPages[0];

  return (
    <div className="grid gap-2.5 md:grid-cols-2">
      <ReviewCard
        depositAmount={pricing.depositAmount}
        page={activePage}
        onEditStep={onEditStep}
      />
      <div className="relative h-52 overflow-hidden rounded-[var(--radius-sm)] border border-white/65 bg-white/50 shadow-[0_8px_20px_rgba(114,76,43,0.08)]">
        {selectedVenueBookingVideoSrc ? (
          <video
            aria-label="Venue event preview"
            className="absolute inset-0 size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={selectedVenueBookingVideoSrc} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(52,38,29,0.04)_0%,rgba(52,38,29,0.2)_100%)]" />
      </div>
    </div>
  );
}
