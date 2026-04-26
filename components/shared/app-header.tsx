import Link from "next/link";
import { AuthDialogLinks } from "@/components/auth/auth-dialog-links";
import { AppLogo } from "@/components/shared/app-logo";
import { PageShell } from "@/components/shared/page-shell";
import { ProfileMenu } from "@/components/shared/profile-menu";
import { APP_NAME } from "@/lib/constants/app";
import { PRIMARY_NAV_ITEMS } from "@/lib/constants/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { getDemoMode } from "@/lib/demo-mode/get-demo-mode";

const HEADER_PRIMARY_BUTTON_CLASS =
  "booking-form-nav-primary !inline-flex !h-8 !w-24 !items-center !justify-center !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-3 !text-center !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)] transition-transform duration-200 will-change-transform hover:!scale-[1.035]";
const HEADER_SECONDARY_BUTTON_CLASS =
  "booking-form-nav-neutral !inline-flex !h-8 !w-24 !items-center !justify-center !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !px-3 !text-center !text-[11px] !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] transition-transform duration-200 will-change-transform hover:!scale-[1.035] hover:!border-[#d6ab77]/78 hover:!bg-[linear-gradient(135deg,rgba(255,252,247,0.98)_0%,rgba(255,239,218,0.96)_100%)] hover:!text-[#8d542d] hover:!shadow-[0_8px_20px_rgba(184,111,41,0.18),0_0_14px_rgba(255,209,103,0.2)]";

export async function AppHeader() {
  const [user, demoMode] = await Promise.all([getCurrentUser(), getDemoMode()]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#fff8ef]/95 shadow-[0_1px_18px_rgba(114,76,43,0.06)]">
      <PageShell className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 justify-self-start">
          <AppLogo />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold md:text-xl">{APP_NAME}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 justify-self-center lg:flex">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="justify-self-end">
            <ProfileMenu currentMode={demoMode} user={user} />
          </div>
        ) : (
          <AuthDialogLinks
            primaryClassName={HEADER_PRIMARY_BUTTON_CLASS}
            secondaryClassName={HEADER_SECONDARY_BUTTON_CLASS}
          />
        )}
      </PageShell>
    </header>
  );
}
