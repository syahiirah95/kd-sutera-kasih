import { AppHeader } from "@/components/shared/app-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pb-20">{children}</main>
    </div>
  );
}
