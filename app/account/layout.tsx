import { AppChrome } from "@/components/shared/app-chrome";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppChrome>{children}</AppChrome>;
}
