import {
  type PlannerAssetCollection,
  type PlannerAssetSubtype,
  type PlannerIconName,
  type PlannerItem,
  type PlannerItemCategory,
  type PlannerItemVariant,
  type PlannerPlacedItemsByPreset,
  type PlannerPreset,
  type PlannerShape,
} from "@/components/planner/planner-types";
import { type PlannerModelFilename } from "@/lib/constants/planner-assets";

const DEFAULT_BUCKET_ID = "kd_sutera_kasih_planner_assets";

type PlannerItemSeed = Omit<
  PlannerItem,
  | "bucketId"
  | "isActive"
  | "modelConfig"
  | "modelFilename"
  | "modelStoragePath"
  | "modelUrl"
  | "thumbnailFilename"
  | "thumbnailStoragePath"
  | "thumbnailUrl"
  | "updatedAt"
> & {
  modelRotationOffset?: number;
  modelScaleMultiplier?: number;
};

export const PLANNER_COLLECTION_OPTIONS: Array<{
  label: string;
  value: PlannerAssetCollection;
}> = [
  { label: "Furniture", value: "furniture" },
  { label: "Props", value: "props" },
  { label: "Butterfly Companion", value: "butterfly_companion" },
];

export const PLANNER_SUBTYPE_OPTIONS: Record<
  PlannerAssetCollection,
  Array<{ label: string; value: PlannerAssetSubtype }>
> = {
  butterfly_companion: [
    { label: "All butterfly companions", value: "all" },
    { label: "Butterfly companion", value: "butterfly_companion" },
  ],
  furniture: [
    { label: "All furniture", value: "all" },
    { label: "Stage", value: "stage" },
    { label: "Chairs", value: "chairs" },
    { label: "Tables", value: "tables" },
    { label: "Sofas & seating", value: "seating" },
    { label: "Counters & service", value: "service" },
  ],
  props: [
    { label: "All props", value: "all" },
    { label: "Wall props", value: "wall" },
    { label: "Floor props", value: "floor" },
    { label: "Decor props", value: "decor" },
  ],
};

export const PLANNER_CATEGORY_OPTIONS: Array<{
  label: string;
  value: PlannerItemCategory;
}> = [
  { label: "Furniture", value: "furniture" },
  { label: "Decor", value: "decor" },
  { label: "Companion", value: "companion" },
];

export const PLANNER_SHAPE_OPTIONS: Array<{
  label: string;
  value: PlannerShape;
}> = [
  { label: "Rectangle", value: "rectangle" },
  { label: "Circle", value: "circle" },
];

