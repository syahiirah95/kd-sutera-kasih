import { AccountOverview } from "@/components/account/account-overview";
import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCurrentUser } from "@/lib/auth/server";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <PageShell className="space-y-8 pb-16 pt-8 md:pt-12">
      <div className="flex flex-wrap items-center gap-3">
        <SectionHeading
          eyebrow="Account"
          title="Account settings with provider-aware UX."
          description="Manage your account details, review your sign-in method, and keep your profile information clear and secure."
        />
        <ContextHelp
          label="Account help"
          tooltip="Password updates only apply to email/password accounts."
          title="Account settings"
          description="Email/password users should be able to change their password here. Google-auth users should instead see a clear note that their credentials are managed by Google."
        />
      </div>
      <AccountOverview user={user} />
    </PageShell>
  );
}
