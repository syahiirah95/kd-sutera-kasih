"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { PLANNER_3D_CAMERA_CONFIG } from "@/components/planner/planner-3d-camera-config";
import { PlannerThreeDScene } from "@/components/planner/planner-three-d-scene";
import { PlannerToolbar } from "@/components/planner/planner-toolbar";
import {
  type PlannerItem,
  type PlannerPlacedItem,
  type PlannerThreeDCameraMode,
  type PlannerVariantSelections,
} from "@/components/planner/planner-types";

type PlannerThreeDViewProps = {
  activeItem: PlannerItem | null;
  cameraModeOverride?: PlannerThreeDCameraMode;
  compact?: boolean;
  hideToolbar?: boolean;
  isEditMode: boolean;
  isMoveMode: boolean;
  onCameraModeChange?: (cameraMode: PlannerThreeDCameraMode) => void;
  placedItems: PlannerPlacedItem[];
  selectedPlacedItemId: string | null;
  selectedVariantIdsByItemId: PlannerVariantSelections;
  onCanvasAction: (x: number, y: number) => void;
  onCanvasSelect: (itemId: string | null) => void;
  onClearSelection: () => void;
  onItemMove: (itemId: string, x: number, y: number) => void;
  onCopy: () => void;
  onDelete: () => void;
  onEditModeToggle: () => void;
  onMoveMode: () => void;
  onResetLayout: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
};

export function PlannerThreeDView({
  activeItem,
  cameraModeOverride,
  compact = false,
  hideToolbar = false,
  isEditMode,
  isMoveMode,
  onCameraModeChange,
  placedItems,
  selectedPlacedItemId,
  selectedVariantIdsByItemId,
  onCanvasAction,
  onCanvasSelect,
  onClearSelection,
  onItemMove,
  onCopy,
  onDelete,
  onEditModeToggle,
  onMoveMode,
  onResetLayout,
  onRotateLeft,
  onRotateRight,
}: PlannerThreeDViewProps) {
  const [cameraModeState, setCameraModeState] = useState<PlannerThreeDCameraMode>("perspective");
  const cameraMode = cameraModeOverride ?? cameraModeState;
  const cameraConfig = PLANNER_3D_CAMERA_CONFIG[cameraMode];
  const handleCameraModeChange = onCameraModeChange ?? setCameraModeState;
  const editableMoveMode = isEditMode && isMoveMode;
  const editableSelectedPlacedItemId = isEditMode ? selectedPlacedItemId : null;

  return (
    <div className={compact ? "relative h-[240px] min-w-0 flex-1 overflow-hidden bg-gradient-to-b from-amber-50 to-stone-100" : "relative h-[540px] min-w-0 flex-1 overflow-hidden bg-gradient-to-b from-amber-50 to-stone-100"}>
      {!hideToolbar ? (
        <PlannerToolbar
          canClearSelection={Boolean(isEditMode && (activeItem || selectedPlacedItemId || isMoveMode))}
          canEditSelection={Boolean(editableSelectedPlacedItemId)}
          cameraMode={cameraModeOverride ? undefined : cameraMode}
          compact={compact}
          isEditMode={isEditMode}
          isMoveMode={editableMoveMode}
          onCameraModeChange={cameraModeOverride ? undefined : handleCameraModeChange}
          onClearSelection={onClearSelection}
          onCopy={onCopy}
          onDelete={onDelete}
          onEditModeToggle={onEditModeToggle}
          onMoveMode={onMoveMode}
          onResetLayout={onResetLayout}
          onRotateLeft={onRotateLeft}
          onRotateRight={onRotateRight}
        />
      ) : null}
      {placedItems.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-muted-foreground">
          Place items in the 2D planner to see them in the live 3D preview.
        </div>
      ) : null}
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading 3D preview...
          </div>
        }
      >
        <Canvas
          key={cameraMode}
          camera={cameraConfig}
          shadows={{ type: PCFShadowMap }}
        >
          <PlannerThreeDScene
            cameraMode={cameraMode}
            canPlaceItem={Boolean(isEditMode && activeItem)}
            canSelectItem={isEditMode}
            isMoveMode={editableMoveMode}
            placedItems={placedItems}
            selectedPlacedItemId={editableSelectedPlacedItemId}
            selectedVariantIdsByItemId={selectedVariantIdsByItemId}
            onCanvasAction={onCanvasAction}
            onCanvasSelect={onCanvasSelect}
            onItemMove={onItemMove}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
