"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type AuthDialogLinksProps = {
  primaryClassName: string;
  secondaryClassName: string;
};

export function AuthDialogLinks({
  primaryClassName,
  secondaryClassName,
}: Readonly<AuthDialogLinksProps>) {
  const pathname = usePathname();
  const next = encodeURIComponent(pathname);

  return (
    <div className="flex items-center justify-self-end gap-2">
      <Button
        asLink
        className={`hidden md:inline-flex ${secondaryClassName}`}
        href={`${pathname}?auth=signup&next=${next}`}
        size="default"
        variant="secondary"
      >
        Sign up
      </Button>
      <Button
        asLink
        className={primaryClassName}
        href={`${pathname}?auth=login&next=${next}`}
        size="default"
        variant="default"
      >
        Sign in
      </Button>
    </div>
  );
}
