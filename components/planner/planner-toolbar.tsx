import { Camera, Copy, Eye, Hand, Map, MousePointer2, PencilLine, RotateCcw, RotateCw, RotateCwSquare, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type PlannerThreeDCameraMode } from "@/components/planner/planner-types";
import { cn } from "@/lib/utils";

type PlannerToolbarProps = {
  canClearSelection: boolean;
  canEditSelection: boolean;
  cameraMode?: PlannerThreeDCameraMode;
  compact?: boolean;
  inline?: boolean;
  isEditMode: boolean;
  isMoveMode: boolean;
  onCameraModeChange?: (cameraMode: PlannerThreeDCameraMode) => void;
  onClearSelection: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onEditModeToggle: () => void;
  onMoveMode: () => void;
  onResetLayout: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
};

type ToolbarButtonProps = {
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  label: string;
  onClick: () => void;
};

function ToolbarButton({
  children,
  danger = false,
  disabled = false,
  isActive = false,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-disabled={disabled}
          className={cn(
            "flex size-8 items-center justify-center rounded-[var(--radius-sm)] border transition",
            isActive
              ? "border-[#c8893e]/60 bg-[#d99a42] text-white shadow-[0_6px_14px_rgba(184,111,41,0.2)]"
              : "border-[#d8c4b2]/65 bg-white/78 text-[#5f3f2f] hover:border-[#c9a27e]/80 hover:bg-white",
            danger && "hover:border-[#b84f58]/60 hover:bg-[#fff1f2] hover:text-[#b84f58]",
            disabled && "cursor-not-allowed opacity-45 hover:border-[#d8c4b2]/65 hover:bg-white/78 hover:text-[#5f3f2f]",
          )}
          onClick={() => {
            if (!disabled) {
              onClick();
            }
          }}
        >
          {children}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function PlannerToolbar({
  canClearSelection,
  canEditSelection,
  cameraMode,
  compact = false,
  inline = false,
  isEditMode,
  isMoveMode,
  onCameraModeChange,
  onClearSelection,
  onCopy,
  onDelete,
  onEditModeToggle,
  onMoveMode,
  onResetLayout,
  onRotateLeft,
  onRotateRight,
}: PlannerToolbarProps) {
  const showCameraControls = Boolean(cameraMode && onCameraModeChange);

  return (
    <div
      className={cn(
        "z-20 flex items-center gap-1 rounded-[var(--radius-sm)] border border-border/70 bg-white/82 p-1 shadow-[0_10px_22px_rgba(104,74,58,0.1)] backdrop-blur",
        inline ? "" : "absolute left-1/2 -translate-x-1/2",
        !inline && (compact ? "top-2" : "top-4"),
      )}
    >
      <ToolbarButton
        label={isEditMode ? "Switch to view mode" : "Switch to edit mode"}
        isActive={isEditMode}
        onClick={onEditModeToggle}
      >
        {isEditMode ? <Eye className="size-4" /> : <PencilLine className="size-4" />}
      </ToolbarButton>
      <ToolbarButton label="Move" disabled={!isEditMode} isActive={isMoveMode} onClick={onMoveMode}>
        <Hand className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Clear selection"
        disabled={!canClearSelection}
        onClick={onClearSelection}
      >
        <MousePointer2 className="size-4" />
      </ToolbarButton>
      {showCameraControls ? (
        <>
          <span className={cn("mx-0.5 w-px bg-border/70", compact ? "h-5" : "h-6")} />
          <ToolbarButton
            label="Perspective view"
            isActive={cameraMode === "perspective"}
            onClick={() => onCameraModeChange?.("perspective")}
          >
            <Camera className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Top-down view"
            isActive={cameraMode === "top"}
            onClick={() => onCameraModeChange?.("top")}
          >
            <Map className="size-4" />
          </ToolbarButton>
        </>
      ) : null}
      <span className={cn("mx-0.5 w-px bg-border/70", compact ? "h-5" : "h-6")} />
      <ToolbarButton
        label="Reset layout"
        disabled={!isEditMode}
        onClick={onResetLayout}
      >
        <RotateCwSquare className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rotate left"
        disabled={!canEditSelection}
        onClick={onRotateLeft}
      >
        <RotateCcw className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rotate right"
        disabled={!canEditSelection}
        onClick={onRotateRight}
      >
        <RotateCw className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Duplicate"
        disabled={!canEditSelection}
        onClick={onCopy}
      >
        <Copy className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        danger
        label="Delete"
        disabled={!canEditSelection}
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}