export const PLANNER_ICON_OPTIONS: Array<{
  label: string;
  value: PlannerIconName;
}> = [
  { label: "Square Stack", value: "square_stack" },
  { label: "Layout Grid", value: "layout_grid" },
  { label: "Armchair", value: "armchair" },
  { label: "Crown", value: "crown" },
  { label: "Sofa", value: "sofa" },
  { label: "Ticket", value: "ticket" },
  { label: "Waves", value: "waves" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Flower", value: "flower" },
  { label: "Scan Search", value: "scan_search" },
];

function createModelConfig(
  fallbackModelFilename?: string,
  modelStoragePath?: string,
  rotationOffset?: number,
  scaleMultiplier?: number,
) {
  if (!fallbackModelFilename && !modelStoragePath) {
    return null;
  }

  return {
    rotationOffset,
    scaleMultiplier,
  };
}

function createPlannerItem(seed: PlannerItemSeed): PlannerItem {
  return {
    ...seed,
    bucketId: DEFAULT_BUCKET_ID,
    isActive: true,
    modelConfig: createModelConfig(
      seed.fallbackModelFilename,
      undefined,
      seed.modelRotationOffset,
      seed.modelScaleMultiplier,
    ),
    modelFilename: undefined,
    modelStoragePath: undefined,
    modelUrl: undefined,
    thumbnailFilename: undefined,
    thumbnailStoragePath: undefined,
    thumbnailUrl: undefined,
    updatedAt: undefined,
  };
}

export const PLANNER_PRESETS: PlannerPreset[] = [
  {
    description: "Balanced dining layout with a clear aisle to the stage and front seating.",
    id: "reception",
    label: "Reception layout",
  },
  {
    description: "More open central floor for ceremony movement and family photo moments.",
    id: "ceremony",
    label: "Ceremony layout",
  },
  {
    description: "Presentation-focused layout for launches, briefings, and appreciation nights.",
    id: "corporate",
    label: "Corporate layout",
  },
] as const;

export const DEFAULT_PLANNER_ITEMS: PlannerItem[] = [
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#cbd5e1",
    depth: 50,
    fallbackModelFilename: "stage.glb",
    height: 48,
    iconName: "square_stack",
    id: "stage",
    label: "Stage",
    meshHeight: 16,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.08,
    note: "Use this as the focal point for ceremonies, speeches, or pelamin placement.",
    shape: "rectangle",
    sortOrder: 10,
    subtype: "stage",
    width: 92,
    zoneHint: "Main stage",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#e2e8f0",
    depth: 40,
    fallbackModelFilename: "round-table-ten-chairs.glb",
    height: 40,
    iconName: "layout_grid",
    id: "round-table",
    label: "Round Table",
    meshHeight: 24,
    modelScaleMultiplier: 0.94,
    note: "Best for dining zones and group seating throughout the hall.",
    shape: "circle",
    sortOrder: 20,
    subtype: "tables",
    width: 40,
    zoneHint: "Dining area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#e2e8f0",
    depth: 40,
    fallbackModelFilename: "round-table-ten-chairs.glb",
    height: 40,
    iconName: "layout_grid",
    id: "round-table-ten",
    label: "Round table 10 pax",
    meshHeight: 24,
    modelScaleMultiplier: 0.94,
    note: "Round dining table with ten guest chairs.",
    shape: "circle",
    sortOrder: 21,
    subtype: "tables",
    width: 40,
    zoneHint: "Dining area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#d9c2a3",
    depth: 30,
    fallbackModelFilename: "meja-beradab.glb",
    height: 28,
    iconName: "layout_grid",
    id: "round-table-beradab",
    label: "Meja beradab",
    meshHeight: 20,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.92,
    note: "Long beradab table style for family or featured dining.",
    shape: "rectangle",
    sortOrder: 22,
    subtype: "tables",
    width: 72,
    zoneHint: "Dining area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#e2e8f0",
    depth: 30,
    fallbackModelFilename: "meja-beradab.glb",
    height: 28,
    iconName: "layout_grid",
    id: "rect-table",
    label: "Rect Table",
    meshHeight: 20,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.92,
    note: "Useful for buffet lines, registration, or long presentation tables.",
    shape: "rectangle",
    sortOrder: 30,
    subtype: "tables",
    width: 72,
    zoneHint: "Service area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#e2e8f0",
    depth: 30,
    fallbackModelFilename: "meja-beradab.glb",
    height: 28,
    iconName: "layout_grid",
    id: "rect-table-beradab",
    label: "Meja beradab",
    meshHeight: 20,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.92,
    note: "Long table for registration, buffet, or beradab setup.",
    shape: "rectangle",
    sortOrder: 31,
    subtype: "tables",
    width: 72,
    zoneHint: "Service area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#d6dee8",
    depth: 30,
    height: 28,
    iconName: "layout_grid",
    id: "rect-table-service",
    label: "Service table",
    meshHeight: 20,
    note: "Plain service table footprint for a cleaner operational layout.",
    shape: "rectangle",
    sortOrder: 32,
    subtype: "tables",
    width: 72,
    zoneHint: "Service area",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#94a3b8",
    depth: 20,
    fallbackModelFilename: "chair_banquet.glb",
    height: 20,
    iconName: "armchair",
    id: "chair",
    label: "Chair",
    meshHeight: 28,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.85,
    note: "Adds focused seating near the stage or along the aisle.",
    shape: "circle",
    sortOrder: 40,
    subtype: "chairs",
    width: 20,
    zoneHint: "Guest seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#94a3b8",
    depth: 20,
    fallbackModelFilename: "chair_banquet.glb",
    height: 20,
    iconName: "armchair",
    id: "chair-banquet",
    label: "Banquet chair",
    meshHeight: 28,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.85,
    note: "Standard banquet chair for guest seating.",
    shape: "circle",
    sortOrder: 41,
    subtype: "chairs",
    width: 20,
    zoneHint: "Guest seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#b58ae0",
    depth: 20,
    fallbackModelFilename: "chair_ornate-armchair.glb",
    height: 26,
    iconName: "armchair",
    id: "chair-ornate",
    label: "Ornate armchair",
    meshHeight: 40,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.8,
    note: "Premium armchair styling for VIP and photo moments.",
    shape: "rectangle",
    sortOrder: 42,
    subtype: "chairs",
    width: 26,
    zoneHint: "Guest seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#b58ae0",
    depth: 26,
    fallbackModelFilename: "chair_ornate-armchair.glb",
    height: 26,
    iconName: "crown",
    id: "ornate-chair",
    label: "Ornate Chair",
    meshHeight: 40,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.8,
    note: "A premium accent chair for solemnisation, pelamin styling, or VIP photo moments.",
    shape: "rectangle",
    sortOrder: 50,
    subtype: "chairs",
    width: 26,
    zoneHint: "Premium seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#b58ae0",
    depth: 26,
    fallbackModelFilename: "chair_ornate-armchair.glb",
    height: 26,
    iconName: "crown",
    id: "ornate-chair-gold",
    label: "Ornate armchair",
    meshHeight: 40,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.8,
    note: "Premium armchair styling for VIP and photo moments.",
    shape: "rectangle",
    sortOrder: 51,
    subtype: "chairs",
    width: 26,
    zoneHint: "Premium seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#94a3b8",
    depth: 26,
    fallbackModelFilename: "chair_banquet.glb",
    height: 20,
    iconName: "crown",
    id: "ornate-chair-banquet",
    label: "Banquet chair",
    meshHeight: 28,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.85,
    note: "Simpler banquet chair if the premium chair is not needed.",
    shape: "circle",
    sortOrder: 52,
    subtype: "chairs",
    width: 20,
    zoneHint: "Premium seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#f87171",
    depth: 30,
    fallbackModelFilename: "chair_loveseat.glb",
    height: 28,
    iconName: "sofa",
    id: "vip-sofa",
    label: "VIP Sofa",
    meshHeight: 22,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.05,
    note: "Ideal for family or VVIP seating close to the main focus area.",
    shape: "rectangle",
    sortOrder: 60,
    subtype: "seating",
    width: 64,
    zoneHint: "Front seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#f87171",
    depth: 30,
    fallbackModelFilename: "chair_loveseat.glb",
    height: 28,
    iconName: "sofa",
    id: "vip-sofa-loveseat",
    label: "Loveseat sofa",
    meshHeight: 22,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.05,
    note: "Loveseat model for VIP and family seating.",
    shape: "rectangle",
    sortOrder: 61,
    subtype: "seating",
    width: 64,
    zoneHint: "Front seating",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#60a5fa",
    depth: 30,
    fallbackModelFilename: "meja-beradab.glb",
    height: 28,
    iconName: "ticket",
    id: "registration",
    label: "Registration",
    meshHeight: 20,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.8,
    note: "Helps define guest arrival and registration flow near the entrance.",
    shape: "rectangle",
    sortOrder: 70,
    subtype: "service",
    width: 60,
    zoneHint: "Entrance",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#60a5fa",
    depth: 30,
    fallbackModelFilename: "meja-beradab.glb",
    height: 28,
    iconName: "ticket",
    id: "registration-desk",
    label: "Registration desk",
    meshHeight: 20,
    modelRotationOffset: 180,
    modelScaleMultiplier: 0.8,
    note: "Guest check-in desk near the entrance.",
    shape: "rectangle",
    sortOrder: 71,
    subtype: "service",
    width: 60,
    zoneHint: "Entrance",
  }),
  createPlannerItem({
    category: "furniture",
    collection: "furniture",
    color: "#93c5fd",
    depth: 30,
    height: 28,
    iconName: "ticket",
    id: "registration-counter",
    label: "Counter block",
    meshHeight: 20,
    note: "Simpler counter block for compact setups.",
    shape: "rectangle",
    sortOrder: 72,
    subtype: "service",
    width: 60,
    zoneHint: "Entrance",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#ef4444",
    depth: 140,
    height: 120,
    iconName: "waves",
    id: "aisle",
    label: "Aisle Carpet",
    meshHeight: 1,
    note: "Creates a stronger processional path towards the stage or centre aisle.",
    shape: "rectangle",
    sortOrder: 80,
    subtype: "floor",
    width: 24,
    zoneHint: "Centre aisle",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#d9c2a3",
    depth: 62,
    fallbackModelFilename: "pelamin_01.glb",
    height: 36,
    iconName: "sparkles",
    id: "pelamin",
    label: "Pelamin",
    meshHeight: 56,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.08,
    note: "A decorative pelamin focal point for solemnisation and reception backdrops.",
    shape: "rectangle",
    sortOrder: 90,
    subtype: "wall",
    width: 74,
    zoneHint: "Main stage",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#d9c2a3",
    depth: 62,
    fallbackModelFilename: "pelamin_01.glb",
    height: 36,
    iconName: "sparkles",
    id: "pelamin-main",
    label: "Classic pelamin",
    meshHeight: 56,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.08,
    note: "Main pelamin backdrop for ceremonies and receptions.",
    shape: "rectangle",
    sortOrder: 91,
    subtype: "wall",
    width: 74,
    zoneHint: "Main stage",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#d9c2a3",
    depth: 62,
    fallbackModelFilename: "pelamin_02.glb",
    height: 36,
    iconName: "sparkles",
    id: "pelamin-arch",
    label: "Arch backdrop",
    meshHeight: 56,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.2,
    note: "Arch-style setup that also works for photo corners.",
    shape: "rectangle",
    sortOrder: 92,
    subtype: "wall",
    width: 74,
    zoneHint: "Main stage",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#34d399",
    depth: 24,
    fallbackModelFilename: "flower-stand.glb",
    height: 24,
    iconName: "flower",
    id: "floral",
    label: "Floral Stand",
    meshHeight: 42,
    modelScaleMultiplier: 0.95,
    note: "Works well for framing entrances, stages, and photo corners.",
    shape: "circle",
    sortOrder: 100,
    subtype: "decor",
    width: 24,
    zoneHint: "Decor points",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#c084fc",
    depth: 44,
    fallbackModelFilename: "pelamin_02.glb",
    height: 44,
    iconName: "scan_search",
    id: "photo-booth",
    label: "Photo Booth",
    meshHeight: 58,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.2,
    note: "Reserve a dedicated corner for guest portraits and event photography.",
    shape: "rectangle",
    sortOrder: 110,
    subtype: "wall",
    width: 50,
    zoneHint: "Photo corner",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#c084fc",
    depth: 44,
    fallbackModelFilename: "pelamin_02.glb",
    height: 44,
    iconName: "scan_search",
    id: "photo-booth-arch",
    label: "Arch booth",
    meshHeight: 58,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.2,
    note: "Arch-style portrait corner for guest photos.",
    shape: "rectangle",
    sortOrder: 111,
    subtype: "wall",
    width: 50,
    zoneHint: "Photo corner",
  }),
  createPlannerItem({
    category: "decor",
    collection: "props",
    color: "#c084fc",
    depth: 44,
    fallbackModelFilename: "pelamin_01.glb",
    height: 44,
    iconName: "scan_search",
    id: "photo-booth-pelamin",
    label: "Pelamin booth",
    meshHeight: 58,
    modelRotationOffset: 180,
    modelScaleMultiplier: 1.08,
    note: "Pelamin-style backdrop for a stronger photo feature.",
    shape: "rectangle",
    sortOrder: 112,
    subtype: "wall",
    width: 50,
    zoneHint: "Photo corner",
  }),
  createPlannerItem({
    category: "companion",
    collection: "butterfly_companion",
    color: "#f0c46c",
    depth: 14,
    fallbackModelFilename: "animated_butterfly.glb",
    height: 14,
    iconName: "sparkles",
    id: "butterfly-companion",
    label: "Butterfly Companion",
    meshHeight: 14,
    modelScaleMultiplier: 0.8,
    note: "A floating butterfly accent that adds soft motion and magical presence around focal spaces.",
    shape: "circle",
    sortOrder: 120,
    subtype: "butterfly_companion",
    width: 14,
    zoneHint: "Floating accent",
  }),
  createPlannerItem({
    category: "companion",
    collection: "butterfly_companion",
    color: "#f0c46c",
    depth: 14,
    fallbackModelFilename: "animated_butterfly.glb",
    height: 14,
    iconName: "sparkles",
    id: "butterfly-companion-golden",
    label: "Golden butterfly",
    meshHeight: 14,
    modelScaleMultiplier: 0.8,
    note: "Floating butterfly accent with a soft animated silhouette.",
    shape: "circle",
    sortOrder: 121,
    subtype: "butterfly_companion",
    width: 14,
    zoneHint: "Floating accent",
  }),
];

