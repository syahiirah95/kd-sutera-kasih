import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENUES } from "@/lib/data/venues";

export function VenueCollection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {VENUES.map((venue) => (
        <Card key={venue.slug} className="flex h-full flex-col">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {venue.state}
            </div>
            <CardTitle className="text-2xl">{venue.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-5">
            <div className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>{venue.description}</p>
              <p>Capacity: {venue.capacity}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asLink href={`/venue?venue=${venue.slug}`} size="lg" variant="secondary">
                View venue
              </Button>
              <Button asLink href={`/booking?venue=${venue.slug}`} size="lg">
                Book this hall
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
