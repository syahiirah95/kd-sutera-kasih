"use client";

import { useMemo } from "react";
import { Box3, Vector3 } from "three";
import { Clone, useGLTF } from "@react-three/drei";
import { HALL_DEPTH, HALL_WIDTH, mapPlannerXToWorld, mapPlannerYToWorld } from "@/components/planner/planner-constants";
import { resolvePlannerItemVisual } from "@/components/planner/planner-object-variants";
import { type PlannerItem, type PlannerItemVariant, type PlannerPlacedItem } from "@/components/planner/planner-types";
import {
  LOCAL_PLANNER_MODEL_FILENAMES,
  type PlannerModelFilename,
  getPlannerModelAssetUrl,
} from "@/lib/constants/planner-assets";

type PlannerObjectSize = {
  depth: number;
  height: number;
  width: number;
};

function getPlannerObjectSize(
  item: PlannerPlacedItem,
  items: PlannerItem[],
  variantsByItemId: Record<string, PlannerItemVariant[]>,
  selectedVariantId?: string,
) {
  const itemDef = items.find((entry) => entry.id === item.itemId);

  if (!itemDef) {
    return null;
  }

  const visual = resolvePlannerItemVisual(itemDef, variantsByItemId, selectedVariantId);

  return {
    def: itemDef,
    visual,
    size: {
      depth: (visual.depth / 100) * HALL_DEPTH,
      height: Math.max(visual.meshHeight * 0.1, 0.15),
      width: (visual.width / 100) * HALL_WIDTH,
    } satisfies PlannerObjectSize,
  };
}

function PlannerFallbackObject({
  size,
  visual,
}: Readonly<{
  size: PlannerObjectSize;
  visual: ReturnType<typeof resolvePlannerItemVisual>;
}>) {
  return (
    <mesh castShadow receiveShadow>
      {visual.shape === "circle" ? (
        <cylinderGeometry args={[size.width / 2, size.width / 2, size.height, 24]} />
      ) : (
        <boxGeometry args={[size.width, size.height, size.depth]} />
      )}
      <meshStandardMaterial color={visual.color} />
    </mesh>
  );
}

function PlannerModelObject({
  modelUrl,
  scaleMultiplier,
  size,
}: Readonly<{
  modelUrl: string;
  scaleMultiplier?: number;
  size: PlannerObjectSize;
}>) {
  const gltf = useGLTF(modelUrl);
  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(gltf.scene);
    const center = new Vector3();
    const sizeVector = new Vector3();

    box.getCenter(center);
    box.getSize(sizeVector);

    return {
      center,
      minY: box.min.y,
      size: new Vector3(
        Math.max(sizeVector.x, 0.001),
        Math.max(sizeVector.y, 0.001),
        Math.max(sizeVector.z, 0.001),
      ),
    };
  }, [gltf.scene]);

  const fitScale = Math.min(
    size.width / bounds.size.x,
    size.depth / bounds.size.z,
    (size.height * 2.4) / bounds.size.y,
  );
  const scale = fitScale * (scaleMultiplier ?? 1);

  return (
    <group scale={scale} dispose={null}>
      <group position={[-bounds.center.x, -bounds.minY, -bounds.center.z]}>
        <Clone object={gltf.scene} />
      </group>
    </group>
  );
}

function appendVersionToUrl(url: string, version?: string) {
  if (!version) {
    return url;
  }

  try {
    const resolvedUrl = new URL(url);
    resolvedUrl.searchParams.set("v", version);
    return resolvedUrl.toString();
  } catch {
    return url;
  }
}

type PlannerThreeDObjectProps = {
  canSelect: boolean;
  isSelected: boolean;
  item: PlannerPlacedItem;
  items: PlannerItem[];
  selectedVariantId?: string;
  variantsByItemId: Record<string, PlannerItemVariant[]>;
  onSelect: (itemId: string) => void;
  onStartDrag: (itemId: string) => void;
};

export function PlannerThreeDObject({
  canSelect,
  isSelected,
  item,
  items,
  selectedVariantId,
  variantsByItemId,
  onSelect,
  onStartDrag,
}: PlannerThreeDObjectProps) {
  const objectData = getPlannerObjectSize(item, items, variantsByItemId, selectedVariantId);

  if (!objectData) {
    return null;
  }

  const x = mapPlannerXToWorld(item.x);
  const z = mapPlannerYToWorld(item.y);
  const config = objectData.visual.modelConfig;
  const dbModelUrl = objectData.def.modelUrl
    ? appendVersionToUrl(objectData.def.modelUrl, objectData.def.updatedAt ?? objectData.def.modelStoragePath)
    : null;
  const fallbackModelFilename = objectData.def.fallbackModelFilename as PlannerModelFilename | undefined;
  const modelUrl = config
    ? dbModelUrl ?? (fallbackModelFilename
        ? getPlannerModelAssetUrl(fallbackModelFilename)
        : null)
    : null;
  const rotationY = -((item.rotation + (config?.rotationOffset ?? 0)) * Math.PI) / 180;

  return (
    <group
      position={[x, 0, z]}
      rotation={[0, rotationY, 0]}
      onClick={(event) => {
        if (!canSelect) {
          return;
        }

        event.stopPropagation();
        onSelect(item.id);
      }}
      onPointerDown={(event) => {
        if (!canSelect) {
          return;
        }

        event.stopPropagation();
        onSelect(item.id);
        onStartDrag(item.id);
      }}
    >
      {isSelected ? (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              Math.max(objectData.size.width, objectData.size.depth) * 0.42,
              Math.max(objectData.size.width, objectData.size.depth) * 0.56,
              48,
            ]}
          />
          <meshStandardMaterial color="#d49b6a" emissive="#d49b6a" emissiveIntensity={0.45} />
        </mesh>
      ) : null}
      {config && modelUrl ? (
        <PlannerModelObject
          modelUrl={modelUrl}
          scaleMultiplier={config.scaleMultiplier}
          size={objectData.size}
        />
      ) : (
        <group position={[0, objectData.size.height / 2, 0]}>
          <PlannerFallbackObject size={objectData.size} visual={objectData.visual} />
        </group>
      )}
    </group>
  );
}

LOCAL_PLANNER_MODEL_FILENAMES.forEach((filename) => {
  useGLTF.preload(getPlannerModelAssetUrl(filename));
});
