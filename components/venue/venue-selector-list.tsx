import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import birthdayHero from "@/assets/event-gallery/birthday.png";
import corporateHero from "@/assets/event-gallery/corporate.png";
import engagementHero from "@/assets/event-gallery/engagement.png";
import graduationHero from "@/assets/event-gallery/graduation.png";
import weddingHero from "@/assets/event-gallery/wedding.png";
import { Button } from "@/components/ui/button";
import { VENUES, type VenueRecord } from "@/lib/data/venues";
import { cn } from "@/lib/utils";

const VENUE_SELECTOR_BUTTON_CLASS =
  "booking-form-nav-primary !h-7 !w-24 !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-2 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";

const VENUE_HERO_IMAGES: Record<string, StaticImageData> = {
  "sutera-kasih-anggun": weddingHero,
  "sutera-kasih-bahagia": graduationHero,
  "sutera-kasih-cinta": engagementHero,
  "sutera-kasih-pesona": corporateHero,
  "sutera-kasih-rindu": birthdayHero,
};

const VENUE_BADGES: Record<string, string> = {
  "sutera-kasih-anggun": "Romantic Venue",
  "sutera-kasih-bahagia": "Classic Venue",
  "sutera-kasih-cinta": "Premier Venue",
  "sutera-kasih-pesona": "Grand Venue",
  "sutera-kasih-rindu": "Intimate Venue",
};

export function VenueSelectorList({
  activeVenue,
}: Readonly<{
  activeVenue: VenueRecord;
}>) {
  const heroImage = VENUE_HERO_IMAGES[activeVenue.slug] ?? weddingHero;
  const venueBadge = VENUE_BADGES[activeVenue.slug] ?? "Featured Venue";

  return (
    <section className="relative isolate min-h-[30rem] overflow-hidden border-b border-white/55 shadow-[0_18px_44px_rgba(114,76,43,0.12)]">
      <Image
        fill
        priority
        alt={`${activeVenue.name} venue atmosphere`}
        className="object-cover"
        sizes="100vw"
        src={heroImage}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,247,237,0.94)_0%,rgba(255,247,237,0.78)_38%,rgba(255,247,237,0.34)_72%,rgba(52,38,29,0.1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,246,225,0.72)_0%,rgba(255,246,225,0)_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[30rem] w-[min(100%,80rem)] flex-col justify-center px-4 pb-24 pt-10 md:px-6">
        <div className="max-w-3xl space-y-4">
          <p className="inline-flex rounded-full border border-[#d49b6a]/55 bg-[linear-gradient(135deg,rgba(220,164,83,0.34)_0%,rgba(255,250,244,0.58)_100%)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8d542d] shadow-[0_10px_26px_rgba(114,76,43,0.14)]">
            {venueBadge}
          </p>
          <div>
            <h1
              className="inline-block font-display text-[2.2rem] font-bold leading-[0.96] text-[#1f1712] [text-shadow:0_1px_0_rgba(255,231,181,0.9),0_6px_18px_rgba(196,137,62,0.32)] md:text-[2.9rem] xl:text-[3.25rem]"
              data-butterfly-anchor="venue-title"
            >
              {activeVenue.name}
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#5f3f2f] md:min-h-[5.25rem] md:text-base">
            {activeVenue.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#6f5648]">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" />
              {activeVenue.state}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="size-3.5 text-primary" />
              {activeVenue.capacity}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              asLink
              className={cn(VENUE_SELECTOR_BUTTON_CLASS, "!items-center !justify-center !py-0 text-center")}
              href={`/booking?venue=${activeVenue.slug}`}
              size="default"
            >
              <span className="relative z-10 inline-flex h-full items-center leading-none">
                Book now
              </span>
            </Button>
          </div>
        </div>
      </div>

      <nav
        aria-label="Venue hero slides"
        className="absolute inset-x-0 bottom-5 z-20 px-4 md:bottom-7"
      >
        <div className="mx-auto flex w-[min(100%,80rem)] justify-center md:px-6">
          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/58 px-3 py-2 shadow-[0_14px_34px_rgba(114,76,43,0.14)] backdrop-blur-xl">
            {VENUES.map((venue, index) => {
              const isActive = venue.slug === activeVenue.slug;

              return (
                <Link
                  key={venue.slug}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`View ${venue.name}`}
                  className={cn(
                    "block size-2.5 rounded-full border border-[#c8893e]/35 bg-[#d7a36f]/42 transition hover:scale-110 hover:bg-[#c8893e]",
                    isActive &&
                      "border-[#b9712f] bg-[#dca453] shadow-[0_6px_16px_rgba(184,111,41,0.32)]",
                  )}
                  href={`/venue?venue=${venue.slug}`}
                >
                  <span className="sr-only">
                    {index + 1} of {VENUES.length}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </section>
  );
}
