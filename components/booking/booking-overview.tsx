import { ContextHelp } from "@/components/help/context-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_TYPES, SUGGESTED_TIME_WINDOWS } from "@/lib/constants/booking";
import { BOOKING_EXPERIENCE_NOTES } from "@/lib/data/venue";
import { formatTimeRange } from "@/lib/time";

export function BookingOverview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle>Booking steps</CardTitle>
            <ContextHelp
              label="Booking steps help"
              tooltip="Hover for a quick explanation, click for more context."
              title="Booking steps"
              description="Follow these steps to share your event details, choose a suitable time range, include any setup requests, and send your booking request for review."
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            "Event basics",
            "Contact details",
            "Event notes",
            "Planner and layout",
            "Review and confirmation",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-[var(--radius-md)] border border-border/70 bg-white/55 px-4 py-4 text-sm text-muted-foreground"
            >
              <span className="mr-3 font-semibold text-foreground">0{index + 1}</span>
              {step}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supported event types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {EVENT_TYPES.map((eventType) => (
              <span
                key={eventType.id}
                className="rounded-full border border-border/70 bg-white/60 px-4 py-2 text-sm text-muted-foreground"
              >
                {eventType.label}
              </span>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What to expect from the booking process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BOOKING_EXPERIENCE_NOTES.map((note) => (
              <div
                key={note}
                className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-3 text-sm text-muted-foreground"
              >
                {note}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suggested booking windows</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {SUGGESTED_TIME_WINDOWS.map((window) => (
              <div
                key={window.label}
                className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-4"
              >
                <p className="text-sm font-semibold text-foreground">{window.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatTimeRange(window.startTime, window.endTime)}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {window.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
