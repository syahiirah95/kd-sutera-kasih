import Link from "next/link";
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

export default function TermsPage() {
  return (
    <PageShell className="pb-16 pt-10 md:pt-14">
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4 border-b border-border/70 pb-8">
          <p
            className="inline-flex text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground"
            data-butterfly-anchor="legal-title"
          >
            Terms of Service
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Terms for using {APP_NAME}.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            Effective April 24, 2026. These terms describe how booking requests, venue information, and event planning features should be used.
          </p>
        </header>

        <div className="grid gap-7">
          {TERMS_SECTIONS.map((section) => (
            <section className="space-y-2" key={section.title}>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <section className="border-t border-border/70 pt-7">
          <h2 className="font-display text-2xl font-semibold text-foreground">Questions</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
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
  );
}
