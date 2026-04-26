export type PlannerPresetId = "ceremony" | "corporate" | "reception";
export type PlannerAssetCollection = "butterfly_companion" | "furniture" | "props";
export type PlannerAssetSubtype =
  | "all"
  | "butterfly_companion"
  | "chairs"
  | "decor"
  | "floor"
  | "service"
  | "seating"
  | "stage"
  | "tables"
  | "wall";
export type PlannerIconName =
  | "armchair"
  | "crown"
  | "flower"
  | "layout_grid"
  | "scan_search"
  | "sofa"
  | "sparkles"
  | "square_stack"
  | "ticket"
  | "waves";
export type PlannerItemCategory = "companion" | "decor" | "furniture";
export type PlannerPreviewMode = "2d" | "3d";
export type PlannerThreeDCameraMode = "perspective" | "top";
export type PlannerShape = "circle" | "rectangle";
export type PlannerVariantSelections = Record<string, string>;

export type PlannerModelConfig = {
  rotationOffset?: number;
  scaleMultiplier?: number;
};

export type PlannerItem = {
  bucketId: string;
  category: PlannerItemCategory;
  collection: PlannerAssetCollection;
  color: string;
  depth: number;
  fallbackModelFilename?: string;
  height: number;
  iconName: PlannerIconName;
  id: string;
  isActive: boolean;
  label: string;
  meshHeight: number;
  modelConfig: PlannerModelConfig | null;
  modelFilename?: string;
  modelStoragePath?: string;
  modelUrl?: string;
  note: string;
  shape: PlannerShape;
  sortOrder: number;
  subtype: Exclude<PlannerAssetSubtype, "all">;
  thumbnailFilename?: string;
  thumbnailStoragePath?: string;
  thumbnailUrl?: string;
  updatedAt?: string;
  width: number;
  zoneHint: string;
};

export type PlannerItemVariant = {
  bucketId: string;
  color?: string;
  depth?: number;
  description: string;
  fallbackModelFilename?: string;
  height?: number;
  id: string;
  isActive: boolean;
  itemId: string;
  label: string;
  meshHeight?: number;
  modelConfig: PlannerModelConfig | null;
  modelFilename?: string;
  modelStoragePath?: string;
  modelUrl?: string;
  shape?: PlannerShape;
  sortOrder: number;
  thumbnailFilename?: string;
  thumbnailStoragePath?: string;
  thumbnailUrl?: string;
  updatedAt?: string;
  width?: number;
};

export type PlannerPreset = {
  description: string;
  id: PlannerPresetId;
  label: string;
};

export type PlannerPlacedItem = {
  id: string;
  itemId: string;
  label: string;
  rotation: number;
  widthClass: string;
  x: number;
  y: number;
  zone: string;
};

export type PlannerPlacedItemsByPreset = Record<PlannerPresetId, PlannerPlacedItem[]>;
