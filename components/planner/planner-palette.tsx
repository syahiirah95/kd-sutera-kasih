import { Check } from "lucide-react";
import { type PlannerItem, type PlannerItemVariant } from "@/components/planner/planner-types";
import { cn } from "@/lib/utils";

type PlannerPaletteProps = {
  activeItemId: string | null;
  compact?: boolean;
  enabledItemIds: string[];
  items: PlannerItem[];
  variantsByItemId: Record<string, PlannerItemVariant[]>;
  onSelectItem: (itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  onVariantChange: (itemId: string, variantId: string) => void;
  selectedVariantIdsByItemId: Record<string, string>;
};

export function PlannerPalette({
  activeItemId,
  compact = false,
  enabledItemIds,
  items,
  variantsByItemId: _variantsByItemId,
  onSelectItem,
  onToggleItem,
  onVariantChange: _onVariantChange,
  selectedVariantIdsByItemId: _selectedVariantIdsByItemId,
}: PlannerPaletteProps) {
  void _variantsByItemId;
  void _onVariantChange;
  void _selectedVariantIdsByItemId;
  const furnitureItems = items.filter((item) => item.category === "furniture");
  const decorItems = items.filter((item) => item.category === "decor");
  const companionItems = items.filter((item) => item.category === "companion");
  const sections = [
    ["Furniture", furnitureItems],
    ["Decor & Setup", decorItems],
    ["Butterfly Companion", companionItems],
  ] as const;
  const dropdownClassName =
    "booking-planner-control flex h-7 w-[118px] shrink-0 items-center justify-between rounded-lg border border-[#c8893e]/55 bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] px-2 !text-[11px] font-semibold !leading-none text-white shadow-[0_8px_20px_rgba(184,111,41,0.22)]";

  return (
    <div
      className={cn(
        "booking-layout-preview-scroll shrink-0 overflow-y-auto border-r border-border/70 bg-card/70",
        compact ? "h-[240px] w-[178px] p-2.5 pb-8" : "h-[540px] w-[300px] p-4 pb-10",
      )}
    >
      {sections.map(([title, sectionItems]) => (
        <div key={title} className={cn(compact ? "space-y-2 pb-3 last:pb-8" : "space-y-3 pb-5 last:pb-10")}>
          <p className={cn("font-semibold uppercase text-muted-foreground", compact ? "text-[10px] tracking-[0.14em]" : "text-xs tracking-[0.18em]")}>
            {title}
          </p>
          <div className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-white/75">
            {sectionItems.map((item, itemIndex) => {
              const isEnabled = enabledItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "border-b border-border/65 bg-white/75 p-2 transition last:border-b-0",
                    activeItemId === item.id
                      ? "bg-primary/10 shadow-[inset_3px_0_0_rgba(191,118,47,0.62)]"
                      : "hover:bg-white",
                    itemIndex === 0 && "rounded-t-[var(--radius-sm)]",
                    itemIndex === sectionItems.length - 1 && "rounded-b-[var(--radius-sm)]",
                    !isEnabled && "opacity-60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={isEnabled}
                      aria-label={`${isEnabled ? "Remove" : "Add"} ${item.label}`}
                      onClick={() => onToggleItem(item.id)}
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border transition",
                        isEnabled
                          ? "border-[#15803d]/30 bg-[#16a34a] text-white shadow-[0_8px_20px_rgba(22,163,74,0.22)]"
                          : "border-[#c9a27e]/45 bg-white/80 text-transparent hover:text-[#16a34a]",
                      )}
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectItem(item.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <span className={cn("min-w-0 flex-1 truncate text-foreground", compact ? "text-[10px]" : "text-xs")}>
                        {item.label}
                      </span>
                    </button>

                    <span
                      className={cn(
                        dropdownClassName,
                        "pointer-events-none justify-center",
                        compact && "w-[92px] !text-[10px]",
                      )}
                    >
                      Asset
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
