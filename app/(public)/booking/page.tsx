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
          title="Planner-ready booking flow scaffold"
          description="This page is ready for the multi-step form implementation with exact slot selection, contextual help, and planner integration."
        />
        <ContextHelp
          label="Booking flow help"
          tooltip="This flow will become the main request path for users."
          title="Booking flow"
          description="The final implementation will include event basics, contact details, event notes, planner steps, validation, and a review screen before submission."
        />
      </div>
      <BookingOverview />
    </PageShell>
  );
}
