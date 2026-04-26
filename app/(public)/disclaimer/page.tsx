import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { HeroImagePageBackground } from "@/components/shared/hero-image-page-background";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENUES } from "@/lib/data/venues";

const ABOUT_TEXT =
  "Build a responsive web app for a hall, venue, or event space booking system. No payment integration is required. Design and build a responsive hall or venue booking web app that feels practical, polished, and realistic. Users should be able to browse a venue, view important details, choose a date or time slot, and submit a booking request. Admins should be able to log in, review incoming bookings, and manage them through a simple dashboard. No direct payment integration is required for this bounty. Focus on the booking flow, responsiveness, usability, and overall polish.";

const BOUNTY_REQUIREMENTS = [
  "Create a responsive landing page for the venue",
  "Create a venue details page with key information",
  "Include a booking request form",
  "Allow users to select a date and time slot",
  "Add a booking confirmation page",
  "Create an admin login page",
  "Create an admin dashboard to manage bookings",
  "Support booking statuses such as pending, approved, and rejected",
  "Add proper form validation",
  "Make the overall experience clean and user-friendly",
] as const;

const TECH_STACK = [
  "Next.js 16 App Router",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Supabase Auth, Database, and Storage",
  "React Hook Form",
  "Zod validation",
  "Radix UI primitives",
  "Lucide React icons",
  "React Three Fiber, Drei, and Three.js",
  "Cloudflare Turnstile-ready auth widget",
] as const;

const IMPLEMENTATION_SECTIONS = [
  {
    title: "Public venue experience",
    items: [
      "Responsive landing page with venue positioning, highlights, gallery, event categories, and call-to-action paths.",
      "Venue details page with selectable venue hero images, venue copy, capacity, location, gallery, operating hours, policies, facilities, and package pricing.",
      "Venue media is connected to Supabase Storage so hero images, gallery images, and booking videos can be managed outside the codebase.",
    ],
  },
  {
    title: "Booking flow",
    items: [
      "Step-by-step booking request form for event details, contact details, layout planning, special requests, and review.",
      "Custom date and start/end time selection instead of a fixed payment or checkout flow.",
      "Booking confirmation state after submission, including generated booking reference and pending review messaging.",
      "My Bookings page for customers to review submitted requests, booking status, deposit status, full payment status, and estimated total.",
    ],
  },
  {
    title: "Planner and preview",
    items: [
      "Interactive 2D layout planner with furniture and decor placement tools.",
      "Adaptive 3D preview using React Three Fiber and Three.js for capable devices.",
      "Planner asset API route for local 3D model delivery while venue media remains in Supabase Storage.",
    ],
  },
  {
    title: "Admin workflow",
    items: [
      "Admin login route and profile-menu admin access flow.",
      "Admin dashboard for reviewing incoming booking requests.",
      "Admin status management for pending, approved, and rejected bookings.",
      "Payment summary controls for not paid, pending, and paid states without direct payment integration.",
      "Venue media manager for updating hero images, gallery images, booking videos, and venue details through Supabase.",
    ],
  },
  {
    title: "Account, auth, and policy pages",
    items: [
      "Supabase authentication helpers for server and browser usage.",
      "User account settings page with provider-aware password guidance.",
      "Privacy Policy, Terms of Service, and Disclaimer pages.",
      "Demo mode support for switching between user and admin-facing demo views.",
    ],
  },
] as const;

