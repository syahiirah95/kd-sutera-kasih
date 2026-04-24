import { type ReactNode } from "react";
import {
  Accessibility,
  Car,
  DoorOpen,
  Music,
  Thermometer,
  UserCheck,
  Wifi,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { type VenueRecord } from "@/lib/data/venues";

const AMENITY_ICONS: LucideIcon[] = [
  Wine,
  Music,
  DoorOpen,
  Car,
  Accessibility,
  Thermometer,
  UserCheck,
  Wifi,
];

export function VenueStoryContent({
  gallery,
  venue,
}: Readonly<{
  gallery?: ReactNode;
  venue: VenueRecord;
}>) {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">About the Space</h2>
        <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          {venue.intro}
        </p>
        <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          {venue.description}
        </p>
      </section>
      {gallery}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">Amenities</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {venue.facilities.map((facility, index) => {
            const Icon = AMENITY_ICONS[index % AMENITY_ICONS.length];

            return (
              <div className="flex min-h-12 items-center gap-4" key={facility}>
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eee8e6] text-[#7d3f4a]">
                  <Icon className="size-5" />
                </span>
                <p className="text-sm font-semibold leading-6 text-[#241b16] md:text-base">
                  {facility}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
