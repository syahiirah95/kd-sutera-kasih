import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="max-w-4xl font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
        {title}
      </h2>
      <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
        {description}
      </p>
    </div>
  );
}
