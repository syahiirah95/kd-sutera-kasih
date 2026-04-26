import { HeroImagePageBackground } from "@/components/shared/hero-image-page-background";
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

export default function PrivacyPage() {
  return (
    <HeroImagePageBackground>
      <PageShell className="pb-16 pt-10 md:pt-14">
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4 border-b border-border/70 pb-8">
            <LegalPill>Privacy Policy</LegalPill>
            <h1
              className="inline-block font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl"
              data-butterfly-anchor="legal-page-title"
            >
              How {APP_NAME} handles your booking information.
            </h1>
            <p className="max-w-3xl text-justify text-base leading-8 text-muted-foreground">
              Effective April 24, 2026. This policy explains what we collect, why we collect it, and how your information is used when you explore venues or submit a booking request.
            </p>
          </header>

          <div className="grid gap-7">
            {PRIVACY_SECTIONS.map((section) => (
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
            <h2 className="inline-block font-display text-2xl font-semibold text-foreground" data-butterfly-anchor="section">Contact</h2>
            <p className="mt-2 text-justify text-sm leading-7 text-muted-foreground md:text-base">
              For privacy questions, contact us at{" "}
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
