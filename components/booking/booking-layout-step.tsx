"use client";

import { useMemo, useState } from "react";
import { type BookingFormData } from "@/components/booking/booking-request-types";
import { ContextHelp } from "@/components/help/context-help";
import { PlannerLayoutShell } from "@/components/planner/planner-layout-shell";
import { type PlannerItem, type PlannerItemVariant, type PlannerPlacedItem } from "@/components/planner/planner-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PREVIEW_BUTTON_CLASS =
  "booking-form-nav-neutral !h-7 !w-24 !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !px-2 !text-center !text-[11px] !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white";
const LAYOUT_PREVIEW_DESCRIPTION =
  "Preview how your selected setup can shape the hall, from guest flow to focal points, so you can picture a confident event layout before sending your booking request.";

function createPreviewItems(tableCountValue: string, tableType: string, stageType: string): PlannerPlacedItem[] {
  const tableCount = Math.min(24, Math.max(1, Number.parseInt(tableCountValue, 10) || 1));
  const defaultTableItemId = tableType === "rectangle" ? "rect-table" : "round-table";
  const defaultTableLabel = tableType === "rectangle" ? "Guest table" : "Round table";
  const columns = tableCount <= 8 ? 4 : tableCount <= 16 ? 5 : 6;
  const rows = Math.ceil(tableCount / columns);
  const startX = columns <= 4 ? 27 : 22;
  const gapX = columns <= 4 ? 14 : 11;
  const startY = rows <= 2 ? 50 : 42;
  const gapY = rows <= 2 ? 16 : 12;
  const items: PlannerPlacedItem[] = [];

  if (stageType !== "no-stage") {
    items.push({
      id: "preview-stage",
      itemId: stageType === "extended-stage" ? "pelamin" : "stage",
      label: stageType === "extended-stage" ? "Extended stage" : "Main stage",
      rotation: 0,
      widthClass: "w-28",
      x: 68,
      y: 18,
      zone: "Main stage",
    });
  }

  for (let index = 0; index < tableCount; index += 1) {
    const tableItemId = tableType === "mixed" && index % 3 === 0 ? "rect-table" : defaultTableItemId;
    const tableLabel = tableItemId === "rect-table" ? "Guest table" : defaultTableLabel;

    items.push({
      id: `preview-table-${index + 1}`,
      itemId: tableItemId,
      label: `${tableLabel} ${index + 1}`,
      rotation: tableType === "rectangle" ? 0 : 0,
      widthClass: tableType === "rectangle" ? "w-24" : "w-16",
      x: startX + (index % columns) * gapX,
      y: startY + Math.floor(index / columns) * gapY,
      zone: "Dining area",
    });
  }

  items.push({
    id: "preview-registration",
    itemId: "registration",
    label: "Registration table",
    rotation: 0,
    widthClass: "w-24",
    x: 17,
    y: 18,
    zone: "Entrance",
  });

  return items;
}

type BookingLayoutStepProps = {
  formData: BookingFormData;
  items: PlannerItem[];
  updateField: (field: keyof BookingFormData, value: string) => void;
};

export function BookingLayoutStep({
  formData,
  items,
  updateField,
}: BookingLayoutStepProps) {
  const layoutReferenceItems = items.filter((item) =>
    ["stage", "round-table", "rect-table", "chair", "pelamin", "floral", "photo-booth", "butterfly-companion"].includes(item.id),
  );

  return (
    <section>
      <div className="grid items-stretch gap-3 md:grid-cols-[3fr_1fr]">
        <div className="space-y-2.5">
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="theme-style">Theme or style (optional)</Label>
            <Textarea
              id="theme-style"
              className="h-20 min-h-0 resize-none rounded-[var(--radius-sm)] border-white/65 bg-white/50 px-3 py-3 text-sm shadow-[0_8px_20px_rgba(114,76,43,0.06)] placeholder:text-[#7d675a]"
              placeholder="e.g. romantic ivory & gold, garden reception, modern minimal"
              rows={2}
              value={formData.themeStyle}
              onChange={(event) => updateField("themeStyle", event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="special-requests">Layout notes and setup requests (optional)</Label>
            <Textarea
              id="special-requests"
              className="h-20 min-h-0 resize-none rounded-[var(--radius-sm)] border-white/65 bg-white/50 px-3 py-3 text-sm shadow-[0_8px_20px_rgba(114,76,43,0.06)] placeholder:text-[#7d675a]"
              placeholder="Share furniture, stage, aisle, props, vendor access, accessibility, or setup timing notes."
              rows={4}
              value={formData.specialRequests}
              onChange={(event) => updateField("specialRequests", event.target.value)}
            />
          </div>
        </div>
        <aside className="booking-layout-preview-scroll h-[13.95rem] overflow-y-auto rounded-[var(--radius-sm)] border border-white/65 bg-white/50 px-3 py-2.5 shadow-[0_8px_20px_rgba(114,76,43,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8d542d]">
            Furniture & props
          </p>
          <div className="mt-2 space-y-1.5">
            {layoutReferenceItems.map((item) => (
              <div
                className="flex items-center justify-between gap-2 border-b border-[rgba(145,108,84,0.12)] pb-1.5 last:border-b-0 last:pb-0"
                key={item.id}
              >
                <p className="truncate text-xs font-semibold text-foreground">{item.label}</p>
                <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function BookingLayoutPreviewButton({
  items,
  variantsByItemId,
}: Readonly<{
  items: PlannerItem[];
  variantsByItemId: Record<string, PlannerItemVariant[]>;
}>) {
  const [tableCount] = useState("12");
  const [tableType] = useState("round");
  const [stageType] = useState("low-stage");
  const previewItems = useMemo(
    () => createPreviewItems(tableCount, tableType, stageType),
    [stageType, tableCount, tableType],
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={PREVIEW_BUTTON_CLASS}>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[92dvh] w-[min(94vw,72rem)] flex-col overflow-hidden rounded-[var(--radius-sm)] p-4">
        <DialogHeader className="shrink-0 pb-3">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl" data-butterfly-anchor="layout-preview-title">Layout Preview</DialogTitle>
            <ContextHelp
              contentClassName="max-h-[82dvh] w-[min(92vw,42rem)] overflow-hidden rounded-[var(--radius-sm)] p-4"
              label="Layout item help"
              tooltip="View furniture and decor guidance."
              title="Layout Item Guide"
              description="Review what each furniture and decor option is used for before selecting it in the planner."
            >
              <div className="booking-layout-preview-scroll max-h-[56dvh] space-y-4 overflow-y-auto pr-2">
                {(["furniture", "decor", "companion"] as const).map((category) => (
                  <div key={category} className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {category === "furniture"
                        ? "Furniture"
                        : category === "decor"
                          ? "Decor & Setup"
                          : "Butterfly Companion"}
                    </p>
                    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-white/75">
                      {items.filter((item) => item.category === category).map((item) => (
                        <div key={item.id} className="border-b border-border/65 px-3 py-2.5 last:border-b-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">{item.label}</p>
                            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                              {item.zoneHint}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ContextHelp>
          </div>
          <DialogDescription>
            {LAYOUT_PREVIEW_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <PlannerLayoutShell
            initialReceptionItems={previewItems}
            items={items}
            singlePreset
            toolbarPlacement="top"
            variantsByItemId={variantsByItemId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
