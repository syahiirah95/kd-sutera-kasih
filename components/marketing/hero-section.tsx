import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroTestimonyCarousel } from "@/components/marketing/hero-testimony-carousel";
import { APP_SUMMARY } from "@/lib/constants/app";
import { getVenuesFromSupabase } from "@/lib/supabase/venue-data";
import { cn } from "@/lib/utils";

const HOME_HERO_BUTTON_CLASS =
  "booking-form-nav-primary !h-10 !min-w-[8.75rem] !rounded-full !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-4 !text-sm !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";
const HOMEPAGE_FEATURED_VENUE_SLUG = "sutera-kasih-cinta";

export async function HeroSection() {
  const venues = await getVenuesFromSupabase();
  const activeVenue = venues.find((venue) => venue.slug === HOMEPAGE_FEATURED_VENUE_SLUG) ?? venues[0];

  if (!activeVenue) {
    return null;
  }

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/55 shadow-[0_18px_44px_rgba(114,76,43,0.12)]">
      {activeVenue.heroImageSrc ? (
        <Image
          fill
          priority
          alt={`${activeVenue.name} venue atmosphere`}
          className="object-cover"
          sizes="100vw"
          src={activeVenue.heroImageSrc}
          unoptimized
        />
      ) : activeVenue.bookingVideoSrc ? (
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={activeVenue.bookingVideoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,247,237,0.96)_0%,rgba(255,247,237,0.88)_34%,rgba(255,247,237,0.44)_66%,rgba(52,38,29,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,246,225,0.72)_0%,rgba(255,246,225,0)_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-[min(100%,84rem)] items-center px-4 py-8 md:px-6 md:py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_31rem] lg:items-center xl:grid-cols-[minmax(0,1fr)_34rem]">
          <div className="flex min-h-[calc(100vh-9rem)] flex-col justify-center">
            <div className="max-w-3xl space-y-5">
              <p className="inline-flex rounded-full border border-[#d49b6a]/55 bg-[linear-gradient(135deg,rgba(220,164,83,0.34)_0%,rgba(255,250,244,0.58)_100%)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8d542d] shadow-[0_10px_26px_rgba(114,76,43,0.14)]">
                Sutera Kasih Collection
              </p>
              <div className="space-y-3">
                <h1 className="inline-block font-display text-[2.4rem] font-bold leading-[0.96] text-[#1f1712] [text-shadow:0_1px_0_rgba(255,231,181,0.9),0_6px_18px_rgba(196,137,62,0.32)] md:text-[3.4rem] xl:text-[3.9rem]">
                  Sutera Kasih Hall
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#5f3f2f] md:text-base">
                  {APP_SUMMARY}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  asLink
                  className={cn(HOME_HERO_BUTTON_CLASS, "!items-center !justify-center !py-0 text-center")}
                  href={`/booking?venue=${activeVenue.slug}`}
                  size="default"
                >
                  <span className="relative z-10 inline-flex h-full items-center leading-none">
                    Book now
                  </span>
                </Button>
                <Button
                  asLink
                  className={cn(HOME_HERO_BUTTON_CLASS, "!items-center !justify-center !py-0 text-center")}
                  href="/venue"
                  size="default"
                >
                  <span className="relative z-10 inline-flex h-full items-center leading-none">
                    View venues
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col justify-center self-center">
            <HeroTestimonyCarousel
              venueName={activeVenue.name}
              videos={activeVenue.testimonyVideos ?? []}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
