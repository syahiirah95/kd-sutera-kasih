import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageShell } from "@/components/shared/page-shell";

export default function AdminPage() {
  return (
    <PageShell className="pb-16 pt-8 md:pt-12">
      <AdminDashboard />
    </PageShell>
  );
}
