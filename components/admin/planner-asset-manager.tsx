"use client";

import { memo, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Cuboid, ImagePlus, Layers3, LayoutGrid, PackageCheck, Pencil, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PlannerThreeDView } from "@/components/planner/planner-three-d-view";
import {
  type PlannerAssetCollection,
  type PlannerAssetSubtype,
  type PlannerItem,
  type PlannerItemCategory,
  type PlannerItemVariant,
  type PlannerPlacedItem,
  type PlannerShape,
} from "@/components/planner/planner-types";
import { ContextHelp } from "@/components/help/context-help";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/auth/client";
import {
  PLANNER_CATEGORY_OPTIONS,
  PLANNER_COLLECTION_OPTIONS,
  PLANNER_ICON_OPTIONS,
  PLANNER_SHAPE_OPTIONS,
  PLANNER_SUBTYPE_OPTIONS,
  getFilteredPlannerItems,
  getPlannerSubtypeLabel,
} from "@/lib/planner/planner-library";
import { type PlannerLibraryData } from "@/lib/supabase/planner-assets";

const ADMIN_UPLOAD_BUTTON_CLASS =
  "booking-form-nav-primary inline-flex !h-7 items-center justify-center !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-3 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";
const ADMIN_ACTION_BUTTON_CLASS = `${ADMIN_UPLOAD_BUTTON_CLASS} !w-[7.75rem]`;
const ADMIN_DELETE_BUTTON_CLASS =
  "booking-form-nav-primary inline-flex !h-7 !w-[7.75rem] items-center justify-center !rounded-lg !border !border-[#cc7a6c]/55 !bg-[linear-gradient(135deg,#d98a74_0%,#b64d43_52%,#ef9a87_100%)] !px-3 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(182,77,67,0.26)] hover:brightness-[1.03]";
const BUCKET_ID = "kd_sutera_kasih_planner_assets";
const ASSET_PANEL_CLASS =
  "relative flex min-w-0 h-full min-h-[21rem] flex-col overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]";
const ASSET_PREVIEW_SURFACE_CLASS =
  "flex-1 min-h-[240px] min-w-0 overflow-hidden rounded-[calc(var(--radius-sm)-0.2rem)] border border-border/70 bg-white shadow-[0_12px_30px_rgba(104,74,58,0.08)]";
const ASSET_PREVIEW_VIEWPORT_CLASS = "!h-full min-h-[240px]";
const SUMMARY_PILL_CLASS = "w-[7.75rem] justify-center text-center";
const ASSET_SECTION_HEADER_CLASS =
  "flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]";
const ASSET_SECTION_TITLE_CLASS = "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]";

type UploadKind = "model" | "thumbnail";
type UploadFiles = {
  model?: File;
  thumbnail?: File;
};

type MediaUploadResult = {
  filename: string;
  publicUrl: string;
  storagePath: string;
};

type AssetDraft = {
  category: PlannerItemCategory;
  collection: PlannerAssetCollection;
  color: string;
  depth: string;
  fallbackModelFilename: string;
  height: string;
  iconName: string;
  id: string;
  isActive: boolean;
  label: string;
  meshHeight: string;
  modelRotationOffset: string;
  modelScaleMultiplier: string;
  note: string;
  shape: PlannerShape;
  sortOrder: string;
  subtype: Exclude<PlannerAssetSubtype, "all">;
  width: string;
  zoneHint: string;
};

type VariantDraft = {
  color: string;
  depth: string;
  description: string;
  fallbackModelFilename: string;
  height: string;
  id: string;
  isActive: boolean;
  itemId: string;
  label: string;
  meshHeight: string;
  modelRotationOffset: string;
  modelScaleMultiplier: string;
  shape: PlannerShape;
  sortOrder: string;
  width: string;
};

