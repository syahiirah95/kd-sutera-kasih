import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";
import { PageShell } from "@/components/shared/page-shell";
import { ProfileMenu } from "@/components/shared/profile-menu";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants/app";
import { PRIMARY_NAV_ITEMS } from "@/lib/constants/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { getDemoMode } from "@/lib/demo-mode/get-demo-mode";

export async function AppHeader() {
  const [user, demoMode] = await Promise.all([getCurrentUser(), getDemoMode()]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-background/70 backdrop-blur-xl">
      <PageShell className="flex min-h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo />
            <div>
              <p className="font-display text-xl font-semibold">{APP_NAME}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Venue Booking
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 lg:flex">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {user ? (
          <ProfileMenu currentMode={demoMode} user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              Admin access
            </Link>
            <Button asLink href="/login" size="lg">
              Sign in
            </Button>
          </div>
        )}
      </PageShell>
    </header>
  );
}
