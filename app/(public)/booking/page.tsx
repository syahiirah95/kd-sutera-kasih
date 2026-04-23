import { BookingFormPreview } from "@/components/booking/booking-form-preview";
import { BookingOverview } from "@/components/booking/booking-overview";
import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

export default function BookingPage() {
  return (
    <PageShell className="space-y-8 pb-16 pt-8 md:pt-12">
      <div className="flex flex-wrap items-center gap-3">
        <SectionHeading
          eyebrow="Booking"
          title="Send your booking request for Dewan Sutera Kasih."
          description="Choose your event details, preferred time slot, and any important setup notes so the venue team can review your request smoothly."
        />
        <ContextHelp
          label="Booking flow help"
          tooltip="This flow will become the main request path for users."
          title="Booking flow"
          description="Complete your event details step by step, then review everything before sending your booking request."
        />
      </div>
      <BookingOverview />
      <BookingFormPreview />
    </PageShell>
  );
}
