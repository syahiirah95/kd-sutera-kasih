import { ArrowUpRight, Clock3, Layers3 } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACTION_ITEMS = [
  {
    details: "Wedding Reception | 3:00 PM - 7:00 PM | 450 guests",
    label: "Needs approval before slot lock",
    title: "KD-SK-2026-001",
  },
  {
    details: "Engagement Ceremony | 10:00 AM - 2:00 PM | 180 guests",
    label: "Planner layout attached",
    title: "KD-SK-2026-004",
  },
] as const;

export function AdminActivity() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle>Priority review queue</CardTitle>
            <ContextHelp
              label="Priority review help"
              tooltip="Admins should understand which bookings need attention first."
              title="Priority review queue"
              description="The final dashboard should surface the most urgent booking requests first, especially requests that may block future time-slot availability or need a quick admin decision."
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ACTION_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border/70 bg-white/55 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
                <StatusBadge status="pending">{item.label}</StatusBadge>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4" />
                  Awaiting admin action
                </span>
                <span className="inline-flex items-center gap-2">
                  <Layers3 className="size-4" />
                  Planner-ready request
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p className="inline-flex items-center gap-2 text-foreground">
            <ArrowUpRight className="size-4 text-primary" />
            Review booking details and attached layout summary.
          </p>
          <p className="inline-flex items-center gap-2 text-foreground">
            <ArrowUpRight className="size-4 text-primary" />
            Approve or reject with clear status messaging.
          </p>
          <p className="inline-flex items-center gap-2 text-foreground">
            <ArrowUpRight className="size-4 text-primary" />
            Keep the UI simple, legible, and much less decorative than public marketing pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
