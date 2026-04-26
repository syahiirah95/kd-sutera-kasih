import { createSupabaseServerClient } from "@/lib/auth/server";
import {
  buildDefaultPlannerLibrary,
  getDefaultPlannerItemById,
  getDefaultPlannerVariantById,
} from "@/lib/planner/planner-library";
import {
  type PlannerAssetCollection,
  type PlannerAssetSubtype,
  type PlannerIconName,
  type PlannerItem,
  type PlannerItemCategory,
  type PlannerItemVariant,
  type PlannerShape,
} from "@/components/planner/planner-types";

type PlannerAssetRow = {
  bucket_id: string;
  category: PlannerItemCategory | null;
  color: string | null;
  depth: number | null;
  fallback_model_filename: string | null;
  height: number | null;
  icon_name: PlannerIconName | null;
  is_active: boolean;
  label: string;
  mesh_height: number | null;
  model_filename: string | null;
  model_public_url: string | null;
  model_rotation_offset: number | null;
  model_scale_multiplier: number | null;
  model_storage_path: string | null;
  note: string | null;
  planner_item_id: string;
  sort_order: number | null;
  subtype: Exclude<PlannerAssetSubtype, "all"> | null;
  thumbnail_filename: string | null;
  thumbnail_public_url: string | null;
  thumbnail_storage_path: string | null;
  updated_at: string;
  width: number | null;
  zone_hint: string | null;
  shape: PlannerShape | null;
  collection: PlannerAssetCollection | null;
};

type PlannerAssetVariantRow = {
  bucket_id: string;
  color: string | null;
  description: string;
  depth: number | null;
  fallback_model_filename: string | null;
  height: number | null;
  is_active: boolean;
  label: string;
  mesh_height: number | null;
  model_filename: string | null;
  model_public_url: string | null;
  model_rotation_offset: number | null;
  model_scale_multiplier: number | null;
  model_storage_path: string | null;
  planner_item_id: string;
  shape: PlannerShape | null;
  sort_order: number | null;
  thumbnail_filename: string | null;
  thumbnail_public_url: string | null;
  thumbnail_storage_path: string | null;
  updated_at: string;
  variant_id: string;
  width: number | null;
};

export type PlannerLibraryData = {
  items: PlannerItem[];
  variantsByItemId: Record<string, PlannerItemVariant[]>;
};

function getMediaUrl(
  bucketId: string,
  path: string | null,
  publicUrl: string | null,
  getPublicUrl: (bucketId: string, path: string) => string,
) {
  if (!path) {
    return undefined;
  }

  return publicUrl || getPublicUrl(bucketId, path);
}

function buildPlannerModelConfig(
  fallbackModelFilename?: string | null,
  modelStoragePath?: string | null,
  rotationOffset?: number | null,
  scaleMultiplier?: number | null,
) {
  if (!fallbackModelFilename && !modelStoragePath) {
    return null;
  }

  return {
    rotationOffset: rotationOffset ?? undefined,
    scaleMultiplier: scaleMultiplier ?? undefined,
  };
}

function mapPlannerAssetRow(
  row: PlannerAssetRow,
  getPublicUrl: (bucketId: string, path: string) => string,
): PlannerItem {
  const fallbackItem = getDefaultPlannerItemById(row.planner_item_id);

  return {
    bucketId: row.bucket_id,
    category: row.category ?? fallbackItem?.category ?? "decor",
    collection: row.collection ?? fallbackItem?.collection ?? "props",
    color: row.color ?? fallbackItem?.color ?? "#d9c2a3",
    depth: row.depth ?? fallbackItem?.depth ?? 24,
    fallbackModelFilename: row.fallback_model_filename ?? fallbackItem?.fallbackModelFilename ?? undefined,
    height: row.height ?? fallbackItem?.height ?? 24,
    iconName: row.icon_name ?? fallbackItem?.iconName ?? "layout_grid",
    id: row.planner_item_id,
    isActive: row.is_active,
    label: row.label,
    meshHeight: row.mesh_height ?? fallbackItem?.meshHeight ?? 12,
    modelConfig: buildPlannerModelConfig(
      row.fallback_model_filename ?? fallbackItem?.fallbackModelFilename,
      row.model_storage_path,
      row.model_rotation_offset,
      row.model_scale_multiplier,
    ),
    modelFilename: row.model_filename ?? undefined,
    modelStoragePath: row.model_storage_path ?? undefined,
    modelUrl: getMediaUrl(row.bucket_id, row.model_storage_path, row.model_public_url, getPublicUrl),
    note: row.note ?? fallbackItem?.note ?? "Planner asset.",
    shape: row.shape ?? fallbackItem?.shape ?? "rectangle",
    sortOrder: row.sort_order ?? fallbackItem?.sortOrder ?? 999,
    subtype: row.subtype ?? fallbackItem?.subtype ?? "decor",
    thumbnailFilename: row.thumbnail_filename ?? undefined,
    thumbnailStoragePath: row.thumbnail_storage_path ?? undefined,
    thumbnailUrl: getMediaUrl(
      row.bucket_id,
      row.thumbnail_storage_path,
      row.thumbnail_public_url,
      getPublicUrl,
    ),
    updatedAt: row.updated_at,
    width: row.width ?? fallbackItem?.width ?? 24,
    zoneHint: row.zone_hint ?? fallbackItem?.zoneHint ?? "Planner zone",
  };
}

