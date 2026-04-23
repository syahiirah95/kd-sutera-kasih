import { AdminActivity } from "@/components/admin/admin-activity";
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
          description="Review incoming booking requests, track current statuses, and manage decisions with a simple, practical dashboard."
        />
        <ContextHelp
          label="Admin help"
          tooltip="The admin dashboard is used to review and manage venue booking requests."
          title="Admin dashboard"
          description="Use this area to review booking details, check availability context, and approve or reject requests clearly."
        />
      </div>
      <DashboardOverview />
      <AdminActivity />
    </PageShell>
  );
}
