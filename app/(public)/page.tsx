import { BookingOverview } from "@/components/booking/booking-overview";
import { BookingFormPreview } from "@/components/booking/booking-form-preview";
import { EventTypeShowcase } from "@/components/marketing/event-type-showcase";
import { HeroSection } from "@/components/marketing/hero-section";
import { HighlightsGrid } from "@/components/marketing/highlights-grid";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { VenueCollection } from "@/components/marketing/venue-collection";
import { VenueGallery } from "@/components/marketing/venue-gallery";
import { VenueVideoShowcase } from "@/components/marketing/venue-video-showcase";
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
            title="A beautiful hall for weddings, celebrations, and meaningful gatherings."
            description="Discover the atmosphere, flexibility, and practical booking experience designed to help you plan your event at Dewan Sutera Kasih with confidence."
          />
          <HighlightsGrid />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Available Venues"
            title="Explore Sutera Kasih halls across different states."
            description="Browse the current collection of Sutera Kasih venues, compare the atmosphere, and choose the hall that matches your event style and location best."
          />
          <VenueCollection />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Booking Flow"
            title="A clear booking journey from first visit to request submission."
            description="Review venue information, choose your own event time range, share your event details, and send your booking request through a smooth, guided experience."
          />
          <BookingOverview />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Event Types"
            title="A flexible hall collection for weddings, graduations, and more."
            description="Each Sutera Kasih venue is designed to support different event types, so you can decide the style and scale that fits your celebration before you begin booking."
          />
          <EventTypeShowcase />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Gallery"
            title="Explore the look and feel of the Sutera Kasih collection."
            description="Browse the hall atmosphere, stage styling, reception setup, and venue character to help you imagine how your event can come to life in the space."
          />
          <VenueGallery />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Venue In Motion"
            title="See the hall atmosphere in motion before you book."
            description="A short venue preview helps you understand the lighting, scale, and overall mood of Dewan Sutera Kasih before submitting your request."
          />
          <VenueVideoShowcase />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Request Booking"
            title="Share your event details with a booking flow that feels clear and practical."
            description="The request form is structured to help you provide the details that matter most, from event type and custom event timing to contact information and setup notes."
          />
          <BookingFormPreview />
        </section>
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Testimonials"
            title="Hear how customers experienced Dewan Sutera Kasih."
            description="A trusted venue experience is built not only on visuals, but also on how smooth and reassuring the full booking journey feels."
          />
          <TestimonialsSection />
        </section>
      </PageShell>
    </div>
  );
}
