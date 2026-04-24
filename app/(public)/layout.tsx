import { AppChrome } from "@/components/shared/app-chrome";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppChrome>{children}</AppChrome>;
}
