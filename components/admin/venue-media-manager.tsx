"use client";

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ImagePlus, PencilLine, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/auth/client";
import { type VenueMediaRecord, type VenueRecord } from "@/lib/data/venues";

const ADMIN_UPLOAD_BUTTON_CLASS =
  "booking-form-nav-primary inline-flex !h-7 !w-24 items-center justify-center !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-2 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";
const ADMIN_SAVE_BUTTON_CLASS =
  "booking-form-nav-primary !h-8 !w-32 !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-3 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";
const BUCKET_ID = "kd_sutera_kasih_venue_media";

type MediaType = "booking_video" | "gallery_image" | "hero_image" | "testimonial_video";

type VenueDetailsForm = {
  address: string;
  badgeLabel: string;
  capacity: string;
  capacityMax: string;
  capacityMin: string;
  contactEmail: string;
  contactPhone: string;
  depositAmount: string;
  description: string;
  facilitiesText: string;
  furniturePackage: string;
  galleryTitle: string;
  hallPackage: string;
  intro: string;
  mapEmbedUrl: string;
  name: string;
  operatingHours: string;
  propsPackage: string;
  state: string;
};

function sanitizeFilename(filename: string) {
  const extension = filename.split(".").pop();
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${baseName || "media"}-${Date.now()}${extension ? `.${extension}` : ""}`;
}

function getStoragePath(venueSlug: string, mediaType: MediaType, file: File, index = 0) {
  const filename = sanitizeFilename(file.name);

  if (mediaType === "hero_image") {
    return `venues/${venueSlug}/hero/${filename}`;
  }

  if (mediaType === "booking_video") {
    return `venues/${venueSlug}/booking-video/${filename}`;
  }

  if (mediaType === "testimonial_video") {
    return `venues/${venueSlug}/testimonials/${Date.now()}-${index + 1}-${filename}`;
  }

  return `venues/${venueSlug}/gallery/${Date.now()}-${index + 1}-${filename}`;
}

function getStoragePathFromSrc(src: string) {
  const marker = `/${BUCKET_ID}/`;
  const cleanSrc = src.split("?")[0] ?? src;
  const extractedPath = cleanSrc.includes(marker) ? cleanSrc.split(marker)[1] ?? cleanSrc : cleanSrc;
  return decodeURIComponent(extractedPath);
}

function mediaTypeLabel(mediaType: MediaType) {
  return mediaType.replace(/_/g, " ");
}

function getVenueDetailsForm(venue?: VenueRecord): VenueDetailsForm {
  return {
    address: venue?.address ?? "",
    badgeLabel: venue?.badgeLabel ?? "",
    capacity: venue?.capacity ?? "",
    capacityMax: venue?.capacityMax ? String(venue.capacityMax) : "",
    capacityMin: venue?.capacityMin ? String(venue.capacityMin) : "",
    contactEmail: venue?.contactEmail ?? "",
    contactPhone: venue?.contactPhone ?? "",
    depositAmount: String(venue?.pricing.depositAmount ?? 0),
    description: venue?.description ?? "",
    facilitiesText: venue?.facilities.join("\n") ?? "",
    furniturePackage: String(venue?.pricing.furniturePackage ?? 0),
    galleryTitle: venue?.galleryTitle ?? "",
    hallPackage: String(venue?.pricing.hallPackage ?? 0),
    intro: venue?.intro ?? "",
    mapEmbedUrl: venue?.mapEmbedUrl ?? "",
    name: venue?.name ?? "",
    operatingHours: venue?.operatingHours ?? "",
    propsPackage: String(venue?.pricing.propsPackage ?? 0),
    state: venue?.state ?? "",
  };
}

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function parseOptionalInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function AdminAccordionSection({
  children,
  defaultOpen = false,
  icon,
  isLast = false,
  title,
}: Readonly<{
  children: ReactNode;
  defaultOpen?: boolean;
  icon: ReactNode;
  isLast?: boolean;
  title: string;
}>) {
  return (
    <details
      className={`group overflow-hidden border-x border-t border-border/70 bg-white/35 ${isLast ? "border-b" : ""}`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground marker:hidden">
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/60 p-4">{children}</div>
    </details>
  );
}

function UploadField({
  accept,
  description,
  disabled,
  id,
  mediaPreview,
  mediaType,
  multiple = false,
  onFileChange,
}: Readonly<{
  accept: string;
  description: string;
  disabled: boolean;
  id: string;
  mediaPreview?: ReactNode;
  mediaType: MediaType;
  multiple?: boolean;
  onFileChange: (mediaType: MediaType) => (event: ChangeEvent<HTMLInputElement>) => void;
}>) {
  return (
    <div className="grid gap-3">
      {mediaPreview}
      <p className="text-sm text-muted-foreground">{description}</p>
      <Label htmlFor={id} className={ADMIN_UPLOAD_BUTTON_CLASS}>
        Choose
      </Label>
      <Input
        accept={accept}
        className="sr-only"
        disabled={disabled}
        id={id}
        multiple={multiple}
        type="file"
        onChange={onFileChange(mediaType)}
      />
    </div>
  );
}

export function VenueMediaManager({
  venues,
}: Readonly<{
  venues: VenueRecord[];
}>) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSlug, setSelectedSlug] = useState(venues[0]?.slug ?? "");
  const [detailsForm, setDetailsForm] = useState(() => getVenueDetailsForm(venues[0]));
  const [mediaPreviewOverrides, setMediaPreviewOverrides] = useState<Partial<Record<MediaType, string[]>>>({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletedMediaPaths, setDeletedMediaPaths] = useState<string[]>([]);
  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.slug === selectedSlug) ?? venues[0],
    [selectedSlug, venues],
  );

  async function getSelectedVenueId() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase || !selectedVenue) {
      return { supabase, venueId: null as string | null };
    }

    const { data: venueRow, error: venueError } = await supabase
      .from("kd_sutera_kasih_venues")
      .select("id")
      .eq("slug", selectedVenue.slug)
      .single();

    if (venueError || !venueRow) {
      throw venueError ?? new Error("Venue row was not found.");
    }

    return {
      supabase,
      venueId: venueRow.id as string,
    };
  }

  function handleVenueChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextSlug = event.target.value;
    const nextVenue = venues.find((venue) => venue.slug === nextSlug);

    setSelectedSlug(nextSlug);
    setDetailsForm(getVenueDetailsForm(nextVenue));
    setMediaPreviewOverrides({});
    setDeletedMediaPaths([]);
  }

  function updateDetailsField(field: keyof VenueDetailsForm) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDetailsForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };
  }

  async function saveVenueDetails() {
    if (!selectedVenue) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      toast({
        message: "Supabase is not configured, so saving venue changes is currently all dreams and no action.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);
    setMessage("");

    const facilities = detailsForm.facilitiesText
      .split("\n")
      .map((facility) => facility.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("kd_sutera_kasih_venues")
      .update({
        address: detailsForm.address.trim(),
        badge_label: detailsForm.badgeLabel.trim() || null,
        capacity_label: detailsForm.capacity.trim(),
        capacity_max: parseOptionalInteger(detailsForm.capacityMax),
        capacity_min: parseOptionalInteger(detailsForm.capacityMin),
        contact_email: detailsForm.contactEmail.trim() || null,
        contact_phone: detailsForm.contactPhone.trim() || null,
        deposit_amount: parseMoney(detailsForm.depositAmount),
        description: detailsForm.description.trim(),
        facilities,
        furniture_package: parseMoney(detailsForm.furniturePackage),
        gallery_title: detailsForm.galleryTitle.trim() || null,
        hall_package: parseMoney(detailsForm.hallPackage),
        intro: detailsForm.intro.trim(),
        map_embed_url: detailsForm.mapEmbedUrl.trim() || null,
        name: detailsForm.name.trim(),
        operating_hours: detailsForm.operatingHours.trim() || null,
        props_package: parseMoney(detailsForm.propsPackage),
        state: detailsForm.state.trim(),
      })
      .eq("slug", selectedVenue.slug);

    setIsSaving(false);

    if (error) {
      const errorMessage = error.message || "Venue details could not be saved.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setMessage("Venue details saved.");
    toast({
      message: `${detailsForm.name || selectedVenue.name} just got a fresh polish.`,
      title: "Saved nicely",
      variant: "success",
    });
    router.refresh();
  }

  async function uploadMedia(files: FileList | null, mediaType: MediaType) {
    if (!files?.length || !selectedVenue) {
      return;
    }

    if (mediaType === "gallery_image") {
      setIsUploading(true);
      setMessage("");

      try {
        const formData = new FormData();
        formData.set("venueSlug", selectedVenue.slug);
        formData.set("mediaType", mediaType);

        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });

        const response = await fetch("/api/admin/venue-media", {
          body: formData,
          method: "POST",
        });
        const result = (await response.json().catch(() => null)) as {
          error?: string;
          items?: Array<{ src: string }>;
        } | null;

        if (!response.ok) {
          throw new Error(result?.error ?? "Gallery upload failed.");
        }

        setDeletedMediaPaths([]);
        setMediaPreviewOverrides((currentPreviews) => ({
          ...currentPreviews,
          gallery_image: result?.items?.map((item) => item.src) ?? [],
        }));
        setMessage("Gallery updated from the database.");
        toast({
          message: "Gallery replaced successfully. Venue page will now follow the latest DB set.",
          title: "Media is in",
          variant: "success",
        });
        router.refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Media upload failed.";
        setMessage(errorMessage);
        toast({
          message: errorMessage,
          title: "Oh no",
          variant: "error",
        });
      } finally {
        setIsUploading(false);
      }

      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      toast({
        message: "Supabase is not configured, so that media upload had nowhere dramatic to go.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const selectedFiles = Array.from(files);
      const { venueId } = await getSelectedVenueId();

      if (!venueId) {
        throw new Error("Venue row was not found.");
      }

      if (mediaType !== "testimonial_video") {
        const { error: deactivateError } = await supabase
          .from("kd_sutera_kasih_venue_media")
          .update({ is_active: false })
          .eq("venue_id", venueId)
          .eq("media_type", mediaType);

        if (deactivateError) {
          throw deactivateError;
        }
      }

      let nextSortOrder = 0;

      if (mediaType === "testimonial_video") {
        const { data: existingMedia, error: existingMediaError } = await supabase
          .from("kd_sutera_kasih_venue_media")
          .select("sort_order, storage_path")
          .eq("venue_id", venueId)
          .eq("media_type", mediaType)
          .eq("is_active", true)
          .order("sort_order", { ascending: false });

        if (existingMediaError) {
          throw existingMediaError;
        }

        nextSortOrder = existingMedia?.[0]?.sort_order ?? 0;
      }

      for (const [index, file] of selectedFiles.entries()) {
        const storagePath = getStoragePath(selectedVenue.slug, mediaType, file, index);
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_ID)
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { error: insertError } = await supabase
          .from("kd_sutera_kasih_venue_media")
          .insert({
            alt_text: `${selectedVenue.name} ${mediaTypeLabel(mediaType)}`,
            bucket_id: BUCKET_ID,
            caption: null,
            is_active: true,
            media_type: mediaType,
            sort_order: mediaType === "testimonial_video" ? nextSortOrder + index + 1 : 0,
            storage_path: storagePath,
            venue_id: venueId,
          });

        if (insertError) {
          throw insertError;
        }

        const publicUrl = supabase.storage.from(BUCKET_ID).getPublicUrl(storagePath).data.publicUrl;
        setMediaPreviewOverrides((currentPreviews) => {
          const currentMediaPreviews = mediaType === "testimonial_video" ? currentPreviews[mediaType] ?? [] : [];

          return {
            ...currentPreviews,
            [mediaType]: mediaType === "testimonial_video" ? [...currentMediaPreviews, publicUrl] : [publicUrl],
          };
        });
      }

      setMessage("Media uploaded.");
      toast({
        message: "Upload complete. Your venue is looking more photogenic already.",
        title: "Media is in",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Media upload failed.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  const heroPreviewSrc = mediaPreviewOverrides.hero_image?.[0] ?? selectedVenue?.heroImageSrc;
  const bookingVideoPreviewSrc = mediaPreviewOverrides.booking_video?.[0] ?? selectedVenue?.bookingVideoSrc;
  // Only use gallery from DB (no fallback/local)
  const galleryPreviewImages =
    mediaPreviewOverrides.gallery_image?.length
      ? mediaPreviewOverrides.gallery_image.map((src, index) => ({
          alt: `${selectedVenue?.name ?? "Venue"} gallery ${index + 1}`,
          src,
        }))
      : (selectedVenue?.gallery ?? []).filter(
          (image) => !deletedMediaPaths.includes(image.storagePath ?? image.src),
        );
  const testimonyPreviewVideos =
    mediaPreviewOverrides.testimonial_video?.length
      ? mediaPreviewOverrides.testimonial_video.map((src, index) => ({
          alt: `${selectedVenue?.name ?? "Venue"} testimony video ${index + 1}`,
          src,
        }))
      : (selectedVenue?.testimonyVideos ?? []).filter(
          (video) => !deletedMediaPaths.includes(video.storagePath ?? video.src),
        );

  async function handleDeleteMediaItem(
    mediaType: "gallery_image" | "testimonial_video",
    item: VenueMediaRecord,
  ) {
    if (!selectedVenue) return;
    setIsUploading(true);
    setMessage("");
    try {
      const storagePath = item.storagePath ?? getStoragePathFromSrc(item.src);
      const response = await fetch("/api/admin/venue-media", {
        body: JSON.stringify({
          mediaType,
          storagePath,
          venueSlug: selectedVenue.slug,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Delete failed.");
      }

      setDeletedMediaPaths((currentPaths) => [...currentPaths, storagePath]);
      setMediaPreviewOverrides((currentPreviews) => ({
        ...currentPreviews,
        [mediaType]: (currentPreviews[mediaType] ?? []).filter((src) => src !== item.src),
      }));
      setMessage(`${mediaType === "gallery_image" ? "Image" : "Video"} deleted.`);
      toast({
        message: mediaType === "gallery_image" ? "Gallery image deleted." : "Testimony video deleted.",
        title: "Deleted",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Delete failed.";
      setMessage(errorMessage);
      toast({
        message: errorMessage,
        title: "Oh no",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(mediaType: MediaType) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      void uploadMedia(event.target.files, mediaType);
      event.target.value = "";
    };
  }

  return (
    <Card className="rounded-[var(--radius-sm)]">
      <CardHeader className="border-b border-border/70 px-5 py-4">
        <CardTitle className="font-display text-2xl">
          <span data-butterfly-anchor="section">Venue Media</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-2 px-5 py-4">
          <Label htmlFor="admin-venue-media-select">Hall</Label>
          <Select
            id="admin-venue-media-select"
            value={selectedSlug}
            onChange={handleVenueChange}
          >
            {venues.map((venue) => (
              <option key={venue.slug} value={venue.slug}>
                {venue.name}
              </option>
            ))}
          </Select>
          <p className="text-xs leading-5 text-muted-foreground">
            Edit venue page details and upload media for the selected hall.
          </p>
          {message ? <p className="text-xs font-semibold text-[#8d542d]">{message}</p> : null}
        </div>

        <div>
          <AdminAccordionSection
            icon={<ImagePlus className="size-4 text-primary" />}
            title="Hero image"
          >
            <UploadField
              accept="image/*"
              disabled={isUploading}
              description="Upload the image used on the venue hero section."
              id="admin-hero-image-upload"
              mediaPreview={heroPreviewSrc ? (
                <div className="relative aspect-[16/7] overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[#fffdf9]">
                  <Image alt={`${selectedVenue?.name ?? "Venue"} hero image`} className="object-cover" fill sizes="(min-width: 1024px) 70vw, 100vw" src={heroPreviewSrc} unoptimized />
                </div>
              ) : null}
              mediaType="hero_image"
              onFileChange={handleFileChange}
            />
          </AdminAccordionSection>

          <AdminAccordionSection
            icon={<Video className="size-4 text-primary" />}
            title="Booking video"
          >
            <UploadField
              accept="video/mp4,video/webm"
              disabled={isUploading}
              description="Upload the video used on the booking page for this hall."
              id="admin-booking-video-upload"
              mediaPreview={bookingVideoPreviewSrc ? (
                <video
                  className="aspect-video w-full rounded-[var(--radius-sm)] border border-border/70 bg-black object-cover"
                  controls
                  muted
                  playsInline
                  src={bookingVideoPreviewSrc}
                />
              ) : null}
              mediaType="booking_video"
              onFileChange={handleFileChange}
            />
          </AdminAccordionSection>

          <AdminAccordionSection
            icon={<ImagePlus className="size-4 text-primary" />}
            title="Gallery images"
          >
            <UploadField
              multiple
              accept="image/*"
              disabled={isUploading}
              description="Upload a new gallery set from the database only. New uploads replace the current venue gallery."
              id="admin-gallery-images-upload"
              mediaPreview={galleryPreviewImages.length ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryPreviewImages.map((image, index) => (
                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[#fffdf9] group"
                      key={`${image.src}-${index}`}
                    >
                      <Image alt={image.alt || `${selectedVenue?.name ?? "Venue"} gallery ${index + 1}`} className="object-cover" fill sizes="(min-width: 1024px) 22vw, 50vw" src={image.src} unoptimized />
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 rounded bg-[#d9534f] px-2 py-1 text-xs font-bold text-white opacity-80 hover:opacity-100"
                        title="Delete image"
                        disabled={isUploading}
                        onClick={() => handleDeleteMediaItem("gallery_image", image)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              mediaType="gallery_image"
              onFileChange={handleFileChange}
            />
          </AdminAccordionSection>

          <AdminAccordionSection
            icon={<Video className="size-4 text-primary" />}
            title="Testimony videos"
          >
            <UploadField
              multiple
              accept="video/mp4,video/webm"
              disabled={isUploading}
              description="Upload customer testimony videos for the homepage hero carousel."
              id="admin-testimony-videos-upload"
              mediaPreview={testimonyPreviewVideos.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {testimonyPreviewVideos.map((video, index) => (
                    <div
                      className="relative overflow-hidden rounded-[var(--radius-sm)] border border-border/70 bg-[#1f1712]"
                      key={`${video.src}-${index}`}
                    >
                      <video
                        className="aspect-[4/3] w-full object-cover"
                        controls
                        muted
                        playsInline
                        src={video.src}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 rounded bg-[#d9534f] px-2 py-1 text-xs font-bold text-white opacity-80 hover:opacity-100"
                        title="Delete video"
                        disabled={isUploading}
                        onClick={() => handleDeleteMediaItem("testimonial_video", video)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              mediaType="testimonial_video"
              onFileChange={handleFileChange}
            />
          </AdminAccordionSection>

          <AdminAccordionSection
            icon={<PencilLine className="size-4 text-primary" />}
            isLast
            title="Venue details"
          >
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-name">Hall name</Label>
                  <Input id="venue-name" value={detailsForm.name} onChange={updateDetailsField("name")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-badge">Hero pill label</Label>
                  <Input id="venue-badge" value={detailsForm.badgeLabel} onChange={updateDetailsField("badgeLabel")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-state">State</Label>
                  <Input id="venue-state" value={detailsForm.state} onChange={updateDetailsField("state")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-capacity-label">Capacity label</Label>
                  <Input id="venue-capacity-label" value={detailsForm.capacity} onChange={updateDetailsField("capacity")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-capacity-min">Minimum capacity</Label>
                  <Input id="venue-capacity-min" inputMode="numeric" value={detailsForm.capacityMin} onChange={updateDetailsField("capacityMin")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-capacity-max">Maximum capacity</Label>
                  <Input id="venue-capacity-max" inputMode="numeric" value={detailsForm.capacityMax} onChange={updateDetailsField("capacityMax")} />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="venue-description">Hero description</Label>
                <Textarea id="venue-description" className="min-h-24" value={detailsForm.description} onChange={updateDetailsField("description")} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="venue-intro">About the space</Label>
                <Textarea id="venue-intro" value={detailsForm.intro} onChange={updateDetailsField("intro")} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="venue-gallery-title">Gallery title</Label>
                <Input id="venue-gallery-title" value={detailsForm.galleryTitle} onChange={updateDetailsField("galleryTitle")} />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-address">Address</Label>
                  <Textarea id="venue-address" className="min-h-24" value={detailsForm.address} onChange={updateDetailsField("address")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-facilities">Facilities</Label>
                  <Textarea
                    id="venue-facilities"
                    className="min-h-24"
                    value={detailsForm.facilitiesText}
                    onChange={updateDetailsField("facilitiesText")}
                  />
                  <p className="text-[11px] text-muted-foreground">Add one facility per line.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-email">Contact email</Label>
                  <Input id="venue-email" value={detailsForm.contactEmail} onChange={updateDetailsField("contactEmail")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-phone">Contact phone</Label>
                  <Input id="venue-phone" value={detailsForm.contactPhone} onChange={updateDetailsField("contactPhone")} />
                </div>
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="venue-hours">Operating hours</Label>
                  <Input id="venue-hours" value={detailsForm.operatingHours} onChange={updateDetailsField("operatingHours")} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-deposit">Deposit amount</Label>
                  <Input id="venue-deposit" inputMode="numeric" value={detailsForm.depositAmount} onChange={updateDetailsField("depositAmount")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-hall-package">Hall package</Label>
                  <Input id="venue-hall-package" inputMode="numeric" value={detailsForm.hallPackage} onChange={updateDetailsField("hallPackage")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-furniture-package">Furniture package</Label>
                  <Input id="venue-furniture-package" inputMode="numeric" value={detailsForm.furniturePackage} onChange={updateDetailsField("furniturePackage")} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="venue-props-package">Props package</Label>
                  <Input id="venue-props-package" inputMode="numeric" value={detailsForm.propsPackage} onChange={updateDetailsField("propsPackage")} />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="venue-map">Google Maps embed URL</Label>
                <Textarea id="venue-map" className="min-h-20" value={detailsForm.mapEmbedUrl} onChange={updateDetailsField("mapEmbedUrl")} />
              </div>

              <div className="flex justify-end">
                <Button className={ADMIN_SAVE_BUTTON_CLASS} disabled={isSaving} type="button" onClick={saveVenueDetails}>
                  {isSaving ? "Saving" : "Save details"}
                </Button>
              </div>
            </div>
          </AdminAccordionSection>
        </div>
      </CardContent>
    </Card>
  );
}
