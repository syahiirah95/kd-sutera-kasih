"use client";

import { type ReactNode } from "react";
import { useMemo, useState } from "react";
import { snapPlannerValue } from "@/components/planner/planner-constants";
import { PLANNER_PRESETS, PRESET_PLACED_ITEMS } from "@/components/planner/planner-data";
import { createPlannerVariantSelections } from "@/components/planner/planner-object-variants";
import { PlannerPalette } from "@/components/planner/planner-palette";
import { PlannerShellTabs } from "@/components/planner/planner-shell-tabs";
import { PlannerThreeDView } from "@/components/planner/planner-three-d-view";
import { PlannerToolbar } from "@/components/planner/planner-toolbar";
import {
  type PlannerItem,
  type PlannerItemVariant,
  type PlannerPlacedItemsByPreset,
  type PlannerPlacedItem,
  type PlannerPresetId,
  type PlannerPreviewMode,
  type PlannerThreeDCameraMode,
} from "@/components/planner/planner-types";
import { buildDefaultPlannerLibrary } from "@/lib/planner/planner-library";
import { cn } from "@/lib/utils";

function createPlannerState(initialReceptionItems?: PlannerPlacedItem[]): PlannerPlacedItemsByPreset {
  return {
    ceremony: PRESET_PLACED_ITEMS.ceremony.map((item) => ({ ...item })),
    corporate: PRESET_PLACED_ITEMS.corporate.map((item) => ({ ...item })),
    reception: (initialReceptionItems ?? PRESET_PLACED_ITEMS.reception).map((item) => ({ ...item })),
  };
}

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_LIBRARY = buildDefaultPlannerLibrary();

type PlannerLayoutShellProps = {
  compact?: boolean;
  controlsSlot?: ReactNode;
  initialReceptionItems?: PlannerPlacedItem[];
  items?: PlannerItem[];
  singlePreset?: boolean;
  toolbarPlacement?: "floating" | "top";
  variantsByItemId?: Record<string, PlannerItemVariant[]>;
};

