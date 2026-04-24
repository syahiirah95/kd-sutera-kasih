import { cn } from "@/lib/utils";

type BookingSelectionCardProps = {
  description: string;
  meta: string;
  onClick: () => void;
  selected: boolean;
  statusLabel: string;
  title: string;
};

export function BookingSelectionCard({
  description,
  meta,
  onClick,
  selected,
  statusLabel,
  title,
}: BookingSelectionCardProps) {
  return (
    <button
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-4 text-left transition",
        selected
          ? "border-primary/45 bg-primary/10 text-foreground shadow-[0_18px_35px_rgba(212,155,106,0.16)]"
          : "border-border/70 bg-white/60 text-muted-foreground hover:bg-white/85",
      )}
      type="button"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
            selected ? "bg-primary/15 text-primary" : "bg-secondary/80 text-muted-foreground",
          )}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{meta}</p>
    </button>
  );
}
