import {
  type PlannerItem,
  type PlannerItemVariant,
  type PlannerShape,
  type PlannerVariantSelections,
} from "@/components/planner/planner-types";

export type PlannerResolvedVisual = Pick<
  PlannerItem,
  "color" | "depth" | "height" | "meshHeight" | "shape" | "width"
> & {
  label: string;
  modelConfig: PlannerItem["modelConfig"];
  variantDescription: string | null;
  variantId: string | null;
  variantLabel: string | null;
};

export function getPlannerItemVariants(
  _variantsByItemId: Record<string, PlannerItemVariant[]>,
  _itemId: string,
) {
  void _variantsByItemId;
  void _itemId;
  return [];
}

export function getDefaultPlannerVariantId(
  _variantsByItemId: Record<string, PlannerItemVariant[]>,
  _itemId: string,
) {
  void _variantsByItemId;
  void _itemId;
  return "";
}

export function createPlannerVariantSelections(
  _items: PlannerItem[],
  _variantsByItemId: Record<string, PlannerItemVariant[]>,
): PlannerVariantSelections {
  void _items;
  void _variantsByItemId;
  return {};
}

export function resolvePlannerItemVisual(
  item: PlannerItem,
  _variantsByItemId: Record<string, PlannerItemVariant[]>,
  _variantId: string | null | undefined,
): PlannerResolvedVisual {
  void _variantsByItemId;
  void _variantId;
  return {
    color: item.color,
    depth: item.depth,
    height: item.height,
    label: item.label,
    meshHeight: item.meshHeight,
    modelConfig: item.modelConfig ?? null,
    shape: item.shape as PlannerShape,
    variantDescription: null,
    variantId: null,
    variantLabel: null,
    width: item.width,
  };
}
