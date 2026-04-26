"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingConfirmationStep } from "@/components/booking/booking-confirmation-step";
import { BookingContactDetailsStep } from "@/components/booking/booking-contact-details-step";
import { BookingEventDetailsStep } from "@/components/booking/booking-event-details-step";
import { BookingLayoutPreviewButton, BookingLayoutStep } from "@/components/booking/booking-layout-step";
import { BookingReviewStep } from "@/components/booking/booking-review-step";
import { BookingStepProgress } from "@/components/booking/booking-step-progress";
import { type BookingFormData } from "@/components/booking/booking-request-types";
import { type PlannerItem, type PlannerItemVariant } from "@/components/planner/planner-types";
import { BookingAvailabilityCalendar } from "@/components/shared/booking-availability-calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EVENT_TYPES } from "@/lib/constants/booking";
import { VENUES, type VenueRecord } from "@/lib/data/venues";
import { type BookingAvailabilityRecord } from "@/lib/supabase/booking-data";
import { formatTimeRange } from "@/lib/time";
import { cn } from "@/lib/utils";

const REQUEST_STEPS = [
  { description: "Event details", number: "1", title: "Event" },
  { description: "Contact details", number: "2", title: "Contact" },
  { description: "Layout notes", number: "3", title: "Layout" },
  { description: "Review and payment", number: "4", title: "Review" },
  { description: "Request received", number: "5", title: "Confirm" },
] as const;

const LAYOUT_STEP_INDEX = 2;
const REVIEW_STEP_INDEX = 3;
const CONFIRM_STEP_INDEX = 4;
const REVIEW_PAGE_COUNT = 5;

const STEP_INTROS = [
  {
    description: "Choose your hall, date, time, and estimated guest count.",
    title: "Event details",
  },
  {
    description: "Share the contact details our team should use for follow-up.",
    title: "Contact details",
  },
  {
    description: "Add setup notes and check the furniture and props reference.",
    title: "Layout preferences",
  },
  {
    description: "Please check your details, estimate, and mock deposit before submitting.",
    title: "Review your booking",
  },
  {
    description: "Your request has been recorded. Download your booking proof while our team reviews the details.",
    title: "Booking request received",
  },
] as const;

function getSuggestedDate() {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 30);
  return nextDate.toISOString().split("T")[0] ?? "";
}

function getInitialFormData(venueSlug: string): BookingFormData {
  return {
    contactEmail: "",
    contactName: "",
    endTime: "19:00",
    eventDate: getSuggestedDate(),
    eventType: EVENT_TYPES[0]?.id ?? "",
    guestCount: "80",
    organization: "",
    phoneNumber: "",
    specialRequests: "",
    startTime: "15:00",
    themeStyle: "",
    venueSlug,
    vendorNotes: "",
  };
}

const TODAY = new Date().toISOString().split("T")[0] ?? "";
const FORM_BACK_NAV_BUTTON_CLASS =
  "booking-form-nav-secondary !h-7 !w-24 !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !px-2 !text-[11px] !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#993a41]/80 hover:!bg-[linear-gradient(135deg,#d56a70_0%,#b84f58_56%,#e58b8f_100%)] hover:!text-white";
const FORM_AVAILABILITY_BUTTON_CLASS =
  "booking-form-nav-neutral !h-7 !w-28 !rounded-lg !border !border-[#5f8a65]/70 !bg-[linear-gradient(135deg,#7aa67c_0%,#5f8a65_56%,#a9cfaa_100%)] !px-3 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_6px_16px_rgba(95,138,101,0.18)] hover:!border-[#c8893e]/80 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";
const FORM_PRIMARY_NAV_BUTTON_CLASS =
  "booking-form-nav-primary !h-7 !w-24 !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-2 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)] disabled:!border-[#b8afa8]/55 disabled:!bg-[linear-gradient(135deg,#d7d2cc_0%,#b9b1aa_100%)] disabled:!text-[#6f665f] disabled:!opacity-100 disabled:!shadow-[0_5px_12px_rgba(80,72,64,0.12)]";

