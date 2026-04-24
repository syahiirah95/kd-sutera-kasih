import { CalendarRange, CircleUserRound, LayoutTemplate, NotebookPen } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES, OPERATING_HOURS, SUGGESTED_TIME_WINDOWS } from "@/lib/constants/booking";
import { formatTimeRange } from "@/lib/time";

const PREVIEW_STEPS = [
  {
    fields: ["Event type", "Event date", "Start time", "End time", "Estimated guests"],
    icon: CalendarRange,
    title: "Step 1: Event basics",
  },
  {
    fields: ["Contact name", "Email", "Phone number", "Organization"],
    icon: CircleUserRound,
    title: "Step 2: Contact details",
  },
  {
    fields: ["Theme / Style", "Vendor notes", "Special requests"],
    icon: NotebookPen,
    title: "Step 3: Event notes",
  },
  {
    fields: ["2D planner", "Adaptive 3D preview", "Layout options"],
    icon: LayoutTemplate,
    title: "Step 4: Layout",
  },
  {
    fields: ["Event summary", "Contact review", "Submission check"],
    icon: CircleUserRound,
    title: "Step 5: Review",
  },
] as const;

export function BookingFormPreview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle>Booking request details</CardTitle>
            <ContextHelp
              label="Booking form help"
              tooltip="Use this form to prepare the details needed for your booking request."
              title="Booking request form"
              description="Share your event details, preferred date, custom event time, and any important notes so the venue team can review your request properly."
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="event-type">Event type</Label>
              <Select id="event-type" defaultValue={EVENT_TYPES[0].id}>
                {EVENT_TYPES.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-date">Event date</Label>
              <Input id="event-date" type="date" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="preview-start-time">Start time</Label>
              <Input id="preview-start-time" min={OPERATING_HOURS.start} max={OPERATING_HOURS.end} type="time" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preview-end-time">End time</Label>
              <Input id="preview-end-time" min={OPERATING_HOURS.start} max={OPERATING_HOURS.end} type="time" />
            </div>
            <div className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Operating hours</p>
              <p className="mt-2">{OPERATING_HOURS.label}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Suggested booking windows</Label>
            <div className="grid gap-3 md:grid-cols-3">
              {SUGGESTED_TIME_WINDOWS.map((window, index) => (
                <div
                  key={window.label}
                  className={`rounded-[var(--radius-md)] border px-4 py-4 text-sm transition ${
                    index === 1
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/70 bg-white/60 text-muted-foreground"
                  }`}
                >
                  <p className="font-semibold">{window.label}</p>
                  <p className="mt-2">{formatTimeRange(window.startTime, window.endTime)}</p>
                  <p className="mt-3 leading-6">{window.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Special requests</Label>
            <Textarea
              id="notes"
              placeholder="Example: Warm stage lighting, additional registration table, and floral styling near the entrance."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Continue request</Button>
            <Button size="lg" variant="secondary">
              Save details
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {PREVIEW_STEPS.map((step) => (
          <Card key={step.title}>
            <CardContent className="flex gap-4">
              <div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <step.icon className="size-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {step.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border border-border/70 bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