export default function DisclaimerPage() {
  return (
    <HeroImagePageBackground>
      <PageShell className="space-y-8 pb-16 pt-10 md:pt-14">
        <header className="space-y-4">
          <div className="flex">
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
                Disclaimer
              </p>
            </div>
          </div>
          <h1
            className="inline-block font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl"
            data-butterfly-anchor="disclaimer-title"
          >
            Sutera Kasih Hall.
          </h1>
          <p className="text-justify text-base leading-8 text-muted-foreground md:text-lg">
            This website was built for the <strong className="font-semibold text-foreground">Bounty Challenge Kracked Devs</strong> as a responsive hall, venue, and event space booking web app demo. It focuses on the booking journey, venue discovery, admin review workflow, responsive usability, and polished implementation without direct payment integration.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="inline-block font-display text-3xl font-semibold text-foreground" data-butterfly-anchor="section">Bounty Detail</h2>
                <ContextHelp
                  label="Bounty detail help"
                  tooltip="What the bounty table includes."
                  title="Bounty Detail"
                  description="This section records the original Kracked Devs challenge details, including the brief, deadline, reward, about text, and requirements."
                />
              </div>
              <p className="text-justify text-sm leading-7 text-muted-foreground md:text-base">
                Core bounty information, timing, reward, scope, and requirement list from the Kracked Devs challenge brief.
              </p>
            </div>
            <a
              className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#4f8f5d]/60 bg-[linear-gradient(135deg,#6fa36d_0%,#3f7f4b_54%,#8fbd78_100%)] py-1 pl-1 pr-3 text-xs font-bold !text-white shadow-[0_8px_22px_rgba(79,143,93,0.24)] backdrop-blur-xl transition hover:scale-[1.03] hover:border-[#c8893e]/55 hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white hover:shadow-[0_8px_20px_rgba(184,111,41,0.22)]"
              href="https://krackeddevs.com/"
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-white/65 bg-white/86">
                <Image
                  alt="Kracked Devs logo"
                  className="object-contain"
                  height={18}
                  src="/brandlogo/kdlogodev-export.png"
                  width={18}
                />
              </span>
              <span className="!text-white">Kracked Devs</span>
            </a>
          </div>
          <Card className="rounded-[var(--radius-sm)] border-white/75 bg-white/72 shadow-[0_18px_46px_rgba(114,76,43,0.16)]">
            <div className="overflow-hidden rounded-t-[var(--radius-sm)]">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-left text-sm leading-6">
                <thead>
                  <tr className="border-b border-[#d49b6a]/35 bg-[linear-gradient(135deg,rgba(220,164,83,0.28)_0%,rgba(255,250,244,0.46)_42%,rgba(191,118,47,0.22)_100%)] text-xs uppercase tracking-[0.18em] text-[#9b5f20] shadow-[0_10px_26px_rgba(114,76,43,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
                    <th className="w-48 px-5 py-3 font-bold text-[#9b5f20] [text-shadow:0_1px_0_rgba(255,255,255,0.72)] first:rounded-tl-[var(--radius-sm)]">Info</th>
                    <th className="px-5 py-3 font-bold text-[#9b5f20] [text-shadow:0_1px_0_rgba(255,255,255,0.72)] last:rounded-tr-[var(--radius-sm)]">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground">
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Bounty title</td>
                    <td className="px-5 py-3 text-justify align-top">BUILD A HALL / VENUE BOOKING WEB APP</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Bounty brief</td>
                    <td className="px-5 py-3 text-justify align-top">build a responsive web app for a hall, venue, or event space booking system.</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Payment note</td>
                    <td className="px-5 py-3 text-justify align-top">no payment integration is required.</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Difficulty</td>
                    <td className="px-5 py-3 text-justify align-top">INTERMEDIATE</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Deadline</td>
                    <td className="px-5 py-3 text-justify align-top">
                      SUNDAY
                      <br />
                      26 APRIL 2026
                      <br />
                      1:00 PM MYT
                    </td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Reward</td>
                    <td className="px-5 py-3 text-justify align-top">RM500</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">About</td>
                    <td className="px-5 py-3 text-justify align-top">{ABOUT_TEXT}</td>
                  </tr>
                  <tr className="cursor-pointer transition hover:bg-primary/10">
                    <td className="px-5 py-3 align-top font-semibold text-foreground">Requirements</td>
                    <td className="px-5 py-3 text-justify align-top">
                      <ol className="list-decimal space-y-1 pl-5">
                        {BOUNTY_REQUIREMENTS.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="inline-block font-display text-3xl font-semibold text-foreground" data-butterfly-anchor="section">Tech Stack</h2>
              <ContextHelp
                label="Tech stack help"
                tooltip="What technology is used in this app."
                title="Tech Stack"
                description="This section lists the frameworks, services, validation tools, UI primitives, and 3D libraries used to build the Sutera Kasih Hall booking demo."
              />
            </div>
            <p className="text-justify text-sm leading-7 text-muted-foreground md:text-base">
              The main tools and libraries used to build the customer booking experience, admin workflow, Supabase integration, validation, and 3D planner preview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((item) => (
              <span
                className="cursor-pointer rounded-[var(--radius-sm)] border border-primary/35 bg-white/55 px-3 py-1.5 text-sm font-medium text-foreground shadow-[0_8px_18px_rgba(114,76,43,0.08)] backdrop-blur-md transition hover:scale-[1.03] hover:border-[#c8893e]/55 hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:text-white hover:shadow-[0_8px_20px_rgba(184,111,41,0.22)]"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="inline-block font-display text-3xl font-semibold text-foreground" data-butterfly-anchor="section">Venues</h2>
              <ContextHelp
                label="Venues help"
                tooltip="What venues are included."
                title="Venues"
                description="This section summarizes the Sutera Kasih venue records available in the demo, including different hall names, states, capacities, and venue descriptions."
              />
            </div>
            <p className="text-justify text-sm leading-7 text-muted-foreground md:text-base">
              The demo includes multiple Sutera Kasih venues so users can browse different hall styles, capacities, states, package pricing, and policy notes before submitting a booking request.
            </p>
          </div>
          <Card className="rounded-[var(--radius-sm)]">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Venues in this app</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0 text-sm leading-7 text-muted-foreground">
              {VENUES.map((venue) => (
                <section className="cursor-pointer px-5 py-3 transition hover:bg-primary/10" key={venue.slug}>
                  <h2 className="font-display text-xl font-semibold text-foreground">{venue.name}</h2>
                  <p className="text-justify">{venue.description}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {venue.state} | {venue.capacity}
                  </p>
                </section>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="inline-block font-display text-3xl font-semibold text-foreground" data-butterfly-anchor="section">Implemented App Section</h2>
              <ContextHelp
                label="Implemented app section help"
                tooltip="What implementation areas are documented."
                title="Implemented App Section"
                description="This section groups the completed app work into customer-facing venue pages, booking flow, planner and preview tools, admin workflow, and account or policy pages."
              />
            </div>
            <p className="text-justify text-sm leading-7 text-muted-foreground md:text-base">
              The app implementation is organized around the bounty requirements and expands them into customer, admin, media, account, and planner workflows.
            </p>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-sm)] border border-white/75 bg-white/72 shadow-[0_18px_46px_rgba(114,76,43,0.16)]">
            {IMPLEMENTATION_SECTIONS.map((section) => (
              <Card
                className="rounded-none border-x-0 border-t-0 border-white/0 bg-transparent shadow-none last:border-b-0"
                key={section.title}
              >
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-border/60 px-5 py-3 transition hover:bg-primary/10">
                    <span className="font-display text-2xl font-semibold text-foreground">{section.title}</span>
                    <ChevronDown className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                  </summary>
                  <CardContent className="border-b border-border/60 py-3">
                    <ul className="list-disc space-y-1 pl-5 text-justify text-sm leading-6 text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </details>
              </Card>
            ))}
          </div>
        </section>
      </PageShell>
    </HeroImagePageBackground>
  );
}
