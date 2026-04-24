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
          <div className="flex items-center gap-3 justify-self-end">
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
