import { VenueGallery } from "@/components/marketing/venue-gallery";
import { PageShell } from "@/components/shared/page-shell";
import { VenueSelectorList } from "@/components/venue/venue-selector-list";
import { VenueStickyDetails } from "@/components/venue/venue-sticky-details";
import { VenueStoryContent } from "@/components/venue/venue-story-content";
import { getVenuePageData } from "@/lib/supabase/venue-data";

export const dynamic = "force-dynamic";

type VenuePageProps = {
  searchParams: Promise<{
    venue?: string;
  }>;
};

export default async function VenuePage({ searchParams }: VenuePageProps) {
  const params = await searchParams;
  const { activeVenue: venue, venues } = await getVenuePageData(params.venue);

  return (
    <>
      <VenueSelectorList activeVenue={venue} venues={venues} />

      <main className="bg-[linear-gradient(180deg,#fff8ef_0%,#fffaf4_48%,#fff8ef_100%)]">
        <PageShell className="space-y-8 pb-16 pt-8 md:pt-10">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="space-y-10">
              <VenueStoryContent
                gallery={(
                  <section className="space-y-5">
                    <h2 className="font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">Gallery</h2>
                    <VenueGallery images={venue.gallery} />
                  </section>
                )}
                venue={venue}
              />
            </div>
            <VenueStickyDetails venue={venue} />
          </section>
        </PageShell>
      </main>
    </>
  );
}