function sanitizeFilename(filename: string) {
  const extension = filename.split(".").pop();
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${baseName || "planner-asset"}-${Date.now()}${extension ? `.${extension}` : ""}`;
}

function slugifyValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getStoragePath(itemId: string, kind: UploadKind, file: File, variantId?: string) {
  const filename = sanitizeFilename(file.name);
  return variantId
    ? `planner-assets/${itemId}/variants/${variantId}/${kind}/${filename}`
    : `planner-assets/${itemId}/${kind}/${filename}`;
}

function formatUpdatedAt(value?: string) {
  if (!value) {
    return "Not uploaded yet";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function createAssetPreviewItem(itemId: string): PlannerPlacedItem[] {
  return [
    {
      id: `preview-${itemId}`,
      itemId,
      label: `Preview ${itemId}`,
      rotation: 0,
      widthClass: "w-20",
      x: 50,
      y: 48,
      zone: "Preview zone",
    },
  ];
}

function createEmptyAssetDraft(collection: PlannerAssetCollection): AssetDraft {
  const defaultSubtype =
    (PLANNER_SUBTYPE_OPTIONS[collection].find((option) => option.value !== "all")?.value ??
      "decor") as Exclude<PlannerAssetSubtype, "all">;
  const defaultCategory: PlannerItemCategory =
    collection === "furniture" ? "furniture" : collection === "butterfly_companion" ? "companion" : "decor";

  return {
    category: defaultCategory,
    collection,
    color: collection === "butterfly_companion" ? "#f0c46c" : "#d9c2a3",
    depth: collection === "butterfly_companion" ? "14" : "24",
    fallbackModelFilename: "",
    height: collection === "butterfly_companion" ? "14" : "24",
    iconName: collection === "furniture" ? "layout_grid" : "sparkles",
    id: "",
    isActive: true,
    label: "",
    meshHeight: collection === "butterfly_companion" ? "14" : "24",
    modelRotationOffset: "",
    modelScaleMultiplier: "",
    note: "",
    shape: collection === "furniture" ? "rectangle" : "circle",
    sortOrder: "999",
    subtype: defaultSubtype,
    width: collection === "butterfly_companion" ? "14" : "24",
    zoneHint: "",
  };
}

function toAssetDraft(item: PlannerItem): AssetDraft {
  return {
    category: item.category,
    collection: item.collection,
    color: item.color,
    depth: String(item.depth),
    fallbackModelFilename: item.fallbackModelFilename ?? "",
    height: String(item.height),
    iconName: item.iconName,
    id: item.id,
    isActive: item.isActive,
    label: item.label,
    meshHeight: String(item.meshHeight),
    modelRotationOffset: item.modelConfig?.rotationOffset !== undefined ? String(item.modelConfig.rotationOffset) : "",
    modelScaleMultiplier: item.modelConfig?.scaleMultiplier !== undefined ? String(item.modelConfig.scaleMultiplier) : "",
    note: item.note,
    shape: item.shape,
    sortOrder: String(item.sortOrder),
    subtype: item.subtype,
    width: String(item.width),
    zoneHint: item.zoneHint,
  };
}

function createEmptyVariantDraft(itemId: string): VariantDraft {
  return {
    color: "",
    depth: "",
    description: "",
    fallbackModelFilename: "",
    height: "",
    id: "",
    isActive: true,
    itemId,
    label: "",
    meshHeight: "",
    modelRotationOffset: "",
    modelScaleMultiplier: "",
    shape: "rectangle",
    sortOrder: "999",
    width: "",
  };
}

function toVariantDraft(itemId: string, variant: PlannerItemVariant): VariantDraft {
  return {
    color: variant.color ?? "",
    depth: variant.depth !== undefined ? String(variant.depth) : "",
    description: variant.description,
    fallbackModelFilename: variant.fallbackModelFilename ?? "",
    height: variant.height !== undefined ? String(variant.height) : "",
    id: variant.id,
    isActive: variant.isActive,
    itemId,
    label: variant.label,
    meshHeight: variant.meshHeight !== undefined ? String(variant.meshHeight) : "",
    modelRotationOffset:
      variant.modelConfig?.rotationOffset !== undefined ? String(variant.modelConfig.rotationOffset) : "",
    modelScaleMultiplier:
      variant.modelConfig?.scaleMultiplier !== undefined ? String(variant.modelConfig.scaleMultiplier) : "",
    shape: variant.shape ?? "rectangle",
    sortOrder: String(variant.sortOrder),
    width: variant.width !== undefined ? String(variant.width) : "",
  };
}

function buildItemRecord(draft: AssetDraft, files?: UploadFiles): PlannerItem {
  const hasModel = Boolean(files?.model) || Boolean(draft.fallbackModelFilename);
  return {
    bucketId: BUCKET_ID,
    category: draft.category,
    collection: draft.collection,
    color: draft.color.trim() || "#d9c2a3",
    depth: Number.parseInt(draft.depth, 10) || 24,
    fallbackModelFilename: draft.fallbackModelFilename.trim() || undefined,
    height: Number.parseInt(draft.height, 10) || 24,
    iconName: draft.iconName as PlannerItem["iconName"],
    id: draft.id,
    isActive: draft.isActive,
    label: draft.label,
    meshHeight: Number.parseInt(draft.meshHeight, 10) || 12,
    modelConfig: hasModel
      ? {
          rotationOffset:
            draft.modelRotationOffset.trim() !== ""
              ? Number.parseFloat(draft.modelRotationOffset)
              : undefined,
          scaleMultiplier:
            draft.modelScaleMultiplier.trim() !== ""
              ? Number.parseFloat(draft.modelScaleMultiplier)
              : undefined,
        }
      : null,
    modelFilename: undefined,
    modelStoragePath: undefined,
    modelUrl: undefined,
    note: draft.note,
    shape: draft.shape,
    sortOrder: Number.parseInt(draft.sortOrder, 10) || 999,
    subtype: draft.subtype,
    thumbnailFilename: undefined,
    thumbnailStoragePath: undefined,
    thumbnailUrl: undefined,
    updatedAt: undefined,
    width: Number.parseInt(draft.width, 10) || 24,
    zoneHint: draft.zoneHint,
  };
}

function buildVariantRecord(draft: VariantDraft, files?: UploadFiles): PlannerItemVariant {
  const hasModel = Boolean(files?.model) || Boolean(draft.fallbackModelFilename);
  return {
    bucketId: BUCKET_ID,
    color: draft.color.trim() || undefined,
    depth: draft.depth.trim() !== "" ? Number.parseInt(draft.depth, 10) : undefined,
    description: draft.description,
    fallbackModelFilename: draft.fallbackModelFilename.trim() || undefined,
    height: draft.height.trim() !== "" ? Number.parseInt(draft.height, 10) : undefined,
    id: draft.id,
    isActive: draft.isActive,
    itemId: draft.itemId,
    label: draft.label,
    meshHeight: draft.meshHeight.trim() !== "" ? Number.parseInt(draft.meshHeight, 10) : undefined,
    modelConfig: hasModel
      ? {
          rotationOffset:
            draft.modelRotationOffset.trim() !== ""
              ? Number.parseFloat(draft.modelRotationOffset)
              : undefined,
          scaleMultiplier:
            draft.modelScaleMultiplier.trim() !== ""
              ? Number.parseFloat(draft.modelScaleMultiplier)
              : undefined,
        }
      : null,
    modelFilename: undefined,
    modelStoragePath: undefined,
    modelUrl: undefined,
    shape: draft.shape,
    sortOrder: Number.parseInt(draft.sortOrder, 10) || 999,
    thumbnailFilename: undefined,
    thumbnailStoragePath: undefined,
    thumbnailUrl: undefined,
    updatedAt: undefined,
    width: draft.width.trim() !== "" ? Number.parseInt(draft.width, 10) : undefined,
  };
}

function describeUploadedMedia(
  uploadedModel: MediaUploadResult | null,
  uploadedThumbnail: MediaUploadResult | null,
  subject: "asset" | "variant" = "asset",
) {
  if (uploadedModel && uploadedThumbnail) {
    return {
      message: `Model ${uploadedModel.filename} and thumbnail ${uploadedThumbnail.filename} were uploaded and linked to this ${subject}.`,
      title: "Model and thumbnail saved",
    };
  }

  if (uploadedModel) {
    return {
      message: `Model ${uploadedModel.filename} was uploaded and linked to this ${subject}.`,
      title: "Model saved",
    };
  }

  if (uploadedThumbnail) {
    return {
      message: `Thumbnail ${uploadedThumbnail.filename} was uploaded and linked to this ${subject}.`,
      title: "Thumbnail saved",
    };
  }

  return {
    message: `${subject === "asset" ? "Asset" : "Variant"} details were saved to the planner library.`,
    title: `${subject === "asset" ? "Asset" : "Variant"} saved`,
  };
}

function sortItems(items: PlannerItem[]) {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
}

function sortVariants(variants: PlannerItemVariant[]) {
  return [...variants].sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
}

function AdminAccordionSection({
  children,
  defaultOpen = false,
  icon,
  isLast = false,
  onOpenChange,
  open,
  summaryTrailing,
  title,
}: Readonly<{
  children: ReactNode;
  defaultOpen?: boolean;
  icon: ReactNode;
  isLast?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  summaryTrailing?: ReactNode;
  title: string;
}>) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  return (
    <details
      className={`group border-x border-t border-border/70 bg-white/35 ${isLast ? "border-b" : ""}`}
      open={isOpen}
    >
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground marker:hidden"
        onClick={(event) => {
          event.preventDefault();
          handleOpenChange(!isOpen);
        }}
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <div className="flex items-center gap-3">
          {summaryTrailing}
          <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
        </div>
      </summary>
      {isOpen ? <div className="border-t border-border/60 p-4">{children}</div> : null}
    </details>
  );
}

function FilePicker({
  accept,
  disabled,
  id,
  label,
  onChange,
}: Readonly<{
  accept: string;
  disabled: boolean;
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>) {
  return (
    <>
      <Label className={ADMIN_UPLOAD_BUTTON_CLASS} htmlFor={id}>
        {label}
      </Label>
      <Input
        accept={accept}
        className="sr-only"
        disabled={disabled}
        id={id}
        type="file"
        onChange={onChange}
      />
    </>
  );
}

function ThumbnailPreviewSurface({
  alt,
  file,
  src,
}: Readonly<{
  alt: string;
  file?: File;
  src?: string;
}>) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const resolvedSrc = objectUrl ?? src;

  if (!resolvedSrc) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center">
        <ImagePlus className="size-8 text-[#c9a27e]" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[240px]">
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes="(min-width: 1280px) 20vw, 80vw"
        src={resolvedSrc}
        unoptimized
      />
    </div>
  );
}

const AssetPreview3D = memo(function AssetPreview3D({
  cameraMode = "perspective",
  item,
  title = "3D Model Preview",
  variantId,
  variantsByItemId,
}: Readonly<{
  cameraMode?: "perspective" | "top";
  item: PlannerItem;
  title?: string;
  variantId?: string;
  variantsByItemId: Record<string, PlannerItemVariant[]>;
}>) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const placedItems = useMemo(() => createAssetPreviewItem(item.id), [item.id]);
  const SectionIcon = cameraMode === "top" ? LayoutGrid : Cuboid;
  const previewItems = useMemo(() => [item], [item]);
  const previewVariantsByItemId = useMemo(
    () => ({
      [item.id]: variantsByItemId[item.id] ?? [],
    }),
    [item.id, variantsByItemId],
  );
  const selectedVariantIdsByItemId = useMemo(
    () => (variantId ? { [item.id]: variantId } : {}),
    [item.id, variantId],
  );

  useEffect(() => {
    const node = surfaceRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      {
        rootMargin: "240px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={ASSET_SECTION_TITLE_CLASS}>
        <SectionIcon className="size-4 text-primary" />
        <span>{title}</span>
      </div>
      <div className={ASSET_PANEL_CLASS}>
        <div className={ASSET_PREVIEW_SURFACE_CLASS} ref={surfaceRef}>
          {isVisible ? (
            <div className="pointer-events-none h-full min-h-[240px]">
              <PlannerThreeDView
                activeItem={null}
                cameraModeOverride={cameraMode}
                compact
                disableControls
                hideToolbar
                isEditMode={false}
                isMoveMode={false}
                items={previewItems}
                lowPower
                placedItems={placedItems}
                selectedPlacedItemId={null}
                selectedVariantIdsByItemId={selectedVariantIdsByItemId}
                variantsByItemId={previewVariantsByItemId}
                viewportClassName={ASSET_PREVIEW_VIEWPORT_CLASS}
                onCanvasAction={() => {}}
                onCanvasSelect={() => {}}
                onClearSelection={() => {}}
                onCopy={() => {}}
                onDelete={() => {}}
                onEditModeToggle={() => {}}
                onItemMove={() => {}}
                onMoveMode={() => {}}
                onResetLayout={() => {}}
                onRotateLeft={() => {}}
                onRotateRight={() => {}}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center text-xs text-muted-foreground">
              Preparing preview...
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
              {cameraMode === "top" ? "2D Layout" : "3D Layout"}
            </p>
            <p className="text-xs text-muted-foreground">
              Live planner preview for {item.label}.
            </p>
          </div>
          <Badge>Preview</Badge>
        </div>
      </div>
    </>
  );
});

function MetadataField({
  children,
  label,
}: Readonly<{
  children: ReactNode;
  label: string;
}>) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[11px]">{label}</Label>
      {children}
    </div>
  );
}

function FieldInput({
  className = "",
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={`h-10 rounded-lg border-[#c9a27e]/45 bg-white/80 px-3 text-sm font-medium text-[#5f3f2f] ${className}`}
    />
  );
}

