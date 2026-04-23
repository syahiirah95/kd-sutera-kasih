import { ContextHelp } from "@/components/help/context-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOKING_TIME_SLOTS, EVENT_TYPES } from "@/lib/constants/booking";

export function BookingOverview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle>Booking steps scaffold</CardTitle>
            <ContextHelp
              label="Booking steps help"
              tooltip="Hover for a quick explanation, click for more context."
              title="Booking steps"
              description="The final build will turn these cards into a multi-step flow with client and server validation, contextual help, and admin-ready booking summaries."
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            "Event basics",
            "Contact details",
            "Event notes",
            "Planner and layout",
            "Review and submit",
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
            <CardTitle>Exact slot selection preview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {BOOKING_TIME_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-4"
              >
                <p className="text-sm font-semibold text-foreground">{slot.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
