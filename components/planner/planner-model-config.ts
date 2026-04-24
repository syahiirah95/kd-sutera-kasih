import {
  getPlannerModelAssetUrl,
  type PlannerModelFilename,
} from "@/lib/constants/planner-assets";

export type PlannerModelConfig = {
  filename: PlannerModelFilename;
  rotationOffset?: number;
  scaleMultiplier?: number;
};

export const PLANNER_MODEL_CONFIG: Record<string, PlannerModelConfig> = {
  chair: {
    filename: "chair_banquet.glb",
    rotationOffset: 180,
    scaleMultiplier: 0.85,
  },
  "ornate-chair": {
    filename: "chair_ornate-armchair.glb",
    rotationOffset: 180,
    scaleMultiplier: 0.8,
  },
  floral: {
    filename: "flower-stand.glb",
    scaleMultiplier: 0.95,
  },
  pelamin: {
    filename: "pelamin_01.glb",
    rotationOffset: 180,
    scaleMultiplier: 1.08,
  },
  "photo-booth": {
    filename: "pelamin_02.glb",
    rotationOffset: 180,
    scaleMultiplier: 1.2,
  },
  "rect-table": {
    filename: "meja-beradab.glb",
    rotationOffset: 180,
    scaleMultiplier: 0.92,
  },
  registration: {
    filename: "meja-beradab.glb",
    rotationOffset: 180,
    scaleMultiplier: 0.8,
  },
  "round-table": {
    filename: "round-table-ten-chairs.glb",
    scaleMultiplier: 0.94,
  },
  stage: {
    filename: "stage.glb",
    rotationOffset: 180,
    scaleMultiplier: 1.08,
  },
  "vip-sofa": {
    filename: "chair_loveseat.glb",
    rotationOffset: 180,
    scaleMultiplier: 1.05,
  },
};

export function getPlannerModelUrl(itemId: string) {
  const config = PLANNER_MODEL_CONFIG[itemId];

  if (!config) {
    return null;
  }

  return getPlannerModelAssetUrl(config.filename);
}
