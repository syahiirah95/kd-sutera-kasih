import {
  PLANNER_MODEL_CONFIG,
  type PlannerModelConfig,
} from "@/components/planner/planner-model-config";
import {
  type PlannerItem,
  type PlannerShape,
  type PlannerVariantSelections,
} from "@/components/planner/planner-types";

export type PlannerObjectVariant = {
  color?: string;
  depth?: number;
  description: string;
  height?: number;
  id: string;
  itemId: string;
  label: string;
  meshHeight?: number;
  modelConfig?: PlannerModelConfig | null;
  shape?: PlannerShape;
  width?: number;
};

export type PlannerResolvedVisual = Pick<
  PlannerItem,
  "color" | "depth" | "height" | "meshHeight" | "shape" | "width"
> & {
  label: string;
  modelConfig: PlannerModelConfig | null;
  variantDescription: string | null;
  variantId: string | null;
  variantLabel: string | null;
};

export const PLANNER_ITEM_VARIANTS: Record<string, PlannerObjectVariant[]> = {
  chair: [
    {
      description: "Standard banquet chair for guest seating.",
      id: "chair-banquet",
      itemId: "chair",
      label: "Banquet chair",
      modelConfig: PLANNER_MODEL_CONFIG.chair,
    },
    {
      color: "#b58ae0",
      description: "Premium armchair styling for VIP and photo moments.",
      height: 26,
      id: "chair-ornate",
      itemId: "chair",
      label: "Ornate armchair",
      meshHeight: 40,
      modelConfig: PLANNER_MODEL_CONFIG["ornate-chair"],
      shape: "rectangle",
      width: 26,
    },
  ],
  "ornate-chair": [
    {
      description: "Premium armchair styling for VIP and photo moments.",
      id: "ornate-chair-gold",
      itemId: "ornate-chair",
      label: "Ornate armchair",
      modelConfig: PLANNER_MODEL_CONFIG["ornate-chair"],
    },
    {
      color: "#94a3b8",
      description: "Simpler banquet chair if the premium chair is not needed.",
      height: 20,
      id: "ornate-chair-banquet",
      itemId: "ornate-chair",
      label: "Banquet chair",
      meshHeight: 28,
      modelConfig: PLANNER_MODEL_CONFIG.chair,
      shape: "circle",
      width: 20,
    },
  ],
  pelamin: [
    {
      description: "Main pelamin backdrop for ceremonies and receptions.",
      id: "pelamin-main",
      itemId: "pelamin",
      label: "Classic pelamin",
      modelConfig: PLANNER_MODEL_CONFIG.pelamin,
    },
    {
      description: "Arch-style setup that also works for photo corners.",
      id: "pelamin-arch",
      itemId: "pelamin",
      label: "Arch backdrop",
      modelConfig: PLANNER_MODEL_CONFIG["photo-booth"],
    },
  ],
  "photo-booth": [
    {
      description: "Arch-style portrait corner for guest photos.",
      id: "photo-booth-arch",
      itemId: "photo-booth",
      label: "Arch booth",
      modelConfig: PLANNER_MODEL_CONFIG["photo-booth"],
    },
    {
      description: "Pelamin-style backdrop for a stronger photo feature.",
      id: "photo-booth-pelamin",
      itemId: "photo-booth",
      label: "Pelamin booth",
      modelConfig: PLANNER_MODEL_CONFIG.pelamin,
    },
  ],
  "rect-table": [
    {
      description: "Long table for registration, buffet, or beradab setup.",
      id: "rect-table-beradab",
      itemId: "rect-table",
      label: "Meja beradab",
      modelConfig: PLANNER_MODEL_CONFIG["rect-table"],
    },
    {
      color: "#d6dee8",
      description: "Plain service table footprint for a cleaner operational layout.",
      id: "rect-table-service",
      itemId: "rect-table",
      label: "Service table",
      modelConfig: null,
    },
  ],
  registration: [
    {
      description: "Guest check-in desk near the entrance.",
      id: "registration-desk",
      itemId: "registration",
      label: "Registration desk",
      modelConfig: PLANNER_MODEL_CONFIG.registration,
    },
    {
      color: "#93c5fd",
      description: "Simpler counter block for compact setups.",
      id: "registration-counter",
      itemId: "registration",
      label: "Counter block",
      modelConfig: null,
    },
  ],
  "round-table": [
    {
      description: "Round dining table with ten guest chairs.",
      id: "round-table-ten",
      itemId: "round-table",
      label: "Round table 10 pax",
      modelConfig: PLANNER_MODEL_CONFIG["round-table"],
    },
    {
      color: "#d9c2a3",
      depth: 30,
      description: "Long beradab table style for family or featured dining.",
      height: 28,
      id: "round-table-beradab",
      itemId: "round-table",
      label: "Meja beradab",
      meshHeight: 20,
      modelConfig: PLANNER_MODEL_CONFIG["rect-table"],
      shape: "rectangle",
      width: 72,
    },
  ],
  "vip-sofa": [
    {
      description: "Loveseat model for VIP and family seating.",
      id: "vip-sofa-loveseat",
      itemId: "vip-sofa",
      label: "Loveseat sofa",
      modelConfig: PLANNER_MODEL_CONFIG["vip-sofa"],
    },
  ],
};

export function getPlannerItemVariants(itemId: string) {
  return PLANNER_ITEM_VARIANTS[itemId] ?? [];
}

export function getDefaultPlannerVariantId(itemId: string) {
  return getPlannerItemVariants(itemId)[0]?.id ?? "";
}

export function createPlannerVariantSelections(items: PlannerItem[]): PlannerVariantSelections {
  return items.reduce<PlannerVariantSelections>((selections, item) => {
    const defaultVariantId = getDefaultPlannerVariantId(item.id);

    if (defaultVariantId) {
      selections[item.id] = defaultVariantId;
    }

    return selections;
  }, {});
}

export function resolvePlannerItemVisual(
  item: PlannerItem,
  variantId: string | null | undefined,
): PlannerResolvedVisual {
  const variants = getPlannerItemVariants(item.id);
  const variant = variants.find((entry) => entry.id === variantId) ?? variants[0] ?? null;

  return {
    color: variant?.color ?? item.color,
    depth: variant?.depth ?? item.depth,
    height: variant?.height ?? item.height,
    label: variant?.label ?? item.label,
    meshHeight: variant?.meshHeight ?? item.meshHeight,
    modelConfig:
      variant?.modelConfig === null
        ? null
        : variant?.modelConfig ?? PLANNER_MODEL_CONFIG[item.id] ?? null,
    shape: variant?.shape ?? item.shape,
    variantDescription: variant?.description ?? null,
    variantId: variant?.id ?? null,
    variantLabel: variant?.label ?? null,
    width: variant?.width ?? item.width,
  };
}
