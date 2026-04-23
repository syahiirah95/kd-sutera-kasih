import { ContextHelp } from "@/components/help/context-help";
import { VenueGallery } from "@/components/marketing/venue-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENUE_DETAILS } from "@/lib/data/venue";
import { BOOKING_TIME_SLOTS } from "@/lib/constants/booking";

export default function VenuePage() {
  return (
    <div className="page-shell space-y-10 pb-16 pt-8 md:pt-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Venue Details
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-6xl">
            {VENUE_DETAILS.name}
          </h1>
          <ContextHelp
            label="Venue details help"
            tooltip="This page helps users compare venue fit before they start booking."
            title="How to use this page"
            description="Review the venue overview, facilities, supported event types, and exact booking slots before starting your request."
          />
        </div>
        <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          {VENUE_DETAILS.description}
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Facilities and event support</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {VENUE_DETAILS.facilities.map((facility) => (
              <div
                key={facility}
                className="rounded-[var(--radius-md)] border border-border/60 bg-white/50 px-4 py-3 text-sm text-muted-foreground"
              >
                {facility}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policies and notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            {VENUE_DETAILS.policies.map((policy) => (
              <p key={policy}>{policy}</p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-semibold">Exact custom time slots</h2>
          <ContextHelp
            label="Time slot help"
            tooltip="Users choose exact start and end times, not vague sessions."
            title="Time slot selection"
            description="Choose from exact start and end times so your event planning is clear from the beginning."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {BOOKING_TIME_SLOTS.map((slot) => (
            <Card key={slot.id}>
              <CardHeader>
                <CardTitle className="text-lg">{slot.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {slot.startTime} - {slot.endTime}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">
          Hall gallery
        </h2>
        <VenueGallery />
      </section>
    </div>
  );
}
