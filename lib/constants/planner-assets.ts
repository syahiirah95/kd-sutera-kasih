export const LOCAL_PLANNER_MODEL_FILENAMES = [
  "animated_butterfly.glb",
  "chair_banquet.glb",
  "chair_loveseat.glb",
  "chair_ornate-armchair.glb",
  "flower-stand.glb",
  "meja-beradab.glb",
  "pelamin_01.glb",
  "pelamin_02.glb",
  "round-table-ten-chairs.glb",
  "stage.glb",
] as const;

export type PlannerModelFilename = (typeof LOCAL_PLANNER_MODEL_FILENAMES)[number];

export function getPlannerModelAssetUrl(filename: PlannerModelFilename) {
  return `/api/media/planner-assets/${filename}`;
}
