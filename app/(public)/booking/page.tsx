import { BookingRequestForm } from "@/components/booking/booking-request-form";
import { PageShell } from "@/components/shared/page-shell";
import { getVenueBySlug } from "@/lib/data/venues";

type BookingPageProps = {
  searchParams: Promise<{
    venue?: string;
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const venue = getVenueBySlug(params.venue);

  return (
    <PageShell className="relative isolate !w-full max-w-none overflow-hidden pb-6 pt-5 md:pt-6 lg:h-[calc(100dvh-4rem-1px)] lg:overflow-hidden lg:px-6 lg:pb-4 lg:pt-4 xl:px-8">
      <div className="absolute inset-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
        <video
          autoPlay
          className="h-full w-full scale-[1.02] object-cover opacity-60 saturate-[1.05]"
          loop
          muted
          playsInline
        >
          <source src="/api/media/venue-video" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,248,239,0.03)_0%,rgba(255,248,239,0.08)_42%,rgba(255,248,239,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,246,0.03)_0%,rgba(255,248,239,0.06)_38%,rgba(255,248,239,0.1)_100%)]" />
        <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-20px_48px_rgba(214,160,107,0.03)]" />
      </div>
      <BookingRequestForm venueName={venue.name} venueSlug={venue.slug} />
    </PageShell>
  );
}
