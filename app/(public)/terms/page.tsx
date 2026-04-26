import Link from "next/link";
import { HeroImagePageBackground } from "@/components/shared/hero-image-page-background";
import { PageShell } from "@/components/shared/page-shell";
import { APP_NAME } from "@/lib/constants/app";

const TERMS_SECTIONS = [
  {
    title: "Booking Requests",
    body: "Submitting a request does not guarantee venue availability. The venue team will review your preferred date, time, guest count, event type, and setup notes before confirming next steps.",
  },
  {
    title: "Event Details",
    body: "You are responsible for providing accurate event information. Changes to date, time, guest count, layout, vendors, or special requests may require another review by the venue team.",
  },
  {
    title: "Payments and Confirmation",
    body: "Any deposit, package price, payment schedule, or refund arrangement must be confirmed directly with the venue team. Demo pricing shown in the app is for planning and request-preview purposes.",
  },
  {
    title: "Venue Use",
    body: "Events must follow venue policies, safety requirements, operating hours, vendor access rules, and any setup limits confirmed by the venue team before the event date.",
  },
] as const;

function LegalPill({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex" data-butterfly-anchor="legal-title">
      <div className="relative inline-flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.08)_100%)] shadow-[0_14px_30px_rgba(114,76,43,0.16),0_3px_10px_rgba(114,76,43,0.09)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,248,239,0.22)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(157,106,64,0.16)] backdrop-blur-xl"
        />
        <p className="relative inline-flex items-center overflow-hidden rounded-full border border-[#d49b6a]/45 bg-[linear-gradient(135deg,rgba(220,164,83,0.28)_0%,rgba(255,250,244,0.46)_42%,rgba(191,118,47,0.22)_100%)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9b5f20] shadow-[0_10px_26px_rgba(114,76,43,0.16),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.86)_45%,rgba(255,255,255,0)_100%)]"
          />
          {children}
        </p>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <HeroImagePageBackground>
      <PageShell className="pb-16 pt-10 md:pt-14">
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4 border-b border-border/70 pb-8">
            <LegalPill>Terms of Service</LegalPill>
            <h1
              className="inline-block font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl"
              data-butterfly-anchor="legal-page-title"
            >
              Terms for using {APP_NAME}.
            </h1>
            <p className="max-w-3xl text-justify text-base leading-8 text-muted-foreground">
              Effective April 24, 2026. These terms describe how booking requests, venue information, and event planning features should be used.
            </p>
          </header>

          <div className="grid gap-7">
            {TERMS_SECTIONS.map((section) => (
              <section className="space-y-2" key={section.title}>
                <h2 className="inline-block font-display text-2xl font-semibold text-foreground" data-butterfly-anchor="section">
                  {section.title}
                </h2>
                <p className="text-justify text-sm leading-7 text-muted-foreground md:text-base">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <section className="border-t border-border/70 pt-7">
            <h2 className="inline-block font-display text-2xl font-semibold text-foreground" data-butterfly-anchor="section">Questions</h2>
            <p className="mt-2 text-justify text-sm leading-7 text-muted-foreground md:text-base">
              Need clarification before submitting a booking request? Visit the{" "}
              <Link className="font-medium text-foreground transition hover:text-primary" href="/booking">
                booking page
              </Link>{" "}
              or contact us at{" "}
              <a className="font-medium text-foreground transition hover:text-primary" href="mailto:hello@suterakasih.example">
                hello@suterakasih.example
              </a>
              .
            </p>
          </section>
        </article>
      </PageShell>
    </HeroImagePageBackground>
  );
}
