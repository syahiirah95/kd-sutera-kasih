import Link from "next/link";
import { BrandButterflyMark } from "@/components/shared/app-logo";
import { PageShell } from "@/components/shared/page-shell";
import { APP_NAME } from "@/lib/constants/app";

const EXPLORE_LINKS = [
  { href: "/venue", label: "Venue Details" },
  { href: "/booking", label: "Book an Event" },
  { href: "/venue#gallery", label: "Gallery" },
  { href: "/account", label: "Account" },
] as const;

const EVENT_LINKS = [
  "Weddings & Engagements",
  "Corporate Seminars",
  "Private Functions",
  "Graduations",
] as const;

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#fffdf9]">
      <PageShell className="pb-4 pt-8 md:pb-5 md:pt-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr] lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandButterflyMark className="size-6 shrink-0 drop-shadow-[0_5px_10px_rgba(184,111,41,0.2)]" />
              <span className="font-display text-xl font-semibold text-foreground">
                {APP_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              A premier event space designed for unforgettable moments. Refined, warm, and exceptionally accommodating.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Explore
            </h2>
            <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              {EXPLORE_LINKS.map((link) => (
                <Link className="transition hover:text-foreground" href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Events
            </h2>
            <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              {EVENT_LINKS.map((eventType) => (
                <span key={eventType}>{eventType}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
              Contact
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>
                142 Persiaran Sereni
                <br />
                Shah Alam, Selangor
              </p>
              <a className="transition hover:text-foreground" href="mailto:hello@suterakasih.example">
                hello@suterakasih.example
              </a>
              <a className="transition hover:text-foreground" href="tel:+60138201142">
                +60 13-820 1142
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 {APP_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="transition hover:text-foreground" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="transition hover:text-foreground" href="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </PageShell>
    </footer>
  );
}
