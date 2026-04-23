import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { VENUE_GALLERY } from "@/lib/data/venue";

export function VenueGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {VENUE_GALLERY.map((image) => (
        <Card key={image.src} className="overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              fill
              alt={image.alt}
              className="object-cover transition duration-500 hover:scale-[1.03]"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              src={image.src}
            />
          </div>
          <CardContent className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {image.category}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">{image.alt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
