import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/shared/app-providers";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sutera Kasih Hall",
  description: "Book Dewan Sutera Kasih for weddings, celebrations, corporate functions, and meaningful private events.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full scroll-smooth`}
    >
      <head>
        {process.env.NODE_ENV !== "production" ? (
          <Script id="three-clock-warning-filter" strategy="beforeInteractive">
            {`
              (() => {
                const warning = "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";
                if (window.__threeClockWarningFilterInstalled) return;
                window.__threeClockWarningFilterInstalled = true;
                const originalWarn = console.warn;
                console.warn = (...args) => {
                  const message = String(args[0] ?? "");
                  if (message.includes(warning)) return;
                  originalWarn(...args);
                };
              })();
            `}
          </Script>
        ) : null}
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
