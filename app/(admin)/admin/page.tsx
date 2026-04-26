import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PlannerAssetManager } from "@/components/admin/planner-asset-manager";
import { VenueMediaManager } from "@/components/admin/venue-media-manager";
import { PageShell } from "@/components/shared/page-shell";
import { getAdminAccessRequests } from "@/lib/supabase/admin-access-requests";
import { getBookingAvailabilityRecords, getAdminBookings, getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";
import { getPlannerLibraryData } from "@/lib/supabase/planner-assets";
import { getVenuesFromSupabase } from "@/lib/supabase/venue-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [adminRequests, bookings, isAdmin, venues, availability, plannerLibrary] = await Promise.all([
    getAdminAccessRequests(),
    getAdminBookings(),
    getIsCurrentUserAdmin(),
    getVenuesFromSupabase(),
    getBookingAvailabilityRecords(),
    getPlannerLibraryData({ includeInactive: true }),
  ]);

  return (
    <PageShell className="space-y-8 pb-16 pt-8 md:pt-12">
      <AdminDashboard
        initialAdminRequests={adminRequests}
        initialAvailability={availability}
        initialBookings={bookings}
        isAdmin={isAdmin}
        plannerItems={plannerLibrary.items}
        plannerVariantsByItemId={plannerLibrary.variantsByItemId}
        venues={venues.map((venue) => ({
          name: venue.name,
          operatingHours: venue.operatingHours,
          slug: venue.slug,
        }))}
      />
      {isAdmin ? <PlannerAssetManager initialLibrary={plannerLibrary} /> : null}
      {isAdmin ? <VenueMediaManager venues={venues} /> : null}
    </PageShell>
  );
}
