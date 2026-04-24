import { PageShell } from "@/components/shared/page-shell";
import { APP_NAME } from "@/lib/constants/app";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect the details you provide when you browse venues or submit a booking request, including contact information, event date, guest count, selected venue, event notes, and layout preferences.",
  },
  {
    title: "How We Use Information",
    body: "Your information is used to review booking requests, contact you about availability, prepare venue setup recommendations, improve the booking experience, and support basic account or demo-mode functionality.",
  },
  {
    title: "Sharing and Storage",
    body: "We do not sell personal information. Booking details may be shared with venue staff or service providers only when needed to review, prepare, or support your event request.",
  },
  {
    title: "Your Choices",
    body: "You may request updates or corrections to your booking details by contacting us. If you no longer want us to keep a request, let us know and we will review deletion where practical and legally allowed.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <PageShell className="pb-16 pt-10 md:pt-14">
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4 border-b border-border/70 pb-8">
          <p
            className="inline-flex text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground"
            data-butterfly-anchor="legal-title"
          >
            Privacy Policy
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            How {APP_NAME} handles your booking information.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            Effective April 24, 2026. This policy explains what we collect, why we collect it, and how your information is used when you explore venues or submit a booking request.
          </p>
        </header>

        <div className="grid gap-7">
          {PRIVACY_SECTIONS.map((section) => (
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
          <h2 className="font-display text-2xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
            For privacy questions, contact us at{" "}
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
