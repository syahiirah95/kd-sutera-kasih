import { CalendarDays, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_SUMMARY } from "@/lib/constants/app";

export function HeroSection() {
  return (
    <section className="page-shell">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-br from-white/90 via-[#fff7ef] to-[#fdebd7] p-6 shadow-[0_28px_100px_rgba(128,86,54,0.16)] md:p-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Sutera Kasih Collection
          </p>
          <div className="space-y-4">
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.92] text-foreground md:text-7xl">
              A graceful venue booking experience for your most meaningful events.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {APP_SUMMARY}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asLink href="/booking" size="xl">
              Start booking
            </Button>
            <Button asLink href="/venue" size="xl" variant="secondary">
              Explore venue details
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                label: "Custom booking time",
              },
              {
                icon: Sparkles,
                label: "Elegant event atmosphere",
              },
              {
                icon: LayoutDashboard,
                label: "Simple request management",
              },
            ].map((item) => (
              <Card key={item.label} className="border-white/70 bg-white/70">
                <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="glass-panel border-white/60">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Why choose Sutera Kasih
              </p>
              <h2 className="font-display text-3xl font-semibold">
                Made for celebrations that deserve a beautiful setting
              </h2>
            </div>
            <div className="grid gap-3 text-sm leading-7 text-muted-foreground">
              <p>Comfortable hall setting for intimate and large-scale events</p>
              <p>Clear venue details, policies, and booking steps</p>
              <p>Custom event timing for better planning</p>
              <p>Beautiful visual presentation to help you picture the space</p>
              <p>Simple request flow with room for custom event notes</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-white/70 bg-white/75 p-5">
              <p className="text-sm leading-7 text-muted-foreground">
                From receptions and engagements to graduations and corporate gatherings, the Sutera Kasih collection is presented as a group of halls that feel refined, welcoming, and easy to book.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
