import { AccountOverview } from "@/components/account/account-overview";
import { PageShell } from "@/components/shared/page-shell";
import { getCurrentUser } from "@/lib/auth/server";
import { getVenuesFromSupabase } from "@/lib/supabase/venue-data";
import { getBookingAvailabilityRecords, getUserBookings } from "@/lib/supabase/booking-data";
import { getPlannerLibraryData } from "@/lib/supabase/planner-assets";

export default async function AccountPage() {
  const [user, bookings, availability, venues, plannerLibrary] = await Promise.all([
    getCurrentUser(),
    getUserBookings(),
    getBookingAvailabilityRecords(),
    getVenuesFromSupabase(),
    getPlannerLibraryData(),
  ]);

  if (!user) {
    return null;
  }

  return (
    <main className="bg-[linear-gradient(180deg,#fff8ef_0%,#fffaf4_48%,#fff8ef_100%)]">
      <PageShell className="pb-16 pt-8 md:pt-10">
        <AccountOverview
          availability={availability}
          bookings={bookings}
          plannerItems={plannerLibrary.items}
          plannerVariantsByItemId={plannerLibrary.variantsByItemId}
          venues={venues.map((venue) => ({
            name: venue.name,
            operatingHours: venue.operatingHours,
            slug: venue.slug,
          }))}
        />
      </PageShell>
    </main>
  );
}
