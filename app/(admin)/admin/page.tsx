import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

export default function AdminPage() {
  return (
    <PageShell className="space-y-8 pb-16 pt-8 md:pt-12">
      <div className="flex flex-wrap items-center gap-3">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="A lightweight operations surface for booking review."
          description="This scaffold includes status badges, placeholder stats, and list sections so we can wire Supabase data next without rebuilding the layout."
        />
        <ContextHelp
          label="Admin help"
          tooltip="Judges can switch into admin view from the profile dropdown after login."
          title="Competition demo admin mode"
          description="The full build will expose the dashboard after authentication through the demo role switcher. This scaffold keeps the admin route ready while auth wiring comes next."
        />
      </div>
      <DashboardOverview />
    </PageShell>
  );
}
