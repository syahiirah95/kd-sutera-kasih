import { PlayCircle, Sparkles } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENUE_VIDEO_NOTES } from "@/lib/data/venue";

export function VenueVideoShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden border-white/80 bg-[#fff8f2]">
        <div className="relative aspect-video overflow-hidden">
          <video
            autoPlay
            className="size-full object-cover"
            controls
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/api/media/venue-video" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2f2119]/75 to-transparent px-5 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Real Venue Preview
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold">
              Dewan atmosphere, lighting, and space flow in motion.
            </h3>
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
              <PlayCircle className="size-5" />
            </div>
            <div className="flex items-center gap-3">
              <CardTitle>Why this video matters</CardTitle>
              <ContextHelp
                label="Venue video help"
                tooltip="Video can help users understand the venue mood faster than still images."
                title="Venue video showcase"
                description="This section highlights the hall atmosphere before you submit a booking request, so you can better imagine your event in the space."
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {VENUE_VIDEO_NOTES.map((note) => (
            <div
              key={note}
              className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-4 text-sm leading-7 text-muted-foreground"
            >
              {note}
            </div>
          ))}
          <div className="rounded-[var(--radius-md)] border border-primary/20 bg-primary/10 px-4 py-4 text-sm leading-7 text-foreground">
            <span className="inline-flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-primary" />
              Venue experience
            </span>
            <p className="mt-2 text-muted-foreground">
              A short venue film helps guests understand the character of Dewan Sutera Kasih before they move into hall details, event-time selection, and booking submission.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
