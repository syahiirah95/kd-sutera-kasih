"use client";

import Image from "next/image";
import { type PointerEvent, type WheelEvent, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type VenueMediaRecord } from "@/lib/data/venues";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

type Point = {
  x: number;
  y: number;
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function VenueGallery({
  images = [],
}: Readonly<{
  images?: VenueMediaRecord[];
}>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dragStartRef = useRef<Point>({ x: 0, y: 0 });
  const galleryImages = images;
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  if (!galleryImages.length) {
    return (
      <div className="rounded-[var(--radius-sm)] border border-dashed border-[#d49b6a]/35 bg-white/40 px-4 py-10 text-center text-sm leading-7 text-[#6f5648]">
        Gallery media belum tersedia untuk venue ini.
      </div>
    );
  }

  function resetView() {
    setIsDragging(false);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }

  function selectImage(index: number) {
    resetView();
    setActiveIndex(index);
  }

  function updateZoom(nextZoom: number | ((currentZoom: number) => number)) {
    const clampedZoom = clampZoom(
      typeof nextZoom === "function" ? nextZoom(zoom) : nextZoom,
    );

    setZoom(clampedZoom);
    if (clampedZoom === MIN_ZOOM) {
      setPan({ x: 0, y: 0 });
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    updateZoom((currentZoom) => currentZoom + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (zoom === MIN_ZOOM) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging || zoom === MIN_ZOOM) {
      return;
    }

    setPan({
      x: event.clientX - dragStartRef.current.x,
      y: event.clientY - dragStartRef.current.y,
    });
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }

  function showPreviousImage() {
    resetView();
    setActiveIndex((currentIndex) => (
      currentIndex - 1 + galleryImages.length
    ) % galleryImages.length);
  }

  function showNextImage() {
    resetView();
    setActiveIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
  }

  return (
    <Dialog>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {galleryImages.map((image, index) => (
          <DialogTrigger asChild key={image.src}>
            <button
              aria-label={`View larger image: ${image.alt}`}
              className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] border border-white/70 shadow-[0_16px_34px_rgba(114,76,43,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(114,76,43,0.18)]"
              onClick={() => selectImage(index)}
              type="button"
            >
              <Image
                fill
                alt={image.alt}
                className="object-cover transition duration-500 hover:scale-[1.03]"
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                src={image.src}
              />
            </button>
          </DialogTrigger>
        ))}
      </div>

      <DialogContent className="w-[min(94vw,72rem)] overflow-hidden rounded-[var(--radius-sm)] bg-black p-3">
        <DialogTitle className="sr-only">{activeImage.alt}</DialogTitle>
        <div
          className={`relative h-[min(82dvh,48rem)] w-full touch-none overflow-hidden rounded-[calc(var(--radius-sm)-0.25rem)] ${
            zoom > MIN_ZOOM ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
          }`}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onWheel={handleWheel}
        >
          <div
            className="absolute inset-0 transition-transform duration-150 ease-out"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            }}
          >
            <Image
              fill
              priority
              alt={activeImage.alt}
              className="select-none object-contain"
              draggable={false}
              sizes="94vw"
              src={activeImage.src}
            />
          </div>
          {galleryImages.length > 1 ? (
            <>
              <button
                aria-label="Previous gallery image"
                className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/48 shadow-[0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-[#dca453]/70 hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] hover:text-white hover:shadow-[0_0_18px_rgba(220,164,83,0.44),0_10px_26px_rgba(0,0,0,0.24)]"
                onClick={showPreviousImage}
                type="button"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                aria-label="Next gallery image"
                className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/48 shadow-[0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-[#dca453]/70 hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] hover:text-white hover:shadow-[0_0_18px_rgba(220,164,83,0.44),0_10px_26px_rgba(0,0,0,0.24)]"
                onClick={showNextImage}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/68 px-3 py-2 backdrop-blur">
                  {galleryImages.map((image, index) => (
                    <button
                      aria-label={`Show gallery image ${index + 1}`}
                      className={`size-2 rounded-full transition ${
                        index === activeIndex
                          ? "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] shadow-[0_0_10px_rgba(220,164,83,0.46)]"
                          : "bg-white/46 hover:bg-white/80"
                      }`}
                      key={image.src}
                      onClick={() => selectImage(index)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
          <div
            className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1 backdrop-blur"
            onPointerDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Zoom out"
              className="inline-flex size-8 items-center justify-center rounded-full text-white/68 transition hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] hover:text-white hover:shadow-[0_0_14px_rgba(220,164,83,0.38)] disabled:pointer-events-none disabled:opacity-30"
              disabled={zoom === MIN_ZOOM}
              onClick={() => updateZoom((currentZoom) => currentZoom - ZOOM_STEP)}
              type="button"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="min-w-12 text-center text-[11px] font-semibold text-white/70">
              {Math.round(zoom * 100)}%
            </span>
            <button
              aria-label="Zoom in"
              className="inline-flex size-8 items-center justify-center rounded-full text-white/68 transition hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] hover:text-white hover:shadow-[0_0_14px_rgba(220,164,83,0.38)] disabled:pointer-events-none disabled:opacity-30"
              disabled={zoom === MAX_ZOOM}
              onClick={() => updateZoom((currentZoom) => currentZoom + ZOOM_STEP)}
              type="button"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              aria-label="Reset image view"
              className="inline-flex size-8 items-center justify-center rounded-full text-white/68 transition hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] hover:text-white hover:shadow-[0_0_14px_rgba(220,164,83,0.38)] disabled:pointer-events-none disabled:opacity-30"
              disabled={zoom === MIN_ZOOM && pan.x === 0 && pan.y === 0}
              onClick={resetView}
              type="button"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