function mapPlannerVariantRow(
  row: PlannerAssetVariantRow,
  getPublicUrl: (bucketId: string, path: string) => string,
): PlannerItemVariant {
  const fallbackVariant = getDefaultPlannerVariantById(row.variant_id);

  return {
    bucketId: row.bucket_id,
    color: row.color ?? fallbackVariant?.color ?? undefined,
    depth: row.depth ?? fallbackVariant?.depth ?? undefined,
    description: row.description,
    fallbackModelFilename:
      row.fallback_model_filename ?? fallbackVariant?.fallbackModelFilename ?? undefined,
    height: row.height ?? fallbackVariant?.height ?? undefined,
    id: row.variant_id,
    isActive: row.is_active,
    itemId: row.planner_item_id,
    label: row.label,
    meshHeight: row.mesh_height ?? fallbackVariant?.meshHeight ?? undefined,
    modelConfig: buildPlannerModelConfig(
      row.fallback_model_filename ?? fallbackVariant?.fallbackModelFilename,
      row.model_storage_path,
      row.model_rotation_offset,
      row.model_scale_multiplier,
    ),
    modelFilename: row.model_filename ?? undefined,
    modelStoragePath: row.model_storage_path ?? undefined,
    modelUrl: getMediaUrl(row.bucket_id, row.model_storage_path, row.model_public_url, getPublicUrl),
    shape: row.shape ?? fallbackVariant?.shape ?? undefined,
    sortOrder: row.sort_order ?? fallbackVariant?.sortOrder ?? 999,
    thumbnailFilename: row.thumbnail_filename ?? undefined,
    thumbnailStoragePath: row.thumbnail_storage_path ?? undefined,
    thumbnailUrl: getMediaUrl(
      row.bucket_id,
      row.thumbnail_storage_path,
      row.thumbnail_public_url,
      getPublicUrl,
    ),
    updatedAt: row.updated_at,
    width: row.width ?? fallbackVariant?.width ?? undefined,
  };
}

function sortPlannerItems(items: PlannerItem[]) {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
}

function sortPlannerVariantsByItemId(variantsByItemId: Record<string, PlannerItemVariant[]>) {
  return Object.fromEntries(
    Object.entries(variantsByItemId).map(([itemId, variants]) => [
      itemId,
      [...variants].sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label)),
    ]),
  );
}

export async function getPlannerLibraryData(options?: {
  includeInactive?: boolean;
}): Promise<PlannerLibraryData> {
  const includeInactive = options?.includeInactive ?? false;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const fallbackLibrary = buildDefaultPlannerLibrary();
    return includeInactive
      ? fallbackLibrary
      : {
          items: fallbackLibrary.items.filter((item) => item.isActive),
          variantsByItemId: fallbackLibrary.variantsByItemId,
        };
  }

  const itemQuery = supabase
    .from("kd_sutera_kasih_planner_assets")
    .select(
      "planner_item_id, label, bucket_id, collection, subtype, category, note, zone_hint, shape, color, width, depth, height, mesh_height, icon_name, sort_order, fallback_model_filename, model_storage_path, model_public_url, model_filename, model_rotation_offset, model_scale_multiplier, thumbnail_storage_path, thumbnail_public_url, thumbnail_filename, updated_at, is_active",
    )
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  const variantQuery = supabase
    .from("kd_sutera_kasih_planner_asset_variants")
    .select(
      "variant_id, planner_item_id, label, description, color, width, depth, height, mesh_height, shape, sort_order, fallback_model_filename, model_storage_path, model_public_url, model_filename, model_rotation_offset, model_scale_multiplier, thumbnail_storage_path, thumbnail_public_url, thumbnail_filename, updated_at, is_active, bucket_id",
    )
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (!includeInactive) {
    itemQuery.eq("is_active", true);
    variantQuery.eq("is_active", true);
  }

  const [{ data: itemData, error: itemError }, { data: variantData, error: variantError }] = await Promise.all([
    itemQuery,
    variantQuery,
  ]);

  if (itemError || variantError || !itemData) {
    const fallbackLibrary = buildDefaultPlannerLibrary();
    return includeInactive
      ? fallbackLibrary
      : {
          items: fallbackLibrary.items.filter((item) => item.isActive),
          variantsByItemId: fallbackLibrary.variantsByItemId,
        };
  }

  const getPublicUrl = (bucketId: string, path: string) =>
    supabase.storage.from(bucketId).getPublicUrl(path).data.publicUrl;

  const items = sortPlannerItems((itemData as PlannerAssetRow[]).map((row) => mapPlannerAssetRow(row, getPublicUrl)));
  const variantsByItemId = sortPlannerVariantsByItemId(
    (variantData as PlannerAssetVariantRow[] | null)?.reduce<Record<string, PlannerItemVariant[]>>(
      (groupedVariants, row) => {
        const variant = mapPlannerVariantRow(row, getPublicUrl);

        if (!groupedVariants[variant.itemId]) {
          groupedVariants[variant.itemId] = [];
        }

        groupedVariants[variant.itemId]?.push(variant);
        return groupedVariants;
      },
      {},
    ) ?? {},
  );

  return {
    items,
    variantsByItemId,
  };
}

export async function getPlannerAssetByItemId(itemId: string): Promise<PlannerItem | null> {
  const library = await getPlannerLibraryData({ includeInactive: true });
  return library.items.find((item) => item.id === itemId) ?? getDefaultPlannerItemById(itemId);
}

export async function getPlannerVariantById(variantId: string): Promise<PlannerItemVariant | null> {
  const library = await getPlannerLibraryData({ includeInactive: true });
  const variant = Object.values(library.variantsByItemId)
    .flat()
    .find((entry) => entry.id === variantId);

  return variant ?? getDefaultPlannerVariantById(variantId);
}
