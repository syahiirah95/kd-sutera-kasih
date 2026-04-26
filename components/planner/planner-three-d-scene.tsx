"use client";

import { useEffect, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import {
  HALL_DEPTH,
  HALL_WIDTH,
  WALL_HEIGHT,
  mapWorldXToPlanner,
  mapWorldZToPlanner,
} from "@/components/planner/planner-constants";
import { PlannerThreeDObject } from "@/components/planner/planner-three-d-object";
import {
  type PlannerItem,
  type PlannerItemVariant,
  type PlannerPlacedItem,
  type PlannerThreeDCameraMode,
  type PlannerVariantSelections,
} from "@/components/planner/planner-types";

function HallShell() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALL_WIDTH, HALL_DEPTH]} />
        <meshStandardMaterial color="#efe7d8" />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, -HALL_DEPTH / 2]} receiveShadow>
        <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#f1ece1" />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, HALL_DEPTH / 2]} receiveShadow>
        <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#f1ece1" transparent opacity={0.14} />
      </mesh>
      <mesh position={[-HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[0.5, WALL_HEIGHT, HALL_DEPTH]} />
        <meshStandardMaterial color="#f1ece1" />
      </mesh>
      <mesh position={[HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[0.5, WALL_HEIGHT, HALL_DEPTH]} />
        <meshStandardMaterial color="#f1ece1" />
      </mesh>
    </group>
  );
}

type PlannerFloorCaptureProps = {
  canPlaceItem: boolean;
  draggingItemId: string | null;
  isMoveMode: boolean;
  onCanvasAction: (x: number, y: number) => void;
  onItemMove: (itemId: string, x: number, y: number) => void;
};

function PlannerFloorCapture({
  canPlaceItem,
  draggingItemId,
  isMoveMode,
  onCanvasAction,
  onItemMove,
}: PlannerFloorCaptureProps) {
  const updateFromPoint = (pointX: number, pointZ: number) => {
    const plannerX = mapWorldXToPlanner(pointX);
    const plannerY = mapWorldZToPlanner(pointZ);

    if (draggingItemId) {
      onItemMove(draggingItemId, plannerX, plannerY);
      return;
    }

    onCanvasAction(plannerX, plannerY);
  };

  const handleFloorPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if ((!isMoveMode && !canPlaceItem) || draggingItemId) {
      return;
    }

    event.stopPropagation();
    updateFromPoint(event.point.x, event.point.z);
  };

  const handleFloorPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isMoveMode || !draggingItemId) {
      return;
    }

    event.stopPropagation();
    updateFromPoint(event.point.x, event.point.z);
  };

  return (
    <mesh
      position={[0, 0.03, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={handleFloorPointerDown}
      onPointerMove={handleFloorPointerMove}
    >
      <planeGeometry args={[HALL_WIDTH, HALL_DEPTH]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export function PlannerThreeDScene({
  cameraMode,
  canPlaceItem,
  canSelectItem,
  disableControls,
  isMoveMode,
  items,
  placedItems,
  selectedPlacedItemId,
  selectedVariantIdsByItemId,
  variantsByItemId,
  onCanvasAction,
  onCanvasSelect,
  onItemMove,
}: Readonly<{
  cameraMode: PlannerThreeDCameraMode;
  canPlaceItem: boolean;
  canSelectItem: boolean;
  disableControls?: boolean;
  isMoveMode: boolean;
  items: PlannerItem[];
  placedItems: PlannerPlacedItem[];
  selectedPlacedItemId: string | null;
  selectedVariantIdsByItemId: PlannerVariantSelections;
  variantsByItemId: Record<string, PlannerItemVariant[]>;
  onCanvasAction: (x: number, y: number) => void;
  onCanvasSelect: (itemId: string | null) => void;
  onItemMove: (itemId: string, x: number, y: number) => void;
}>) {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  useEffect(() => {
    const stopDragging = () => setDraggingItemId(null);

    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointerup", stopDragging);
    };
  }, []);

  return (
    <>
      <OrbitControls
        makeDefault
        enabled={!disableControls}
        enablePan={false}
        enableRotate={!disableControls && cameraMode === "perspective"}
        minDistance={cameraMode === "perspective" ? 45 : 52}
        maxDistance={cameraMode === "perspective" ? 95 : 100}
        minPolarAngle={cameraMode === "perspective" ? 0.4 : 0}
        maxPolarAngle={cameraMode === "perspective" ? Math.PI / 2.05 : 0.18}
      />
      <ambientLight intensity={0.75} />
      <directionalLight
        castShadow
        intensity={1.1}
        position={[18, 28, 22]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.35} position={[-18, 14, -10]} />
      <Grid
        args={[HALL_WIDTH, HALL_DEPTH]}
        cellColor="#d8ccaf"
        cellSize={2}
        cellThickness={0.6}
        fadeDistance={120}
        infiniteGrid={false}
        position={[0, 0.01, 0]}
        sectionColor="#c8b48a"
        sectionSize={10}
        sectionThickness={1}
      />
      <HallShell />
      <PlannerFloorCapture
        canPlaceItem={canPlaceItem}
        draggingItemId={draggingItemId}
        isMoveMode={isMoveMode}
        onCanvasAction={onCanvasAction}
        onItemMove={onItemMove}
      />
      {placedItems.map((item) => (
        <PlannerThreeDObject
          key={item.id}
          canSelect={canSelectItem}
          isSelected={selectedPlacedItemId === item.id}
          item={item}
          items={items}
          selectedVariantId={selectedVariantIdsByItemId[item.itemId]}
          variantsByItemId={variantsByItemId}
          onSelect={onCanvasSelect}
          onStartDrag={(itemId) => {
            if (!isMoveMode) {
              return;
            }

            setDraggingItemId(itemId);
          }}
        />
      ))}
    </>
  );
}