export const DEFAULT_PLANNER_VARIANTS: PlannerItemVariant[] = [];

export const PRESET_PLACED_ITEMS: PlannerPlacedItemsByPreset = {
  ceremony: [
    { id: "c-1", itemId: "pelamin", label: "Ceremony pelamin", rotation: 0, widthClass: "w-28", x: 67, y: 18, zone: "Main stage" },
    { id: "c-2", itemId: "aisle", label: "Main aisle", rotation: 0, widthClass: "w-10", x: 45, y: 42, zone: "Centre aisle" },
    { id: "c-3", itemId: "ornate-chair", label: "Ceremony accent chair", rotation: 0, widthClass: "w-24", x: 33, y: 24, zone: "Premium seating" },
    { id: "c-4", itemId: "floral", label: "Floral pair", rotation: 0, widthClass: "w-12", x: 73, y: 56, zone: "Decor points" },
    { id: "c-5", itemId: "butterfly-companion", label: "Floating butterfly", rotation: 0, widthClass: "w-8", x: 55, y: 30, zone: "Floating accent" },
  ],
  corporate: [
    { id: "corp-1", itemId: "stage", label: "Presentation stage", rotation: 0, widthClass: "w-28", x: 67, y: 18, zone: "Main stage" },
    { id: "corp-2", itemId: "rect-table", label: "Registration desk", rotation: 0, widthClass: "w-24", x: 17, y: 20, zone: "Entrance" },
    { id: "corp-3", itemId: "round-table", label: "Networking tables", rotation: 0, widthClass: "w-16", x: 33, y: 58, zone: "Dining area" },
    { id: "corp-4", itemId: "chair", label: "Audience seating", rotation: 0, widthClass: "w-10", x: 56, y: 44, zone: "Guest seating" },
  ],
  reception: [
    { id: "r-1", itemId: "pelamin", label: "Reception pelamin", rotation: 0, widthClass: "w-28", x: 67, y: 18, zone: "Main stage" },
    { id: "r-2", itemId: "round-table", label: "Main dining table", rotation: 0, widthClass: "w-16", x: 30, y: 58, zone: "Dining area" },
    { id: "r-3", itemId: "vip-sofa", label: "VIP family row", rotation: 0, widthClass: "w-24", x: 37, y: 26, zone: "Front seating" },
    { id: "r-4", itemId: "photo-booth", label: "Portrait corner", rotation: 0, widthClass: "w-20", x: 80, y: 58, zone: "Photo corner" },
    { id: "r-5", itemId: "registration", label: "Registration table", rotation: 0, widthClass: "w-24", x: 17, y: 18, zone: "Entrance" },
    { id: "r-6", itemId: "butterfly-companion", label: "Butterfly welcome accent", rotation: 0, widthClass: "w-8", x: 75, y: 24, zone: "Floating accent" },
  ],
};

