import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_TYPES } from "@/lib/constants/booking";

export function EventTypeShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {EVENT_TYPES.map((eventType) => (
        <Card key={eventType.id}>
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">{eventType.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>{eventType.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
