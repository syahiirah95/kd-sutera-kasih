import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmationPage() {
  return (
    <PageShell className="pb-16 pt-8 md:pt-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="pending" />
            <ContextHelp
              label="Confirmation help"
              tooltip="Users should land here after a successful request submission."
              title="Booking confirmation"
              description="The final page will show the booking reference, selected venue, date, time slot, and the current pending status while the admin reviews the request."
            />
          </div>
          <CardTitle className="font-display text-4xl font-semibold">
            Your booking request has been staged for review.
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
          <p>Reference: KD-SK-2026-001</p>
          <p>Venue: Dewan Sutera Kasih</p>
          <p>Date: Saturday, May 30, 2026</p>
          <p>Time slot: 3:00 PM - 7:00 PM</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