export function BookingRequestForm({
  availability,
  plannerItems,
  plannerVariantsByItemId,
  venues = VENUES,
  venueName,
  venueSlug,
}: Readonly<{
  availability: BookingAvailabilityRecord[];
  plannerItems: PlannerItem[];
  plannerVariantsByItemId: Record<string, PlannerItemVariant[]>;
  venues?: VenueRecord[];
  venueName: string;
  venueSlug: string;
}>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStepReached, setFurthestStepReached] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Online banking");
  const [submitError, setSubmitError] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [reviewPageIndex, setReviewPageIndex] = useState(0);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>(() => getInitialFormData(venueSlug));
  const venueOptions = venues.map((venue) => ({
    label: venue.name,
    slug: venue.slug,
    state: venue.state,
  }));
  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.slug === formData.venueSlug) ?? venues[0],
    [formData.venueSlug, venues],
  );

  const selectedEventType = useMemo(
    () => EVENT_TYPES.find((eventType) => eventType.id === formData.eventType)?.label ?? "Select an event type",
    [formData.eventType],
  );
  const unavailableDatesByVenue = useMemo(() => {
    const nextMap = new Map<string, Set<string>>();

    for (const booking of availability) {
      if (booking.status !== "pending" && booking.status !== "approved") {
        continue;
      }

      const currentDates = nextMap.get(booking.venueSlug) ?? new Set<string>();
      currentDates.add(booking.eventDate);
      nextMap.set(booking.venueSlug, currentDates);
    }

    return nextMap;
  }, [availability]);
  const selectedTimeRange = useMemo(
    () => formatTimeRange(formData.startTime, formData.endTime),
    [formData.endTime, formData.startTime],
  );
  const selectedVenueUnavailableDates = unavailableDatesByVenue.get(formData.venueSlug) ?? new Set<string>();
  const selectedDateUnavailable = selectedVenueUnavailableDates.has(formData.eventDate);
  const isConfirmStep = isSubmitted && currentStep === CONFIRM_STEP_INDEX;
  const isReviewReadyToSubmit = currentStep !== REVIEW_STEP_INDEX || reviewPageIndex === REVIEW_PAGE_COUNT - 1;
  const currentStepIntro = STEP_INTROS[currentStep] ?? STEP_INTROS[0];

  const timeRangeIsValid =
    Boolean(formData.startTime && formData.endTime) &&
    formData.endTime > formData.startTime;

  const isStepComplete = [
    Boolean(formData.venueSlug && formData.eventDate && formData.guestCount && formData.eventType && timeRangeIsValid && !selectedDateUnavailable),
    Boolean(formData.contactName && formData.phoneNumber && formData.contactEmail),
    true,
    true,
  ];
  const completedSteps = REQUEST_STEPS.map((_, index) => {
    if (isSubmitted) {
      return index <= CONFIRM_STEP_INDEX;
    }

    return index < CONFIRM_STEP_INDEX && index < furthestStepReached && Boolean(isStepComplete[index]);
  });
  const selectableSteps = REQUEST_STEPS.map((_, index) => {
    if (isSubmitted) {
      return index === CONFIRM_STEP_INDEX;
    }

    return index <= furthestStepReached;
  });

  const updateField = (field: keyof BookingFormData, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleStepSelect = (step: number) => {
    if (selectableSteps[step]) {
      setCurrentStep(step);
    }
  };

  const handleNextStep = async () => {
    if (!isStepComplete[currentStep]) {
      return;
    }

    if (currentStep === REVIEW_STEP_INDEX) {
      if (reviewPageIndex !== REVIEW_PAGE_COUNT - 1) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError("");

      try {
        const response = await fetch("/api/bookings", {
          body: JSON.stringify({
            ...formData,
            eventType: selectedEventType,
            paymentMethod,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const result = (await response.json().catch(() => null)) as {
          booking?: { reference?: string };
          error?: string;
        } | null;

        if (!response.ok) {
          setSubmitError(result?.error ?? "Unable to submit this booking request.");
          return;
        }

        setBookingReference(result?.booking?.reference ?? "");
        setIsSubmitted(true);
        setCurrentStep(CONFIRM_STEP_INDEX);
        setFurthestStepReached(CONFIRM_STEP_INDEX);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const nextStep = Math.min(currentStep + 1, REVIEW_STEP_INDEX);
    setCurrentStep(nextStep);
    setFurthestStepReached((reachedStep) => Math.max(reachedStep, nextStep));
  };

  const handlePreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleStartNewRequest = () => {
    setFormData(getInitialFormData(venueSlug));
    setCurrentStep(0);
    setFurthestStepReached(0);
    setPaymentMethod("Online banking");
    setReviewPageIndex(0);
    setBookingReference("");
    setSubmitError("");
    setIsSubmitted(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 lg:flex lg:h-full lg:flex-col lg:justify-center lg:space-y-4 xl:max-w-5xl">
      <div className="relative isolate space-y-1 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-3 -z-10 mx-auto h-28 max-w-3xl rounded-full bg-[radial-gradient(ellipse,rgba(255,250,244,0.82)_0%,rgba(255,246,236,0.58)_42%,rgba(255,246,236,0)_72%)] blur-sm"
        />
        <div className="flex justify-center">
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
              Reserve your date
            </p>
          </div>
        </div>
        <h1 className="font-display text-[2.2rem] font-bold leading-[0.96] text-[#1f1712] [text-shadow:0_1px_0_rgba(255,231,181,0.9),0_6px_18px_rgba(196,137,62,0.42)] md:text-[2.7rem] xl:text-[3.1rem]">
          {isSubmitted ? "Booking Request Sent" : "Book Sutera Kasih Hall"}
        </h1>
        <p className="mx-auto max-w-2xl text-sm font-medium text-[#1f1712] [text-shadow:0_1px_0_rgba(255,246,225,0.82),0_4px_14px_rgba(196,137,62,0.28)] md:text-base">
          {isSubmitted
            ? "Your request stays inside the booking flow for a clearer handoff."
            : "A few quick steps and our team will be in touch."}
        </p>
      </div>

      <div className="relative min-h-[27.5rem] overflow-visible rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,252,247,0.6)_100%)] p-5 shadow-[0_24px_54px_rgba(114,76,43,0.12),0_10px_22px_rgba(114,76,43,0.07)] ring-1 ring-[rgba(214,160,107,0.1)] backdrop-blur-[6px] md:p-6 lg:min-h-[28rem] lg:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_18%,rgba(255,255,255,0.92)_82%,rgba(255,255,255,0)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-0 h-10 rounded-full bg-[radial-gradient(circle,rgba(196,137,86,0.18)_0%,rgba(196,137,86,0)_72%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(214,160,107,0.08)]"
        />
        <div className="relative border-b border-[rgba(214,160,107,0.16)] pb-3">
          <BookingStepProgress
            completedSteps={completedSteps}
            currentStep={currentStep}
            selectableSteps={selectableSteps}
            steps={REQUEST_STEPS}
            onSelect={handleStepSelect}
          />
        </div>
        <div
          className={cn(
            "relative flex flex-col gap-2 pt-3",
            isConfirmStep
              ? "items-center pt-7 text-center"
              : "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="space-y-0.5">
            <h2 className="font-display text-xl font-semibold leading-tight text-foreground">
              {isConfirmStep ? (
                <span className="inline-flex flex-wrap items-center justify-center gap-2">
                  <span className="font-sans text-base font-normal leading-none text-[#8d542d]">
                    <span className="inline-block scale-x-[-1]">
                      ⸜(｡˃ ᵕ ˂ )⸝♡
                    </span>
                  </span>
                  <span>{currentStepIntro.title}</span>
                  <span className="font-sans text-base font-normal leading-none text-[#8d542d]">
                    ⸜(｡˃ ᵕ ˂ )⸝♡
                  </span>
                </span>
              ) : (
                currentStepIntro.title
              )}
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentStepIntro.description}
            </p>
            {isConfirmStep ? (
              <p className="text-xs font-semibold text-[#8d542d]">
                Contact {selectedVenue?.contactPhone} if anything looks off.
              </p>
            ) : null}
          </div>
          {!isSubmitted ? (
            <div className="flex items-center justify-end gap-2">
              {currentStep === LAYOUT_STEP_INDEX ? (
                <BookingLayoutPreviewButton
                  items={plannerItems}
                  variantsByItemId={plannerVariantsByItemId}
                />
              ) : null}
              {currentStep === REVIEW_STEP_INDEX ? (
                <div className="mr-1 flex items-center gap-1">
                  <button
                    aria-label="Previous review page"
                    className="inline-flex size-7 items-center justify-center border-0 bg-transparent p-0 text-[#8d542d] transition hover:text-[#5f3f2f] disabled:opacity-30"
                    disabled={reviewPageIndex === 0}
                    onClick={() => setReviewPageIndex((index) => Math.max(index - 1, 0))}
                    type="button"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <p className="min-w-9 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d542d]">
                    {reviewPageIndex + 1} / {REVIEW_PAGE_COUNT}
                  </p>
                  <button
                    aria-label="Next review page"
                    className="inline-flex size-7 items-center justify-center border-0 bg-transparent p-0 text-[#8d542d] transition hover:text-[#5f3f2f] disabled:opacity-30"
                    disabled={reviewPageIndex === REVIEW_PAGE_COUNT - 1}
                    onClick={() => setReviewPageIndex((index) => Math.min(index + 1, REVIEW_PAGE_COUNT - 1))}
                    type="button"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              ) : null}
              {currentStep > 0 ? (
                <Button
                  variant="secondary"
                  className={FORM_BACK_NAV_BUTTON_CLASS}
                  onClick={handlePreviousStep}
                >
                  Back
                </Button>
              ) : null}
              <Button
                className={FORM_AVAILABILITY_BUTTON_CLASS}
                onClick={() => setAvailabilityDialogOpen(true)}
                type="button"
                variant="secondary"
              >
                Availability
              </Button>
              <Button
                className={FORM_PRIMARY_NAV_BUTTON_CLASS}
                disabled={!isStepComplete[currentStep] || !isReviewReadyToSubmit || isSubmitting}
                onClick={handleNextStep}
              >
                {currentStep === REVIEW_STEP_INDEX ? (isSubmitting ? "Sending" : "Submit") : "Continue"}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="relative pt-4">
          {submitError ? (
            <p className="mb-3 rounded-[var(--radius-sm)] border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
              {submitError}
            </p>
          ) : null}
          {isSubmitted && currentStep === CONFIRM_STEP_INDEX ? (
            <BookingConfirmationStep
              bookingReference={bookingReference}
              formData={formData}
              selectedEventType={selectedEventType}
              selectedTimeRange={selectedTimeRange}
              selectedVenueBookingVideoSrc={selectedVenue?.bookingVideoSrc}
              selectedVenuePricing={selectedVenue?.pricing}
              selectedVenueContactPhone={selectedVenue?.contactPhone ?? ""}
              selectedVenueName={selectedVenue?.name ?? venueName}
              paymentMethod={paymentMethod}
              onStartNewRequest={handleStartNewRequest}
            />
          ) : null}

          {!isSubmitted && currentStep === 0 ? (
            <BookingEventDetailsStep
              formData={formData}
              selectedDateUnavailable={selectedDateUnavailable}
              selectedTimeRange={selectedTimeRange}
              timeRangeIsValid={timeRangeIsValid}
              today={TODAY}
              unavailableDateValues={selectedVenueUnavailableDates}
              updateField={updateField}
              venueOptions={venueOptions}
            />
          ) : null}

          {!isSubmitted && currentStep === 1 ? (
            <BookingContactDetailsStep
              formData={formData}
              updateField={updateField}
            />
          ) : null}

          {!isSubmitted && currentStep === LAYOUT_STEP_INDEX ? (
            <BookingLayoutStep
              formData={formData}
              items={plannerItems}
              updateField={updateField}
            />
          ) : null}

          {!isSubmitted && currentStep === REVIEW_STEP_INDEX ? (
            <BookingReviewStep
              formData={formData}
              layoutSkipped={false}
              paymentMethod={paymentMethod}
              selectedVenueBookingVideoSrc={selectedVenue?.bookingVideoSrc}
              selectedEventType={selectedEventType}
              selectedTimeRange={selectedTimeRange}
              selectedVenuePricing={selectedVenue?.pricing}
              selectedVenueName={selectedVenue?.name ?? venueName}
              reviewPageIndex={reviewPageIndex}
              onEditStep={setCurrentStep}
              onPaymentMethodChange={setPaymentMethod}
            />
          ) : null}
        </div>

      </div>

      <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
        <DialogContent className="booking-layout-preview-scroll max-h-[92dvh] w-[min(96vw,78rem)] overflow-y-auto rounded-[var(--radius-sm)] p-0">
          <DialogHeader className="border-b border-border/70 px-5 py-4">
            <DialogTitle>
              <span className="inline-flex items-center" data-butterfly-anchor="hall-availability-title">
                Hall Availability
              </span>
            </DialogTitle>
            <DialogDescription>
              For smooth event operations, dates that already carry a pending or approved booking are not available for new reservations for the same hall.
            </DialogDescription>
          </DialogHeader>
          <div className="p-5">
            <BookingAvailabilityCalendar
              bookings={availability}
              hideHeaderCopy
              initialVenueSlug={formData.venueSlug}
              reserveWholeDayOnBookedDate
              title="Hall Availability"
              venues={venues.map((venue) => ({
                name: venue.name,
                operatingHours: venue.operatingHours,
                slug: venue.slug,
              }))}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
