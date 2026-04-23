import { cn } from "@/lib/utils";

export function Avatar({
  className,
  fallback,
}: Readonly<{
  className?: string;
  fallback: string;
}>) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary",
        className,
      )}
    >
      {fallback}
    </div>
  );
}
