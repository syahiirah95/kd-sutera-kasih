import { AppButterflyCompanion } from "@/components/shared/app-butterfly-companion";
import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";

export function AppChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="pb-20 lg:pb-0">{children}</div>
      <AppFooter />
      <AppButterflyCompanion />
    </div>
  );
}
