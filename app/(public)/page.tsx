import { BookingOverview } from "@/components/booking/booking-overview";
import { HeroSection } from "@/components/marketing/hero-section";
import { HighlightsGrid } from "@/components/marketing/highlights-grid";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-16 pt-8 md:space-y-28 md:pt-12">
      <HeroSection />
      <PageShell className="space-y-12">
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Venue Highlights"
            title="A premium booking experience designed for weddings and beyond."
            description="The scaffold already separates public pages, admin routes, shared modules, and planner-ready components so we can build fast without messy refactors."
          />
          <HighlightsGrid />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Booking Flow"
            title="Core flow scaffolding is ready to expand."
            description="Custom time slots, contextual help, demo role switching, and account-management rules are already reflected in the code structure."
          />
          <BookingOverview />
        </section>
      </PageShell>
    </div>
  );
}
