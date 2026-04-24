import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  getDefaultPlannerVariantId,
  getPlannerItemVariants,
  type PlannerObjectVariant,
} from "@/components/planner/planner-object-variants";
import { type PlannerItem } from "@/components/planner/planner-types";
import { cn } from "@/lib/utils";

type PlannerPaletteProps = {
  activeItemId: string | null;
  compact?: boolean;
  enabledItemIds: string[];
  items: PlannerItem[];
  onSelectItem: (itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  onVariantChange: (itemId: string, variantId: string) => void;
  selectedVariantIdsByItemId: Record<string, string>;
};

type PlannerPaletteOption = Pick<PlannerObjectVariant, "id" | "label"> & {
  isFallback?: boolean;
};

function getPaletteOptions(item: PlannerItem): PlannerPaletteOption[] {
  const variants = getPlannerItemVariants(item.id);

  if (variants.length > 0) {
    return variants;
  }

  return [{ id: `default-${item.id}`, isFallback: true, label: item.label }];
}

export function PlannerPalette({
  activeItemId,
  compact = false,
  enabledItemIds,
  items,
  onSelectItem,
  onToggleItem,
  onVariantChange,
  selectedVariantIdsByItemId,
}: PlannerPaletteProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const furnitureItems = items.filter((item) => item.category === "furniture");
  const decorItems = items.filter((item) => item.category === "decor");
  const sections = [
    ["Furniture", furnitureItems],
    ["Decor & Setup", decorItems],
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
              const options = getPaletteOptions(item);
              const selectedVariantId =
                selectedVariantIdsByItemId[item.id] ?? getDefaultPlannerVariantId(item.id);
              const isEnabled = enabledItemIds.includes(item.id);
              const selectedOption =
                options.find((option) => option.id === selectedVariantId) ?? options[0];
              const isExpanded = expandedItemId === item.id;

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

                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      className={cn(dropdownClassName, compact && "w-[92px] !text-[10px]")}
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    >
                      <span className="block min-w-0 flex-1 truncate text-left">
                        {selectedOption?.label ?? item.label}
                      </span>
                      <ChevronDown className={cn("ml-1 size-3 shrink-0 transition", isExpanded && "rotate-180")} />
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className={compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2"}>
                      {options.map((option) => {
                        const isSelected = selectedOption?.id === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (!option.isFallback) {
                                onVariantChange(item.id, option.id);
                              }
                              if (!isEnabled) {
                                onToggleItem(item.id);
                              }
                              onSelectItem(item.id);
                            }}
                            className={cn(
                              "flex h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-[11px] font-medium leading-none transition",
                              isSelected
                                ? "bg-[#ecfdf3] text-[#166534]"
                                : "bg-secondary/55 text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )}
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#16a34a]/30 bg-white text-[#16a34a]">
                              <Check className={cn("size-3", isSelected ? "opacity-100" : "opacity-0")} />
                            </span>
                            <span className="h-7 w-10 shrink-0 rounded-md border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(231,221,210,0.75)_100%)]" />
                            <span className="min-w-0 flex-1 truncate">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
