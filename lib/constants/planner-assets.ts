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
  return `/planner-assets/${filename}`;
}

export function getPlannerItemModelAssetUrl(itemId: string, variantId?: string, version?: string) {
  const searchParams = new URLSearchParams();
  if (variantId) {
    searchParams.set("variantId", variantId);
  }
  if (version) {
    searchParams.set("v", version);
  }
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";
  return `/api/media/planner-item-assets/${itemId}${suffix}`;
}
