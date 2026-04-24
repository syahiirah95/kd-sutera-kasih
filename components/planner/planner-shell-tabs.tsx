import { type PlannerPreviewMode } from "@/components/planner/planner-types";
import { cn } from "@/lib/utils";

type PlannerShellTabsProps = {
  compact?: boolean;
  mode: PlannerPreviewMode;
  objectCount: number;
  onModeChange: (mode: PlannerPreviewMode) => void;
};

export function PlannerShellTabs({
  compact = false,
  mode,
  objectCount,
  onModeChange,
}: PlannerShellTabsProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between", compact ? "gap-2" : "gap-4 border-b border-border/70 px-4 py-3")}>
      <div className="booking-planner-mode-toggle relative inline-grid h-7 grid-cols-2 items-center gap-1 rounded-lg border border-[#c9a27e]/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] p-0.5 shadow-[0_6px_16px_rgba(114,76,43,0.12)]">
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0.5 top-0.5 w-[calc(50%-0.375rem)] rounded-md bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] shadow-[0_5px_14px_rgba(184,111,41,0.26)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mode === "2d" ? "translate-x-0.5" : "translate-x-[calc(100%+0.375rem)]",
          )}
        />
        {(["2d", "3d"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onModeChange(tab)}
            className={cn(
              "booking-planner-control h-6 min-w-24 rounded-md px-3 !text-[11px] font-semibold !leading-none transition",
              mode === tab
                ? "text-white"
                : "text-[#5f3f2f] hover:text-[#8d542d]",
            )}
          >
            {tab === "2d" ? "2D Planner" : "3D Preview"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="booking-planner-control-label h-7 min-w-24 rounded-lg border border-[#c9a27e]/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] px-3 text-center font-semibold leading-7 text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)]">Objects: {objectCount}</span>
      </div>
    </div>
  );
}