export function getDefaultPlannerItemById(itemId: string) {
  return DEFAULT_PLANNER_ITEMS.find((item) => item.id === itemId) ?? null;
}

export function getDefaultPlannerVariantById(variantId: string) {
  return DEFAULT_PLANNER_VARIANTS.find((variant) => variant.id === variantId) ?? null;
}

export function groupPlannerVariantsByItemId(variants: PlannerItemVariant[]) {
  return variants.reduce<Record<string, PlannerItemVariant[]>>((groupedVariants, variant) => {
    if (!groupedVariants[variant.itemId]) {
      groupedVariants[variant.itemId] = [];
    }

    groupedVariants[variant.itemId]?.push(variant);
    groupedVariants[variant.itemId]?.sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
    return groupedVariants;
  }, {});
}

export function getFilteredPlannerItems(
  items: PlannerItem[],
  collection: PlannerAssetCollection,
  subtype: PlannerAssetSubtype,
) {
  return items.filter((item) => {
    if (item.collection !== collection) {
      return false;
    }

    return subtype === "all" ? true : item.subtype === subtype;
  });
}

export function getPlannerSubtypeLabel(
  collection: PlannerAssetCollection,
  subtype: Exclude<PlannerAssetSubtype, "all">,
) {
  return PLANNER_SUBTYPE_OPTIONS[collection].find((option) => option.value === subtype)?.label ?? subtype;
}

export function buildDefaultPlannerLibrary() {
  return {
    items: DEFAULT_PLANNER_ITEMS.map((item) => ({ ...item })),
    variantsByItemId: groupPlannerVariantsByItemId(DEFAULT_PLANNER_VARIANTS.map((variant) => ({ ...variant }))),
  };
}

export function resolvePlannerItemModelFilename(item: Pick<PlannerItem, "fallbackModelFilename">) {
  return item.fallbackModelFilename as PlannerModelFilename | undefined;
}

export function resolvePlannerVariantModelFilename(variant: Pick<PlannerItemVariant, "fallbackModelFilename">) {
  return variant.fallbackModelFilename as PlannerModelFilename | undefined;
}
