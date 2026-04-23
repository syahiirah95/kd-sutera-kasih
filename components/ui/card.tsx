import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[var(--radius-lg)] border border-white/70 text-card-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <h3 className={cn("text-xl font-semibold text-foreground", className)}>{children}</h3>;
}

export function CardContent({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <div className={cn("p-6", className)}>{children}</div>;
}
