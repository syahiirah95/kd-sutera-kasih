"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";

const UPSTREAM_THREE_WARNINGS = [
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.",
];

let isThreeWarningFilterInstalled = false;

function installThreeWarningFilter() {
  if (
    isThreeWarningFilterInstalled ||
    process.env.NODE_ENV === "production" ||
    typeof window === "undefined"
  ) {
    return;
  }

  isThreeWarningFilterInstalled = true;
  const originalWarn = console.warn;

  console.warn = (...args) => {
    const message = String(args[0] ?? "");

    if (UPSTREAM_THREE_WARNINGS.some((warning) => message.includes(warning))) {
      return;
    }

    originalWarn(...args);
  };
}

export function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  installThreeWarningFilter();

  return (
    <TooltipProvider delayDuration={150}>
      <ToastProvider>{children}</ToastProvider>
    </TooltipProvider>
  );
}