export function PlannerLayoutShell({
  compact = false,
  controlsSlot,
  initialReceptionItems,
  items = DEFAULT_LIBRARY.items,
  singlePreset = false,
  toolbarPlacement = "floating",
  variantsByItemId = DEFAULT_LIBRARY.variantsByItemId,
}: PlannerLayoutShellProps) {
  const [mode, setMode] = useState<PlannerPreviewMode>("2d");
  const [threeDCameraMode, setThreeDCameraMode] = useState<PlannerThreeDCameraMode>("perspective");
  const [selectedPresetId, setSelectedPresetId] = useState<PlannerPresetId>("reception");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [selectedPlacedItemId, setSelectedPlacedItemId] = useState<string | null>(null);
  const [enabledItemIds, setEnabledItemIds] = useState<string[]>(() => items.map((item) => item.id));
  const [selectedVariantIdsByItemId, setSelectedVariantIdsByItemId] = useState(
    () => createPlannerVariantSelections(items, variantsByItemId),
  );
  const initialPlannerState = useMemo(
    () => createPlannerState(initialReceptionItems),
    [initialReceptionItems],
  );
  const [placedItemsByPreset, setPlacedItemsByPreset] = useState<PlannerPlacedItemsByPreset>(
    () => ({
      ceremony: initialPlannerState.ceremony.map((item) => ({ ...item })),
      corporate: initialPlannerState.corporate.map((item) => ({ ...item })),
      reception: initialPlannerState.reception.map((item) => ({ ...item })),
    }),
  );

  const placedItems = placedItemsByPreset[selectedPresetId];
  const visiblePlacedItems = placedItems.filter((item) => enabledItemIds.includes(item.itemId));
  const selectedPlacedItem =
    visiblePlacedItems.find((item) => item.id === selectedPlacedItemId) ?? null;
  const activeItem = isEditMode && activeItemId && enabledItemIds.includes(activeItemId)
    ? items.find((item) => item.id === activeItemId) ?? null
    : null;

  const handleModeChange = (nextMode: PlannerPreviewMode) => {
    setMode(nextMode);

    if (nextMode === "3d") {
      setActiveItemId(null);
      setIsMoveMode(false);
      setSelectedPlacedItemId(null);
    }
  };

  const handlePresetChange = (presetId: PlannerPresetId) => {
    setSelectedPresetId(presetId);
    setSelectedPlacedItemId(null);
  };

  const handleVariantChange = (itemId: string, variantId: string) => {
    setSelectedVariantIdsByItemId((currentSelections) => ({
      ...currentSelections,
      [itemId]: variantId,
    }));
  };

  const handleToggleItem = (itemId: string) => {
    setEnabledItemIds((currentIds) => {
      if (!currentIds.includes(itemId)) {
        return [...currentIds, itemId];
      }

      return currentIds.filter((id) => id !== itemId);
    });

    if (activeItemId === itemId) {
      setActiveItemId(null);
    }

    if (selectedPlacedItem?.itemId === itemId) {
      setSelectedPlacedItemId(null);
    }
  };

  const handleItemMove = (itemId: string, x: number, y: number) => {
    if (!isEditMode || !isMoveMode) {
      return;
    }

    setPlacedItemsByPreset((currentItems) => ({
      ...currentItems,
      [selectedPresetId]: currentItems[selectedPresetId].map((item) =>
        item.id === itemId
          ? {
              ...item,
              x: snapPlannerValue(x),
              y: snapPlannerValue(y),
            }
          : item,
      ),
    }));
  };

  const handleCanvasAction = (x: number, y: number) => {
    if (!isEditMode) {
      return;
    }

    if (activeItemId) {
      const itemDef = items.find((item) => item.id === activeItemId);
      if (!itemDef) {
        return;
      }

      const newItem = {
        id: createId(),
        itemId: itemDef.id,
        label: itemDef.label,
        rotation: 0,
        widthClass: "",
        x: snapPlannerValue(x),
        y: snapPlannerValue(y),
        zone: itemDef.zoneHint,
      };

      setPlacedItemsByPreset((currentItems) => ({
        ...currentItems,
        [selectedPresetId]: [...currentItems[selectedPresetId], newItem],
      }));
      setSelectedPlacedItemId(newItem.id);
      return;
    }

    if (!isMoveMode || !selectedPlacedItemId) {
      return;
    }

    handleItemMove(selectedPlacedItemId, x, y);
  };

  const handleRotate = (degrees: number) => {
    if (!isEditMode || !selectedPlacedItemId) {
      return;
    }

    setPlacedItemsByPreset((currentItems) => ({
      ...currentItems,
      [selectedPresetId]: currentItems[selectedPresetId].map((item) =>
        item.id === selectedPlacedItemId
          ? { ...item, rotation: (item.rotation + degrees + 360) % 360 }
          : item,
      ),
    }));
  };

  const handleCopy = () => {
    if (!isEditMode || !selectedPlacedItem) {
      return;
    }

    const duplicated = {
      ...selectedPlacedItem,
      id: createId(),
      x: snapPlannerValue(selectedPlacedItem.x + 4),
      y: snapPlannerValue(selectedPlacedItem.y + 4),
    };

    setPlacedItemsByPreset((currentItems) => ({
      ...currentItems,
      [selectedPresetId]: [...currentItems[selectedPresetId], duplicated],
    }));
    setSelectedPlacedItemId(duplicated.id);
  };

  const handleDelete = () => {
    if (!isEditMode || !selectedPlacedItemId) {
      return;
    }

    setPlacedItemsByPreset((currentItems) => ({
      ...currentItems,
      [selectedPresetId]: currentItems[selectedPresetId].filter(
        (item) => item.id !== selectedPlacedItemId,
      ),
    }));
    setSelectedPlacedItemId(null);
  };

  const handleClearSelection = () => {
    setIsMoveMode(false);
    setActiveItemId(null);
    setSelectedPlacedItemId(null);
  };

  const handleResetLayout = () => {
    if (!isEditMode) {
      return;
    }

    setPlacedItemsByPreset({
      ceremony: initialPlannerState.ceremony.map((item) => ({ ...item })),
      corporate: initialPlannerState.corporate.map((item) => ({ ...item })),
      reception: initialPlannerState.reception.map((item) => ({ ...item })),
    });
    setIsMoveMode(false);
    setSelectedPlacedItemId(null);
    setActiveItemId(null);
  };

  const handleMoveModeToggle = () => {
    if (!isEditMode) {
      return;
    }

    setActiveItemId(null);
    setIsMoveMode((currentMode) => !currentMode);
  };

  const handleEditModeToggle = () => {
    setIsEditMode((currentMode) => {
      const nextMode = !currentMode;

      if (!nextMode) {
        setActiveItemId(null);
        setIsMoveMode(false);
        setSelectedPlacedItemId(null);
      }

      return nextMode;
    });
  };

  const modeLabel = useMemo(
    () => {
      if (activeItemId) {
        return "Placement mode";
      }

      if (!isEditMode) {
        return "View mode";
      }

      return isMoveMode ? "Move mode" : "Edit mode";
    },
    [activeItemId, isEditMode, isMoveMode],
  );
  const showTopToolbar = toolbarPlacement === "top";
  const toolbarControls = (
    <PlannerToolbar
      canClearSelection={Boolean(isEditMode && (activeItemId || selectedPlacedItemId || isMoveMode))}
      canEditSelection={Boolean(isEditMode && selectedPlacedItemId)}
      cameraMode={mode === "3d" ? threeDCameraMode : undefined}
      inline={showTopToolbar}
      isEditMode={isEditMode}
      isMoveMode={isMoveMode}
      onCameraModeChange={mode === "3d" ? setThreeDCameraMode : undefined}
      onClearSelection={handleClearSelection}
      onCopy={handleCopy}
      onDelete={handleDelete}
      onEditModeToggle={handleEditModeToggle}
      onMoveMode={handleMoveModeToggle}
      onResetLayout={handleResetLayout}
      onRotateLeft={() => handleRotate(-15)}
      onRotateRight={() => handleRotate(15)}
    />
  );

  const plannerCanvas = (
      <div className={cn("flex", compact ? "min-h-[240px]" : "min-h-[540px]")}>
        {mode === "2d" ? (
          <>
            <PlannerPalette
              activeItemId={activeItemId}
              compact={compact}
              enabledItemIds={enabledItemIds}
              items={items}
              variantsByItemId={variantsByItemId}
              onSelectItem={(itemId) => {
                handleModeChange("2d");
                if (!enabledItemIds.includes(itemId)) {
                  setEnabledItemIds((currentIds) => [...currentIds, itemId]);
                }
                setIsEditMode(true);
                setIsMoveMode(false);
                setActiveItemId(itemId);
                setSelectedPlacedItemId(null);
              }}
              onToggleItem={handleToggleItem}
              onVariantChange={handleVariantChange}
              selectedVariantIdsByItemId={selectedVariantIdsByItemId}
            />
            <PlannerThreeDView
              activeItem={activeItem}
              cameraModeOverride="top"
              compact={compact}
              hideToolbar={showTopToolbar}
              isEditMode={isEditMode}
              isMoveMode={isMoveMode}
              placedItems={visiblePlacedItems}
              selectedPlacedItemId={selectedPlacedItemId}
              selectedVariantIdsByItemId={selectedVariantIdsByItemId}
              items={items}
              variantsByItemId={variantsByItemId}
              onCanvasAction={handleCanvasAction}
              onCanvasSelect={(itemId) => {
                if (!isEditMode) {
                  return;
                }
                setSelectedPlacedItemId(itemId);
                setActiveItemId(null);
              }}
              onItemMove={handleItemMove}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onEditModeToggle={handleEditModeToggle}
              onMoveMode={handleMoveModeToggle}
              onResetLayout={handleResetLayout}
              onRotateLeft={() => handleRotate(-15)}
              onRotateRight={() => handleRotate(15)}
              onClearSelection={handleClearSelection}
            />
          </>
        ) : (
          <div className="w-full">
            <PlannerThreeDView
              activeItem={activeItem}
              cameraModeOverride={threeDCameraMode}
              compact={compact}
              hideToolbar={showTopToolbar}
              isEditMode={isEditMode}
              isMoveMode={isMoveMode}
              onCameraModeChange={setThreeDCameraMode}
              placedItems={visiblePlacedItems}
              selectedPlacedItemId={selectedPlacedItemId}
              selectedVariantIdsByItemId={selectedVariantIdsByItemId}
              items={items}
              variantsByItemId={variantsByItemId}
              onCanvasAction={handleCanvasAction}
              onCanvasSelect={(itemId) => {
                if (!isEditMode) {
                  return;
                }
                setSelectedPlacedItemId(itemId);
                setActiveItemId(null);
              }}
              onItemMove={handleItemMove}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onEditModeToggle={handleEditModeToggle}
              onMoveMode={handleMoveModeToggle}
              onResetLayout={handleResetLayout}
              onRotateLeft={() => handleRotate(-15)}
              onRotateRight={() => handleRotate(15)}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}
      </div>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <PlannerShellTabs
              compact
              mode={mode}
              objectCount={visiblePlacedItems.length}
              onModeChange={handleModeChange}
            />
            <span className="hidden text-xs font-medium text-foreground md:inline">{modeLabel}</span>
          </div>
          {controlsSlot}
        </div>
        <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-white shadow-[0_16px_45px_rgba(104,74,58,0.08)]">
          {plannerCanvas}
        </div>
      </div>
    );
  }

  if (showTopToolbar) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PlannerShellTabs
            compact
            mode={mode}
            objectCount={visiblePlacedItems.length}
            onModeChange={handleModeChange}
          />
          {toolbarControls}
        </div>
        <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-white shadow-[0_16px_45px_rgba(104,74,58,0.08)]">
          {plannerCanvas}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-white shadow-[0_16px_45px_rgba(104,74,58,0.08)]">
      <PlannerShellTabs
        mode={mode}
        objectCount={visiblePlacedItems.length}
        onModeChange={handleModeChange}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-foreground">{modeLabel}</span>
          <span>{singlePreset ? "Hall space" : `Preset: ${PLANNER_PRESETS.find((preset) => preset.id === selectedPresetId)?.label}`}</span>
        </div>
        {!singlePreset ? (
          <div className="flex flex-wrap gap-2">
            {PLANNER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetChange(preset.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedPresetId === preset.id
                    ? "border-primary/45 bg-primary/10 text-foreground"
                    : "border-border/70 bg-white text-muted-foreground hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {plannerCanvas}
    </div>
  );
}
