import { type LucideIcon } from "lucide-react";

export type PlannerPresetId = "ceremony" | "corporate" | "reception";
export type PlannerItemCategory = "decor" | "furniture";
export type PlannerPreviewMode = "2d" | "3d";
export type PlannerThreeDCameraMode = "perspective" | "top";
export type PlannerShape = "circle" | "rectangle";
export type PlannerVariantSelections = Record<string, string>;

export type PlannerItem = {
  category: PlannerItemCategory;
  color: string;
  depth: number;
  height: number;
  icon: LucideIcon;
  id: string;
  label: string;
  meshHeight: number;
  note: string;
  shape: PlannerShape;
  width: number;
  zoneHint: string;
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
