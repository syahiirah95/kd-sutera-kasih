import Image from "next/image";
import { getVenuePageData } from "@/lib/supabase/venue-data";

export async function HeroImagePageBackground({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeVenue: venue } = await getVenuePageData("sutera-kasih-cinta");

  return (
    <main className="relative isolate overflow-hidden">
      {venue.heroImageSrc ? (
        <Image
          fill
          priority
          alt=""
          aria-hidden="true"
          className="-z-30 object-cover opacity-60 saturate-[1.05]"
          sizes="100vw"
          src={venue.heroImageSrc}
          unoptimized
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(255,248,239,0.28)_0%,rgba(255,248,239,0.4)_42%,rgba(255,248,239,0.54)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,251,246,0.18)_0%,rgba(255,248,239,0.3)_38%,rgba(255,248,239,0.46)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-20px_48px_rgba(214,160,107,0.08)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-10 w-[min(100%,80rem)] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,248,239,0)_0%,rgba(255,248,239,0.34)_10%,rgba(255,248,239,0.4)_50%,rgba(255,248,239,0.34)_90%,rgba(255,248,239,0)_100%)]"
      />
      {children}
    </main>
  );
}