function FieldTextArea(props: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className="min-h-[88px] rounded-lg border-[#c9a27e]/45 bg-white/80 px-3 py-2 text-sm font-medium text-[#5f3f2f]"
    />
  );
}

function FieldSelect({
  children,
  ...props
}: React.ComponentProps<typeof Select>) {
  return (
    <Select
      {...props}
      className="h-10 rounded-lg border-[#c9a27e]/45 bg-white/80 px-3 text-sm font-medium text-[#5f3f2f]"
    >
      {children}
    </Select>
  );
}

export function PlannerAssetManager({
  initialLibrary,
}: Readonly<{
  initialLibrary: PlannerLibraryData;
}>) {
  const router = useRouter();
  const { toast } = useToast();
  const variantModeEnabled = false;
  const [items, setItems] = useState(() => sortItems(initialLibrary.items));
  const [variantsByItemId, setVariantsByItemId] = useState(initialLibrary.variantsByItemId);
  const [itemUploadFiles, setItemUploadFiles] = useState<Record<string, UploadFiles>>({});
  const [variantUploadFiles, setVariantUploadFiles] = useState<Record<string, UploadFiles>>({});
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<PlannerAssetCollection>("furniture");
  const [selectedSubtype, setSelectedSubtype] = useState<PlannerAssetSubtype>("all");
  const [isFilterSectionOpen, setIsFilterSectionOpen] = useState(true);
  const [showAssetComposer, setShowAssetComposer] = useState(false);
  const [assetMetadataDialogItemId, setAssetMetadataDialogItemId] = useState<string | null>(null);
  const [assetComposer, setAssetComposer] = useState<AssetDraft>(() => createEmptyAssetDraft("furniture"));
  const [assetComposerFiles, setAssetComposerFiles] = useState<UploadFiles>({});
  const [activeVariantComposerSubtype, setActiveVariantComposerSubtype] = useState<string | null>(null);
  const [variantComposer, setVariantComposer] = useState<VariantDraft>(() => createEmptyVariantDraft(""));
  const [variantComposerFiles, setVariantComposerFiles] = useState<UploadFiles>({});

  const filteredItems = useMemo(
    () => getFilteredPlannerItems(items, selectedCollection, selectedSubtype),
    [items, selectedCollection, selectedSubtype],
  );
  const groupedItems = useMemo(() => {
    const groups = new Map<
      Exclude<PlannerAssetSubtype, "all">,
      {
        items: PlannerItem[];
        label: string;
        subtype: Exclude<PlannerAssetSubtype, "all">;
      }
    >();

    filteredItems.forEach((item) => {
      const existingGroup = groups.get(item.subtype);

      if (existingGroup) {
        existingGroup.items.push(item);
        return;
      }

      groups.set(item.subtype, {
        items: [item],
        label: getPlannerSubtypeLabel(selectedCollection, item.subtype),
        subtype: item.subtype,
      });
    });

    return Array.from(groups.values());
  }, [filteredItems, selectedCollection]);

  function syncItem(nextItem: PlannerItem) {
    setItems((currentItems) => {
      const existing = currentItems.some((item) => item.id === nextItem.id);
      const nextItems = existing
        ? currentItems.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...currentItems, nextItem];

      return sortItems(nextItems);
    });
  }

  function syncVariant(nextVariant: PlannerItemVariant) {
    setVariantsByItemId((currentVariants) => ({
      ...currentVariants,
      [nextVariant.itemId]: sortVariants(
        currentVariants[nextVariant.itemId]?.some((variant) => variant.id === nextVariant.id)
          ? (currentVariants[nextVariant.itemId] ?? []).map((variant) =>
              variant.id === nextVariant.id ? nextVariant : variant,
            )
          : [...(currentVariants[nextVariant.itemId] ?? []), nextVariant],
      ),
    }));
  }

  function updateItemDraft(itemId: string, patch: Partial<PlannerItem>) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  function updateVariantDraft(itemId: string, variantId: string, patch: Partial<PlannerItemVariant>) {
    setVariantsByItemId((currentVariants) => ({
      ...currentVariants,
      [itemId]: (currentVariants[itemId] ?? []).map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              ...patch,
            }
          : variant,
      ),
    }));
  }

  function updateAssetComposer<K extends keyof AssetDraft>(key: K, value: AssetDraft[K]) {
    setAssetComposer((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function updateVariantComposer<K extends keyof VariantDraft>(key: K, value: VariantDraft[K]) {
    setVariantComposer((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function applyCollectionAndSubtype(collection: PlannerAssetCollection, subtype: PlannerAssetSubtype) {
    setSelectedCollection(collection);
    setSelectedSubtype(subtype);
    setAssetComposer((currentDraft) => ({
      ...currentDraft,
      collection,
      subtype:
        (PLANNER_SUBTYPE_OPTIONS[collection].find((option) => option.value !== "all")?.value ??
          currentDraft.subtype) as Exclude<PlannerAssetSubtype, "all">,
      category:
        collection === "furniture"
          ? "furniture"
          : collection === "butterfly_companion"
            ? "companion"
            : "decor",
    }));
  }

  async function uploadFileToStorage(
    itemId: string,
    file: File | undefined,
    kind: UploadKind,
    variantId?: string,
  ): Promise<MediaUploadResult | null> {
    if (!file) {
      return null;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const storagePath = getStoragePath(itemId, kind, file, variantId);
    const { error } = await supabase.storage.from(BUCKET_ID).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      throw error;
    }

    const publicUrl = supabase.storage.from(BUCKET_ID).getPublicUrl(storagePath).data.publicUrl;

    return {
      filename: file.name,
      publicUrl,
      storagePath,
    };
  }

  async function saveAsset(draft: AssetDraft, files?: UploadFiles) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      toast({
        message: "Supabase is not configured, so planner assets cannot be saved yet.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const resolvedId = slugifyValue(draft.id || draft.label);
    if (!resolvedId || !draft.label.trim()) {
      toast({
        message: "Asset ID and label are required.",
        title: "Missing info",
        variant: "error",
      });
      return;
    }

    setIsWorking(true);
    setMessage("");

    try {
      const currentItem = items.find((item) => item.id === draft.id || item.id === resolvedId);
      const uploadedModel = await uploadFileToStorage(resolvedId, files?.model, "model");
      const uploadedThumbnail = await uploadFileToStorage(resolvedId, files?.thumbnail, "thumbnail");
      const payload = {
        planner_item_id: resolvedId,
        label: draft.label.trim(),
        bucket_id: BUCKET_ID,
        collection: draft.collection,
        subtype: draft.subtype,
        category: draft.category,
        note: draft.note.trim() || null,
        zone_hint: draft.zoneHint.trim() || null,
        shape: draft.shape,
        color: draft.color.trim() || "#d9c2a3",
        width: Number.parseInt(draft.width, 10) || 24,
        depth: Number.parseInt(draft.depth, 10) || 24,
        height: Number.parseInt(draft.height, 10) || 24,
        mesh_height: Number.parseInt(draft.meshHeight, 10) || 12,
        icon_name: draft.iconName,
        sort_order: Number.parseInt(draft.sortOrder, 10) || 999,
        fallback_model_filename: draft.fallbackModelFilename.trim() || null,
        model_rotation_offset:
          draft.modelRotationOffset.trim() !== "" ? Number.parseFloat(draft.modelRotationOffset) : null,
        model_scale_multiplier:
          draft.modelScaleMultiplier.trim() !== "" ? Number.parseFloat(draft.modelScaleMultiplier) : null,
        model_storage_path: uploadedModel?.storagePath ?? currentItem?.modelStoragePath ?? null,
        model_public_url: uploadedModel?.publicUrl ?? currentItem?.modelUrl ?? null,
        model_filename: uploadedModel?.filename ?? currentItem?.modelFilename ?? null,
        thumbnail_storage_path: uploadedThumbnail?.storagePath ?? currentItem?.thumbnailStoragePath ?? null,
        thumbnail_public_url: uploadedThumbnail?.publicUrl ?? currentItem?.thumbnailUrl ?? null,
        thumbnail_filename: uploadedThumbnail?.filename ?? currentItem?.thumbnailFilename ?? null,
        is_active: draft.isActive,
      };

      const { error } = await supabase
        .from("kd_sutera_kasih_planner_assets")
        .upsert(payload, { onConflict: "planner_item_id" });

      if (error) {
        throw error;
      }

      const nextItem = {
        ...(currentItem ?? buildItemRecord({ ...draft, id: resolvedId }, files)),
        ...buildItemRecord({ ...draft, id: resolvedId }, files),
        id: resolvedId,
        modelFilename: uploadedModel?.filename ?? currentItem?.modelFilename,
        modelStoragePath: uploadedModel?.storagePath ?? currentItem?.modelStoragePath,
        modelUrl: uploadedModel?.publicUrl ?? currentItem?.modelUrl,
        thumbnailFilename: uploadedThumbnail?.filename ?? currentItem?.thumbnailFilename,
        thumbnailStoragePath: uploadedThumbnail?.storagePath ?? currentItem?.thumbnailStoragePath,
        thumbnailUrl: uploadedThumbnail?.publicUrl ?? currentItem?.thumbnailUrl,
        updatedAt: new Date().toISOString(),
      } satisfies PlannerItem;

      syncItem(nextItem);
      setItemUploadFiles((currentFiles) => {
        const nextFiles = { ...currentFiles };
        delete nextFiles[resolvedId];
        if (draft.id !== resolvedId) {
          delete nextFiles[draft.id];
        }
        return nextFiles;
      });
      setMessage(`${draft.label} saved to planner asset library.`);
      const successToast = describeUploadedMedia(uploadedModel, uploadedThumbnail, "asset");
      toast({
        message: successToast.message,
        title: successToast.title,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Planner asset could not be saved.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function deleteAsset(item: PlannerItem) {
    const confirmed = window.confirm(`Delete ${item.label} from the planner asset library?`);
    if (!confirmed) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      toast({
        message: "Supabase is not configured, so planner assets cannot be deleted yet.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsWorking(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("kd_sutera_kasih_planner_assets")
        .delete()
        .eq("planner_item_id", item.id);

      if (error) {
        throw error;
      }

      const removablePaths = [item.modelStoragePath, item.thumbnailStoragePath].filter(
        (path): path is string => Boolean(path),
      );

      if (removablePaths.length > 0) {
        await supabase.storage.from(BUCKET_ID).remove(removablePaths);
      }

      setItems((currentItems) => currentItems.filter((entry) => entry.id !== item.id));
      setItemUploadFiles((currentFiles) => {
        const nextFiles = { ...currentFiles };
        delete nextFiles[item.id];
        return nextFiles;
      });
      setAssetMetadataDialogItemId(null);
      setMessage(`${item.label} deleted from planner asset library.`);
      toast({
        message: `${item.label} has been removed from the planner database.`,
        title: "Asset deleted",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Planner asset could not be deleted.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function saveVariant(draft: VariantDraft, files?: UploadFiles) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      toast({
        message: "Supabase is not configured, so planner variants cannot be saved yet.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const resolvedId = slugifyValue(draft.id || draft.label);
    if (!resolvedId || !draft.itemId || !draft.label.trim()) {
      toast({
        message: "Variant ID, asset, and label are required.",
        title: "Missing info",
        variant: "error",
      });
      return;
    }

    setIsWorking(true);
    setMessage("");

    try {
      const currentVariant = (variantsByItemId[draft.itemId] ?? []).find(
        (variant) => variant.id === draft.id || variant.id === resolvedId,
      );
      const uploadedModel = await uploadFileToStorage(draft.itemId, files?.model, "model", resolvedId);
      const uploadedThumbnail = await uploadFileToStorage(draft.itemId, files?.thumbnail, "thumbnail", resolvedId);
      const payload = {
        variant_id: resolvedId,
        planner_item_id: draft.itemId,
        label: draft.label.trim(),
        description: draft.description.trim() || "",
        bucket_id: BUCKET_ID,
        color: draft.color.trim() || null,
        width: draft.width.trim() !== "" ? Number.parseInt(draft.width, 10) : null,
        depth: draft.depth.trim() !== "" ? Number.parseInt(draft.depth, 10) : null,
        height: draft.height.trim() !== "" ? Number.parseInt(draft.height, 10) : null,
        mesh_height: draft.meshHeight.trim() !== "" ? Number.parseInt(draft.meshHeight, 10) : null,
        shape: draft.shape,
        sort_order: Number.parseInt(draft.sortOrder, 10) || 999,
        fallback_model_filename: draft.fallbackModelFilename.trim() || null,
        model_rotation_offset:
          draft.modelRotationOffset.trim() !== "" ? Number.parseFloat(draft.modelRotationOffset) : null,
        model_scale_multiplier:
          draft.modelScaleMultiplier.trim() !== "" ? Number.parseFloat(draft.modelScaleMultiplier) : null,
        model_storage_path: uploadedModel?.storagePath ?? currentVariant?.modelStoragePath ?? null,
        model_public_url: uploadedModel?.publicUrl ?? currentVariant?.modelUrl ?? null,
        model_filename: uploadedModel?.filename ?? currentVariant?.modelFilename ?? null,
        thumbnail_storage_path: uploadedThumbnail?.storagePath ?? currentVariant?.thumbnailStoragePath ?? null,
        thumbnail_public_url: uploadedThumbnail?.publicUrl ?? currentVariant?.thumbnailUrl ?? null,
        thumbnail_filename: uploadedThumbnail?.filename ?? currentVariant?.thumbnailFilename ?? null,
        is_active: draft.isActive,
      };

      const { error } = await supabase
        .from("kd_sutera_kasih_planner_asset_variants")
        .upsert(payload, { onConflict: "variant_id" });

      if (error) {
        throw error;
      }

      const nextVariant = {
        ...(currentVariant ?? buildVariantRecord({ ...draft, id: resolvedId }, files)),
        ...buildVariantRecord({ ...draft, id: resolvedId }, files),
        id: resolvedId,
        modelFilename: uploadedModel?.filename ?? currentVariant?.modelFilename,
        modelStoragePath: uploadedModel?.storagePath ?? currentVariant?.modelStoragePath,
        modelUrl: uploadedModel?.publicUrl ?? currentVariant?.modelUrl,
        thumbnailFilename: uploadedThumbnail?.filename ?? currentVariant?.thumbnailFilename,
        thumbnailStoragePath: uploadedThumbnail?.storagePath ?? currentVariant?.thumbnailStoragePath,
        thumbnailUrl: uploadedThumbnail?.publicUrl ?? currentVariant?.thumbnailUrl,
        updatedAt: new Date().toISOString(),
      } satisfies PlannerItemVariant;

      syncVariant(nextVariant);
      setVariantUploadFiles((currentFiles) => {
        const nextFiles = { ...currentFiles };
        delete nextFiles[resolvedId];
        if (draft.id !== resolvedId) {
          delete nextFiles[draft.id];
        }
        return nextFiles;
      });
      setMessage(`${draft.label} variant saved.`);
      const successToast = describeUploadedMedia(uploadedModel, uploadedThumbnail, "variant");
      toast({
        message: successToast.message,
        title: successToast.title,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Planner variant could not be saved.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleItemMediaSelection(item: PlannerItem, kind: UploadKind, file?: File) {
    if (!file) {
      return;
    }

    const nextFiles = {
      ...(itemUploadFiles[item.id] ?? {}),
      [kind]: file,
    } satisfies UploadFiles;

    setItemUploadFiles((currentFiles) => ({
      ...currentFiles,
      [item.id]: nextFiles,
    }));

    toast({
      message: `${kind === "model" ? "Model" : "Thumbnail"} ${file.name} is uploading now.`,
      title: "Uploading media",
      variant: "info",
    });

    await saveAsset(toAssetDraft(item), nextFiles);
  }

  async function handleVariantMediaSelection(
    itemId: string,
    variant: PlannerItemVariant,
    kind: UploadKind,
    file?: File,
  ) {
    if (!file) {
      return;
    }

    const nextFiles = {
      ...(variantUploadFiles[variant.id] ?? {}),
      [kind]: file,
    } satisfies UploadFiles;

    setVariantUploadFiles((currentFiles) => ({
      ...currentFiles,
      [variant.id]: nextFiles,
    }));

    toast({
      message: `${kind === "model" ? "Model" : "Thumbnail"} ${file.name} is uploading now.`,
      title: "Uploading variant media",
      variant: "info",
    });

    await saveVariant(toVariantDraft(itemId, variant), nextFiles);
  }

  const totalVariantCount = useMemo(
    () => Object.values(variantsByItemId).reduce((count, variants) => count + variants.length, 0),
    [variantsByItemId],
  );

  return (
    <Card className="rounded-[var(--radius-sm)]">
      <CardHeader className="border-b border-border/70 px-5 py-4">
        <CardTitle className="flex items-center gap-2 font-display text-2xl">
          <PackageCheck className="size-5 text-primary" />
          <span data-butterfly-anchor="section">Planner Asset Library</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid gap-2 px-5 py-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Manage planner assets, thumbnails, GLB models, and butterfly companion items from one linked library backed by Supabase tables and storage.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge>{items.length} assets</Badge>
            {variantModeEnabled ? <Badge>{totalVariantCount} variants</Badge> : null}
            <Badge>DB linked</Badge>
          </div>
          {message ? <p className="text-xs font-semibold text-[#8d542d]">{message}</p> : null}
        </div>

        <div>
          <AdminAccordionSection
            defaultOpen
            icon={<PackageCheck className="size-4 text-primary" />}
            onOpenChange={setIsFilterSectionOpen}
            open={isFilterSectionOpen}
            summaryTrailing={
              <Button
                className={ADMIN_ACTION_BUTTON_CLASS}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsFilterSectionOpen(true);
                  setShowAssetComposer((current) => !current);
                }}
              >
                Add Asset
              </Button>
            }
            title="Asset Filters"
          >
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <MetadataField label="Asset collection">
                  <FieldSelect
                    id="planner-asset-group"
                    value={selectedCollection}
                    onChange={(event) =>
                      applyCollectionAndSubtype(event.target.value as PlannerAssetCollection, "all")
                    }
                  >
                    {PLANNER_COLLECTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                </MetadataField>

                <MetadataField label="Asset type">
                  <FieldSelect
                    id="planner-asset-subtype"
                    value={selectedSubtype}
                    onChange={(event) =>
                      setSelectedSubtype(event.target.value as PlannerAssetSubtype)
                    }
                  >
                    {PLANNER_SUBTYPE_OPTIONS[selectedCollection].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                </MetadataField>
              </div>

              {showAssetComposer ? (
                <div className="rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">New Planner Asset</p>
                      <p className="text-xs text-muted-foreground">Create a DB record first, then save model and thumbnail into storage together.</p>
                    </div>
                    <Button
                      className={ADMIN_ACTION_BUTTON_CLASS}
                      disabled={isWorking}
                      type="button"
                      onClick={() => void saveAsset(assetComposer, assetComposerFiles)}
                    >
                      <Save className="mr-1 size-3.5" />
                      Save Asset
                    </Button>
                  </div>

                  <div className="grid gap-3 xl:grid-cols-4">
                    <MetadataField label="Asset ID">
                      <FieldInput
                        placeholder="e.g. butterfly-companion"
                        value={assetComposer.id}
                        onChange={(event) => updateAssetComposer("id", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Label">
                      <FieldInput
                        placeholder="Asset label"
                        value={assetComposer.label}
                        onChange={(event) => updateAssetComposer("label", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Collection">
                      <FieldSelect
                        value={assetComposer.collection}
                        onChange={(event) => {
                          const nextCollection = event.target.value as PlannerAssetCollection;
                          updateAssetComposer("collection", nextCollection);
                          updateAssetComposer(
                            "subtype",
                            (PLANNER_SUBTYPE_OPTIONS[nextCollection].find((option) => option.value !== "all")
                              ?.value ?? assetComposer.subtype) as Exclude<PlannerAssetSubtype, "all">,
                          );
                          updateAssetComposer(
                            "category",
                            nextCollection === "furniture"
                              ? "furniture"
                              : nextCollection === "butterfly_companion"
                                ? "companion"
                                : "decor",
                          );
                        }}
                      >
                        {PLANNER_COLLECTION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Asset type">
                      <FieldSelect
                        value={assetComposer.subtype}
                        onChange={(event) => updateAssetComposer("subtype", event.target.value as Exclude<PlannerAssetSubtype, "all">)}
                      >
                        {PLANNER_SUBTYPE_OPTIONS[assetComposer.collection]
                          .filter((option) => option.value !== "all")
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Category">
                      <FieldSelect
                        value={assetComposer.category}
                        onChange={(event) => updateAssetComposer("category", event.target.value as PlannerItemCategory)}
                      >
                        {PLANNER_CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Shape">
                      <FieldSelect
                        value={assetComposer.shape}
                        onChange={(event) => updateAssetComposer("shape", event.target.value as PlannerShape)}
                      >
                        {PLANNER_SHAPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Icon">
                      <FieldSelect
                        value={assetComposer.iconName}
                        onChange={(event) => updateAssetComposer("iconName", event.target.value)}
                      >
                        {PLANNER_ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Active">
                      <FieldSelect
                        value={assetComposer.isActive ? "true" : "false"}
                        onChange={(event) => updateAssetComposer("isActive", event.target.value === "true")}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </FieldSelect>
                    </MetadataField>
                    <MetadataField label="Color">
                      <FieldInput
                        placeholder="#d9c2a3"
                        value={assetComposer.color}
                        onChange={(event) => updateAssetComposer("color", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Width">
                      <FieldInput
                        inputMode="numeric"
                        value={assetComposer.width}
                        onChange={(event) => updateAssetComposer("width", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Depth">
                      <FieldInput
                        inputMode="numeric"
                        value={assetComposer.depth}
                        onChange={(event) => updateAssetComposer("depth", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Height">
                      <FieldInput
                        inputMode="numeric"
                        value={assetComposer.height}
                        onChange={(event) => updateAssetComposer("height", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Mesh height">
                      <FieldInput
                        inputMode="numeric"
                        value={assetComposer.meshHeight}
                        onChange={(event) => updateAssetComposer("meshHeight", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Sort order">
                      <FieldInput
                        inputMode="numeric"
                        value={assetComposer.sortOrder}
                        onChange={(event) => updateAssetComposer("sortOrder", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Rotation offset">
                      <FieldInput
                        inputMode="decimal"
                        value={assetComposer.modelRotationOffset}
                        onChange={(event) => updateAssetComposer("modelRotationOffset", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Scale multiplier">
                      <FieldInput
                        inputMode="decimal"
                        value={assetComposer.modelScaleMultiplier}
                        onChange={(event) => updateAssetComposer("modelScaleMultiplier", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Fallback GLB filename">
                      <FieldInput
                        placeholder="e.g. animated_butterfly.glb"
                        value={assetComposer.fallbackModelFilename}
                        onChange={(event) => updateAssetComposer("fallbackModelFilename", event.target.value)}
                      />
                    </MetadataField>
                    <MetadataField label="Zone hint">
                      <FieldInput
                        placeholder="Main stage"
                        value={assetComposer.zoneHint}
                        onChange={(event) => updateAssetComposer("zoneHint", event.target.value)}
                      />
                    </MetadataField>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <MetadataField label="Note">
                      <FieldTextArea
                        placeholder="Explain what this asset is for."
                        value={assetComposer.note}
                        onChange={(event) => updateAssetComposer("note", event.target.value)}
                      />
                    </MetadataField>
                    <div className="grid gap-3 rounded-[var(--radius-sm)] border border-border/60 bg-white/60 p-3">
                      <div className="flex flex-wrap gap-2">
                        <FilePicker
                          accept=".glb,model/gltf-binary,application/octet-stream"
                          disabled={isWorking}
                          id="planner-composer-model-upload"
                          label={assetComposerFiles.model ? "Change Model" : "Add Model"}
                          onChange={(event) =>
                            setAssetComposerFiles((currentFiles) => ({
                              ...currentFiles,
                              model: event.target.files?.[0] ?? undefined,
                            }))
                          }
                        />
                        <FilePicker
                          accept="image/png,image/jpeg,image/webp"
                          disabled={isWorking}
                          id="planner-composer-thumbnail-upload"
                          label={assetComposerFiles.thumbnail ? "Change Thumbnail" : "Add Thumbnail"}
                          onChange={(event) =>
                            setAssetComposerFiles((currentFiles) => ({
                              ...currentFiles,
                              thumbnail: event.target.files?.[0] ?? undefined,
                            }))
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Model: {assetComposerFiles.model?.name ?? "No new model selected."}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Thumbnail: {assetComposerFiles.thumbnail?.name ?? "No new thumbnail selected."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </AdminAccordionSection>

          {groupedItems.map((group, groupIndex) => {
            const groupVariantCount = group.items.length;
            const isComposerOpen = activeVariantComposerSubtype === group.subtype;

            return (
              <AdminAccordionSection
                defaultOpen={groupIndex === 0}
                icon={<Layers3 className="size-4 text-primary" />}
                isLast={groupIndex === groupedItems.length - 1}
                key={group.subtype}
                summaryTrailing={
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={SUMMARY_PILL_CLASS}>{group.items.length} assets</Badge>
                    {variantModeEnabled ? <Badge className={SUMMARY_PILL_CLASS}>{groupVariantCount} variants</Badge> : null}
                    {variantModeEnabled ? (
                      <Button
                        className={ADMIN_ACTION_BUTTON_CLASS}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setActiveVariantComposerSubtype((currentSubtype) =>
                            currentSubtype === group.subtype ? null : group.subtype,
                          );
                          setVariantComposer(createEmptyVariantDraft(group.items[0]?.id ?? ""));
                          setVariantComposerFiles({});
                        }}
                      >
                        Add Variant
                      </Button>
                    ) : null}
                  </div>
                }
                title={group.label}
              >
                <div className="space-y-4">
                  {variantModeEnabled && isComposerOpen ? (
                    <div className="rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">New Variant</p>
                          <p className="text-xs text-muted-foreground">Attach a new visual option to any asset in this group.</p>
                        </div>
                        <Button
                          className={ADMIN_ACTION_BUTTON_CLASS}
                          disabled={isWorking}
                          type="button"
                          onClick={() => void saveVariant(variantComposer, variantComposerFiles)}
                        >
                          <Save className="mr-1 size-3.5" />
                          Save Variant
                        </Button>
                      </div>

                      <div className="grid gap-3 xl:grid-cols-4">
                        <MetadataField label="Asset">
                          <FieldSelect
                            value={variantComposer.itemId}
                            onChange={(event) => updateVariantComposer("itemId", event.target.value)}
                          >
                            {group.items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.label}
                              </option>
                            ))}
                          </FieldSelect>
                        </MetadataField>
                        <MetadataField label="Variant ID">
                          <FieldInput
                            placeholder="e.g. butterfly-companion-golden"
                            value={variantComposer.id}
                            onChange={(event) => updateVariantComposer("id", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Label">
                          <FieldInput
                            placeholder="Variant label"
                            value={variantComposer.label}
                            onChange={(event) => updateVariantComposer("label", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Active">
                          <FieldSelect
                            value={variantComposer.isActive ? "true" : "false"}
                            onChange={(event) => updateVariantComposer("isActive", event.target.value === "true")}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </FieldSelect>
                        </MetadataField>
                        <MetadataField label="Color">
                          <FieldInput
                            placeholder="#f0c46c"
                            value={variantComposer.color}
                            onChange={(event) => updateVariantComposer("color", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Shape">
                          <FieldSelect
                            value={variantComposer.shape}
                            onChange={(event) => updateVariantComposer("shape", event.target.value as PlannerShape)}
                          >
                            {PLANNER_SHAPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </FieldSelect>
                        </MetadataField>
                        <MetadataField label="Width">
                          <FieldInput
                            inputMode="numeric"
                            value={variantComposer.width}
                            onChange={(event) => updateVariantComposer("width", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Depth">
                          <FieldInput
                            inputMode="numeric"
                            value={variantComposer.depth}
                            onChange={(event) => updateVariantComposer("depth", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Height">
                          <FieldInput
                            inputMode="numeric"
                            value={variantComposer.height}
                            onChange={(event) => updateVariantComposer("height", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Mesh height">
                          <FieldInput
                            inputMode="numeric"
                            value={variantComposer.meshHeight}
                            onChange={(event) => updateVariantComposer("meshHeight", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Sort order">
                          <FieldInput
                            inputMode="numeric"
                            value={variantComposer.sortOrder}
                            onChange={(event) => updateVariantComposer("sortOrder", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Fallback GLB filename">
                          <FieldInput
                            placeholder="e.g. animated_butterfly.glb"
                            value={variantComposer.fallbackModelFilename}
                            onChange={(event) => updateVariantComposer("fallbackModelFilename", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Rotation offset">
                          <FieldInput
                            inputMode="decimal"
                            value={variantComposer.modelRotationOffset}
                            onChange={(event) => updateVariantComposer("modelRotationOffset", event.target.value)}
                          />
                        </MetadataField>
                        <MetadataField label="Scale multiplier">
                          <FieldInput
                            inputMode="decimal"
                            value={variantComposer.modelScaleMultiplier}
                            onChange={(event) => updateVariantComposer("modelScaleMultiplier", event.target.value)}
                          />
                        </MetadataField>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <MetadataField label="Description">
                          <FieldTextArea
                            placeholder="Explain what makes this variant different."
                            value={variantComposer.description}
                            onChange={(event) => updateVariantComposer("description", event.target.value)}
                          />
                        </MetadataField>
                        <div className="grid gap-3 rounded-[var(--radius-sm)] border border-border/60 bg-white/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <FilePicker
                              accept=".glb,model/gltf-binary,application/octet-stream"
                              disabled={isWorking}
                              id={`variant-composer-model-${group.subtype}`}
                              label={variantComposerFiles.model ? "Change Model" : "Add Model"}
                              onChange={(event) =>
                                setVariantComposerFiles((currentFiles) => ({
                                  ...currentFiles,
                                  model: event.target.files?.[0] ?? undefined,
                                }))
                              }
                            />
                            <FilePicker
                              accept="image/png,image/jpeg,image/webp"
                              disabled={isWorking}
                              id={`variant-composer-thumbnail-${group.subtype}`}
                              label={variantComposerFiles.thumbnail ? "Change Thumbnail" : "Add Thumbnail"}
                              onChange={(event) =>
                                setVariantComposerFiles((currentFiles) => ({
                                  ...currentFiles,
                                  thumbnail: event.target.files?.[0] ?? undefined,
                                }))
                              }
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Model: {variantComposerFiles.model?.name ?? "No new model selected."}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Thumbnail: {variantComposerFiles.thumbnail?.name ?? "No new thumbnail selected."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {group.items.map((item) => {
                    const itemVariants = variantsByItemId[item.id] ?? [];
                    const itemFiles = itemUploadFiles[item.id];

                    return (
                      <div className="space-y-3 border-b border-border/60 pb-4 last:border-b-0 last:pb-0" key={item.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.note}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.modelStoragePath || item.fallbackModelFilename ? <Badge>Model ready</Badge> : null}
                            {item.thumbnailStoragePath ? <Badge>Thumbnail ready</Badge> : null}
                            {variantModeEnabled ? <Badge>{itemVariants.length} variants</Badge> : null}
                          </div>
                        </div>

                        <div className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.94)_0%,rgba(255,248,239,0.84)_100%)] px-5 py-4">
                          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,0.88fr)_minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="flex min-w-0 h-full flex-col gap-2">
                              <div className={ASSET_SECTION_HEADER_CLASS}>
                                <div className="flex items-center gap-2">
                                  <PackageCheck className="size-4 text-primary" />
                                  <span>Asset Metadata</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ContextHelp
                                    label="Planner asset data help"
                                    tooltip="Edit the asset record linked to DB."
                                    title="Planner Asset Data"
                                    description="Asset metadata now opens in a dialog so the table stays clean, but every save still writes back to the planner asset table."
                                  />
                                  <Button
                                    aria-label={`Edit ${item.label} metadata`}
                                    className="rounded-full border border-border/70 bg-white/70 text-muted-foreground shadow-none transition duration-200 hover:scale-[1.06] hover:bg-white/60"
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setAssetMetadataDialogItemId(item.id)}
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                </div>
                              </div>

                              <div className={ASSET_PANEL_CLASS}>
                                <div className="flex flex-1 flex-col">
                                  <p className="text-[11px] leading-5 text-muted-foreground">{item.note}</p>

                                  <div className="mt-3 overflow-hidden rounded-[calc(var(--radius-sm)-0.2rem)] border border-border/70 bg-white shadow-[0_12px_30px_rgba(104,74,58,0.08)]">
                                    <table className="w-full border-collapse text-left text-xs">
                                      <tbody className="divide-y divide-border/60 bg-white/72 text-muted-foreground">
                                        <tr>
                                          <td className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Model</td>
                                          <td className="px-3 py-2 text-[11px] font-medium text-foreground">
                                            {item.modelFilename ?? item.fallbackModelFilename ? `Updated ${formatUpdatedAt(item.updatedAt)}` : "Not uploaded yet"}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Thumbnail</td>
                                          <td className="px-3 py-2 text-[11px] font-medium text-foreground">
                                            {item.thumbnailFilename ? `Updated ${formatUpdatedAt(item.updatedAt)}` : "Not uploaded yet"}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="mt-3 rounded-[var(--radius-sm)] border border-border/60 bg-white/60 p-3">
                                  <div className="flex flex-wrap gap-2">
                                <FilePicker
                                  accept=".glb,model/gltf-binary,application/octet-stream"
                                  disabled={isWorking}
                                  id={`planner-model-${item.id}`}
                                  label={itemFiles?.model ? "Change Model" : item.modelStoragePath ? "Replace Model" : "Add Model"}
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    event.target.value = "";
                                    void handleItemMediaSelection(item, "model", file);
                                  }}
                                />
                                <FilePicker
                                  accept="image/png,image/jpeg,image/webp"
                                  disabled={isWorking}
                                  id={`planner-thumbnail-${item.id}`}
                                  label={itemFiles?.thumbnail ? "Change Thumbnail" : item.thumbnailStoragePath ? "Replace Thumbnail" : "Add Thumbnail"}
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    event.target.value = "";
                                    void handleItemMediaSelection(item, "thumbnail", file);
                                  }}
                                />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      Model: {itemFiles?.model?.name ?? item.modelFilename ?? item.fallbackModelFilename ?? "No model linked yet."}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Thumbnail: {itemFiles?.thumbnail?.name ?? item.thumbnailFilename ?? "No thumbnail linked yet."}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Dialog
                                open={assetMetadataDialogItemId === item.id}
                                onOpenChange={(open) => {
                                  setAssetMetadataDialogItemId(open ? item.id : null);
                                }}
                              >
                                <DialogContent className="w-[min(96vw,72rem)] max-h-[92dvh] overflow-hidden rounded-[var(--radius-sm)] p-0">
                                  <div className="booking-layout-preview-scroll max-h-[92dvh] overflow-y-auto p-6">
                                    <DialogHeader>
                                      <DialogTitle>Edit Asset Metadata</DialogTitle>
                                      <DialogDescription>
                                        Update the DB-backed metadata for {item.label}. Model and thumbnail uploads still save into Supabase storage and link back to this asset.
                                      </DialogDescription>
                                    </DialogHeader>

                                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                    <MetadataField label="Asset ID">
                                      <FieldInput
                                        value={item.id}
                                        onChange={(event) => updateItemDraft(item.id, { id: slugifyValue(event.target.value) })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Label">
                                      <FieldInput
                                        value={item.label}
                                        onChange={(event) => updateItemDraft(item.id, { label: event.target.value })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Collection">
                                      <FieldSelect
                                        value={item.collection}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            collection: event.target.value as PlannerAssetCollection,
                                          })
                                        }
                                      >
                                        {PLANNER_COLLECTION_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </FieldSelect>
                                    </MetadataField>
                                    <MetadataField label="Asset type">
                                      <FieldSelect
                                        value={item.subtype}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            subtype: event.target.value as Exclude<PlannerAssetSubtype, "all">,
                                          })
                                        }
                                      >
                                        {PLANNER_SUBTYPE_OPTIONS[item.collection]
                                          .filter((option) => option.value !== "all")
                                          .map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                      </FieldSelect>
                                    </MetadataField>
                                    <MetadataField label="Category">
                                      <FieldSelect
                                        value={item.category}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            category: event.target.value as PlannerItemCategory,
                                          })
                                        }
                                      >
                                        {PLANNER_CATEGORY_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </FieldSelect>
                                    </MetadataField>
                                    <MetadataField label="Shape">
                                      <FieldSelect
                                        value={item.shape}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            shape: event.target.value as PlannerShape,
                                          })
                                        }
                                      >
                                        {PLANNER_SHAPE_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </FieldSelect>
                                    </MetadataField>
                                    <MetadataField label="Color">
                                      <FieldInput
                                        value={item.color}
                                        onChange={(event) => updateItemDraft(item.id, { color: event.target.value })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Icon">
                                      <FieldSelect
                                        value={item.iconName}
                                        onChange={(event) => updateItemDraft(item.id, { iconName: event.target.value as PlannerItem["iconName"] })}
                                      >
                                        {PLANNER_ICON_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </FieldSelect>
                                    </MetadataField>
                                    <MetadataField label="Width">
                                      <FieldInput
                                        inputMode="numeric"
                                        value={String(item.width)}
                                        onChange={(event) => updateItemDraft(item.id, { width: Number.parseInt(event.target.value, 10) || 0 })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Depth">
                                      <FieldInput
                                        inputMode="numeric"
                                        value={String(item.depth)}
                                        onChange={(event) => updateItemDraft(item.id, { depth: Number.parseInt(event.target.value, 10) || 0 })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Height">
                                      <FieldInput
                                        inputMode="numeric"
                                        value={String(item.height)}
                                        onChange={(event) => updateItemDraft(item.id, { height: Number.parseInt(event.target.value, 10) || 0 })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Mesh height">
                                      <FieldInput
                                        inputMode="numeric"
                                        value={String(item.meshHeight)}
                                        onChange={(event) => updateItemDraft(item.id, { meshHeight: Number.parseInt(event.target.value, 10) || 0 })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Sort order">
                                      <FieldInput
                                        inputMode="numeric"
                                        value={String(item.sortOrder)}
                                        onChange={(event) => updateItemDraft(item.id, { sortOrder: Number.parseInt(event.target.value, 10) || 999 })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Zone hint">
                                      <FieldInput
                                        value={item.zoneHint}
                                        onChange={(event) => updateItemDraft(item.id, { zoneHint: event.target.value })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Fallback GLB filename">
                                      <FieldInput
                                        value={item.fallbackModelFilename ?? ""}
                                        onChange={(event) => updateItemDraft(item.id, { fallbackModelFilename: event.target.value })}
                                      />
                                    </MetadataField>
                                    <MetadataField label="Rotation offset">
                                      <FieldInput
                                        inputMode="decimal"
                                        value={item.modelConfig?.rotationOffset !== undefined ? String(item.modelConfig.rotationOffset) : ""}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            modelConfig:
                                              item.modelStoragePath || item.fallbackModelFilename || event.target.value.trim() !== ""
                                                ? {
                                                    ...item.modelConfig,
                                                    rotationOffset:
                                                      event.target.value.trim() !== ""
                                                        ? Number.parseFloat(event.target.value)
                                                        : undefined,
                                                  }
                                                : null,
                                          })
                                        }
                                      />
                                    </MetadataField>
                                    <MetadataField label="Scale multiplier">
                                      <FieldInput
                                        inputMode="decimal"
                                        value={item.modelConfig?.scaleMultiplier !== undefined ? String(item.modelConfig.scaleMultiplier) : ""}
                                        onChange={(event) =>
                                          updateItemDraft(item.id, {
                                            modelConfig:
                                              item.modelStoragePath || item.fallbackModelFilename || event.target.value.trim() !== ""
                                                ? {
                                                    ...item.modelConfig,
                                                    scaleMultiplier:
                                                      event.target.value.trim() !== ""
                                                        ? Number.parseFloat(event.target.value)
                                                        : undefined,
                                                  }
                                                : null,
                                          })
                                        }
                                      />
                                    </MetadataField>
                                    <MetadataField label="Active">
                                      <FieldSelect
                                        value={item.isActive ? "true" : "false"}
                                        onChange={(event) => updateItemDraft(item.id, { isActive: event.target.value === "true" })}
                                      >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                      </FieldSelect>
                                    </MetadataField>
                                    <div className="md:col-span-2 xl:col-span-4">
                                      <MetadataField label="Note">
                                        <FieldTextArea
                                          value={item.note}
                                          onChange={(event) => updateItemDraft(item.id, { note: event.target.value })}
                                        />
                                      </MetadataField>
                                    </div>
                                  </div>

                                    <div className="mt-5 flex items-center justify-end gap-2">
                                      <Button
                                        className={ADMIN_DELETE_BUTTON_CLASS}
                                        disabled={isWorking}
                                        type="button"
                                        onClick={() => void deleteAsset(item)}
                                      >
                                        <Trash2 className="mr-1 size-3.5" />
                                        Delete Asset
                                      </Button>
                                      <Button
                                        className={ADMIN_ACTION_BUTTON_CLASS}
                                        disabled={isWorking}
                                        type="button"
                                        onClick={() => void saveAsset(toAssetDraft(item), itemUploadFiles[item.id])}
                                      >
                                        <Save className="mr-1 size-3.5" />
                                        Save Asset
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="flex min-w-0 h-full flex-col gap-2">
                            <div className={ASSET_SECTION_TITLE_CLASS}>
                              <ImagePlus className="size-4 text-primary" />
                              <span>Thumbnail</span>
                            </div>
                            <div className={ASSET_PANEL_CLASS}>
                              <div className="relative flex-1 min-h-[240px] overflow-hidden rounded-[calc(var(--radius-sm)-0.2rem)] border border-border/70 bg-white shadow-[0_12px_30px_rgba(104,74,58,0.08)]">
                                <ThumbnailPreviewSurface
                                  alt={`${item.label} thumbnail`}
                                  file={itemFiles?.thumbnail}
                                  src={item.thumbnailUrl}
                                />
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Thumbnail Asset</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.thumbnailFilename ?? "No thumbnail uploaded yet."}
                                  </p>
                                </div>
                                <Badge>{item.thumbnailStoragePath ? "Ready" : "Missing"}</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex min-w-0 h-full flex-col gap-2">
                            <AssetPreview3D
                              cameraMode="top"
                              item={item}
                              title="2D Preview"
                              variantsByItemId={variantsByItemId}
                            />
                          </div>

                          <div className="flex min-w-0 h-full flex-col gap-2">
                            <AssetPreview3D item={item} variantsByItemId={variantsByItemId} />
                          </div>
                        </div>
                        </div>

                        {variantModeEnabled ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                            <Layers3 className="size-4 text-primary" />
                            Variants
                          </div>
                          {itemVariants.length === 0 ? (
                            <div className="rounded-[var(--radius-sm)] border border-dashed border-border/70 bg-white/50 px-4 py-3 text-xs text-muted-foreground">
                              No variants yet for this asset.
                            </div>
                          ) : (
                            itemVariants.map((variant) => {
                              const variantFiles = variantUploadFiles[variant.id];

                              return (
                                <div className="rounded-[var(--radius-sm)] border border-border/70 bg-white/65 p-4" key={variant.id}>
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">{variant.label}</p>
                                      <p className="text-xs text-muted-foreground">{variant.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {variant.modelStoragePath || variant.fallbackModelFilename ? <Badge>Model ready</Badge> : null}
                                      {variant.thumbnailStoragePath ? <Badge>Thumbnail ready</Badge> : null}
                                    </div>
                                  </div>

                                  <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <MetadataField label="Variant ID">
                                        <FieldInput
                                          value={variant.id}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, { id: slugifyValue(event.target.value) })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Label">
                                        <FieldInput
                                          value={variant.label}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, { label: event.target.value })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Color">
                                        <FieldInput
                                          value={variant.color ?? ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, { color: event.target.value || undefined })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Shape">
                                        <FieldSelect
                                          value={variant.shape ?? "rectangle"}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, { shape: event.target.value as PlannerShape })
                                          }
                                        >
                                          {PLANNER_SHAPE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </FieldSelect>
                                      </MetadataField>
                                      <MetadataField label="Width">
                                        <FieldInput
                                          inputMode="numeric"
                                          value={variant.width !== undefined ? String(variant.width) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              width: event.target.value.trim() !== "" ? Number.parseInt(event.target.value, 10) : undefined,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Depth">
                                        <FieldInput
                                          inputMode="numeric"
                                          value={variant.depth !== undefined ? String(variant.depth) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              depth: event.target.value.trim() !== "" ? Number.parseInt(event.target.value, 10) : undefined,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Height">
                                        <FieldInput
                                          inputMode="numeric"
                                          value={variant.height !== undefined ? String(variant.height) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              height: event.target.value.trim() !== "" ? Number.parseInt(event.target.value, 10) : undefined,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Mesh height">
                                        <FieldInput
                                          inputMode="numeric"
                                          value={variant.meshHeight !== undefined ? String(variant.meshHeight) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              meshHeight:
                                                event.target.value.trim() !== "" ? Number.parseInt(event.target.value, 10) : undefined,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Sort order">
                                        <FieldInput
                                          inputMode="numeric"
                                          value={String(variant.sortOrder)}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              sortOrder: Number.parseInt(event.target.value, 10) || 999,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Fallback GLB filename">
                                        <FieldInput
                                          value={variant.fallbackModelFilename ?? ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              fallbackModelFilename: event.target.value || undefined,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Rotation offset">
                                        <FieldInput
                                          inputMode="decimal"
                                          value={variant.modelConfig?.rotationOffset !== undefined ? String(variant.modelConfig.rotationOffset) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              modelConfig:
                                                variant.modelStoragePath || variant.fallbackModelFilename || event.target.value.trim() !== ""
                                                  ? {
                                                      ...variant.modelConfig,
                                                      rotationOffset:
                                                        event.target.value.trim() !== ""
                                                          ? Number.parseFloat(event.target.value)
                                                          : undefined,
                                                    }
                                                  : null,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Scale multiplier">
                                        <FieldInput
                                          inputMode="decimal"
                                          value={variant.modelConfig?.scaleMultiplier !== undefined ? String(variant.modelConfig.scaleMultiplier) : ""}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, {
                                              modelConfig:
                                                variant.modelStoragePath || variant.fallbackModelFilename || event.target.value.trim() !== ""
                                                  ? {
                                                      ...variant.modelConfig,
                                                      scaleMultiplier:
                                                        event.target.value.trim() !== ""
                                                          ? Number.parseFloat(event.target.value)
                                                          : undefined,
                                                    }
                                                  : null,
                                            })
                                          }
                                        />
                                      </MetadataField>
                                      <MetadataField label="Active">
                                        <FieldSelect
                                          value={variant.isActive ? "true" : "false"}
                                          onChange={(event) =>
                                            updateVariantDraft(item.id, variant.id, { isActive: event.target.value === "true" })
                                          }
                                        >
                                          <option value="true">Active</option>
                                          <option value="false">Inactive</option>
                                        </FieldSelect>
                                      </MetadataField>
                                      <div className="md:col-span-2">
                                        <MetadataField label="Description">
                                          <FieldTextArea
                                            value={variant.description}
                                            onChange={(event) =>
                                              updateVariantDraft(item.id, variant.id, { description: event.target.value })
                                            }
                                          />
                                        </MetadataField>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div className="rounded-[var(--radius-sm)] border border-border/60 bg-white/60 p-3">
                                        <div className="flex flex-wrap gap-2">
                                          <FilePicker
                                            accept=".glb,model/gltf-binary,application/octet-stream"
                                            disabled={isWorking}
                                            id={`variant-model-${variant.id}`}
                                            label={variantFiles?.model ? "Change Model" : variant.modelStoragePath ? "Replace Model" : "Add Model"}
                                            onChange={(event) => {
                                              const file = event.target.files?.[0];
                                              event.target.value = "";
                                              void handleVariantMediaSelection(item.id, variant, "model", file);
                                            }}
                                          />
                                          <FilePicker
                                            accept="image/png,image/jpeg,image/webp"
                                            disabled={isWorking}
                                            id={`variant-thumbnail-${variant.id}`}
                                            label={variantFiles?.thumbnail ? "Change Thumbnail" : variant.thumbnailStoragePath ? "Replace Thumbnail" : "Add Thumbnail"}
                                            onChange={(event) => {
                                              const file = event.target.files?.[0];
                                              event.target.value = "";
                                              void handleVariantMediaSelection(item.id, variant, "thumbnail", file);
                                            }}
                                          />
                                          <Button
                                            className={ADMIN_ACTION_BUTTON_CLASS}
                                            disabled={isWorking}
                                            type="button"
                                            onClick={() =>
                                              void saveVariant(
                                                {
                                                  color: variant.color ?? "",
                                                  depth: variant.depth !== undefined ? String(variant.depth) : "",
                                                  description: variant.description,
                                                  fallbackModelFilename: variant.fallbackModelFilename ?? "",
                                                  height: variant.height !== undefined ? String(variant.height) : "",
                                                  id: variant.id,
                                                  isActive: variant.isActive,
                                                  itemId: item.id,
                                                  label: variant.label,
                                                  meshHeight: variant.meshHeight !== undefined ? String(variant.meshHeight) : "",
                                                  modelRotationOffset:
                                                    variant.modelConfig?.rotationOffset !== undefined
                                                      ? String(variant.modelConfig.rotationOffset)
                                                      : "",
                                                  modelScaleMultiplier:
                                                    variant.modelConfig?.scaleMultiplier !== undefined
                                                      ? String(variant.modelConfig.scaleMultiplier)
                                                      : "",
                                                  shape: variant.shape ?? "rectangle",
                                                  sortOrder: String(variant.sortOrder),
                                                  width: variant.width !== undefined ? String(variant.width) : "",
                                                },
                                                variantUploadFiles[variant.id],
                                              )
                                            }
                                          >
                                            <Save className="mr-1 size-3.5" />
                                            Save Variant
                                          </Button>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                          <p className="text-xs text-muted-foreground">
                                            Model: {variantFiles?.model?.name ?? variant.modelFilename ?? variant.fallbackModelFilename ?? "No model linked yet."}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Thumbnail: {variantFiles?.thumbnail?.name ?? variant.thumbnailFilename ?? "No thumbnail linked yet."}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Updated: {formatUpdatedAt(variant.updatedAt)}
                                          </p>
                                        </div>
                                      </div>
                                      <AssetPreview3D
                                        item={item}
                                        title={`${variant.label} Preview`}
                                        variantId={variant.id}
                                        variantsByItemId={variantsByItemId}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </AdminAccordionSection>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
