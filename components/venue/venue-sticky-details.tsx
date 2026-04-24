import { Clock3, Mail, MapPinned, MapPin, Phone, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type VenueRecord } from "@/lib/data/venues";

export function VenueStickyDetails({
  venue,
}: Readonly<{
  venue: VenueRecord;
}>) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`;

  return (
    <Card className="rounded-[var(--radius-sm)] lg:sticky lg:top-28">
      <CardHeader className="px-5 pb-0 pt-5">
        <CardTitle className="font-display text-[1.8rem] leading-tight md:text-[2rem]">Venue Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5 pt-4 text-sm leading-6 text-muted-foreground">
        <div className="space-y-4">
          <div className="flex gap-3">
            <MapPin className="mt-1 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">Address</p>
              <p>{venue.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="mt-1 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Capacity</p>
              <p>{venue.capacity}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock3 className="mt-1 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Operating Hours</p>
              <p>{venue.operatingHours}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-3 font-semibold text-foreground">
              <MapPinned className="size-4 shrink-0 text-primary" />
              Location Map
            </p>
            <iframe
              className="h-44 w-full rounded-[var(--radius-sm)] border border-border/70"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
              title={`${venue.name} location map`}
            />
          </div>
        </div>
        <div className="space-y-2.5 border-t border-border/70 pt-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 break-words">{venue.contactEmail}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-primary" />
            <span>{venue.contactPhone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
