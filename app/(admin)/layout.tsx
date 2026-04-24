import { AppChrome } from "@/components/shared/app-chrome";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppChrome>{children}</AppChrome>;
}
