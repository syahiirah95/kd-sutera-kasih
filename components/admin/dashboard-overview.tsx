import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";

const DASHBOARD_METRICS = [
  { label: "Pending bookings", value: "08" },
  { label: "Approved bookings", value: "14" },
  { label: "Rejected bookings", value: "03" },
];

const RECENT_BOOKINGS = [
  {
    event: "Wedding Reception",
    id: "KD-SK-2026-001",
    slot: "3:00 PM - 7:00 PM",
    status: "pending" as const,
  },
  {
    event: "Graduation Dinner",
    id: "KD-SK-2026-002",
    slot: "10:00 AM - 2:00 PM",
    status: "approved" as const,
  },
  {
    event: "Corporate Appreciation Night",
    id: "KD-SK-2026-003",
    slot: "8:00 PM - 11:00 PM",
    status: "rejected" as const,
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {DASHBOARD_METRICS.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-5xl font-semibold">
              {metric.value}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent booking requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RECENT_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border/60 bg-white/55 px-4 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{booking.event}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.id} | {booking.slot}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mock dashboard filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {["All", "Pending", "Approved", "Rejected", "With layout"].map((filter) => (
            <span
              key={filter}
              className={`rounded-full border px-4 py-2 text-sm ${
                filter === "Pending"
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border/70 bg-white/60 text-muted-foreground"
              }`}
            >
              {filter}
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
