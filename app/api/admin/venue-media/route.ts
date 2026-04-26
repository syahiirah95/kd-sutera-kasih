import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { getIsCurrentUserAdmin } from "@/lib/supabase/booking-data";

const BUCKET_ID = "kd_sutera_kasih_venue_media";

type MediaType = "gallery_image" | "testimonial_video";

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

function getStoragePath(venueSlug: string, mediaType: MediaType, fileName: string, index = 0) {
  if (mediaType === "testimonial_video") {
    return `venues/${venueSlug}/testimonials/${Date.now()}-${index + 1}-${fileName}`;
  }

  return `venues/${venueSlug}/gallery/${Date.now()}-${index + 1}-${fileName}`;
}

function isMissingStorageError(message: string) {
  return message.toLowerCase().includes("not found");
}

function getMediaTypeLabel(mediaType: MediaType) {
  return mediaType === "gallery_image" ? "gallery image" : "testimonial video";
}

async function authorizeAndLoadVenue(venueSlug: string) {
  const isAdmin = await getIsCurrentUserAdmin();

  if (!isAdmin) {
    return { error: "This account is not allowed to manage venue media.", status: 403 as const };
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return { error: "Supabase admin client is not configured.", status: 500 as const };
  }

  const { data: venue, error: venueError } = await supabase
    .from("kd_sutera_kasih_venues")
    .select("id, slug, name, gallery_title")
    .eq("slug", venueSlug)
    .single();

  if (venueError || !venue) {
    return { error: "Venue row was not found.", status: 404 as const };
  }

  return { supabase, venue };
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const venueSlug = String(formData.get("venueSlug") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "").trim() as MediaType;
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!venueSlug) {
    return NextResponse.json({ error: "Venue slug is required." }, { status: 400 });
  }

  if (mediaType !== "gallery_image" && mediaType !== "testimonial_video") {
    return NextResponse.json({ error: "Unsupported media type." }, { status: 400 });
  }

  if (!files.length) {
    return NextResponse.json({ error: "No files were uploaded." }, { status: 400 });
  }

  const authorized = await authorizeAndLoadVenue(venueSlug);

  if ("error" in authorized) {
    return NextResponse.json({ error: authorized.error }, { status: authorized.status });
  }

  const { supabase, venue } = authorized;
  const { data: existingMedia, error: existingMediaError } = await supabase
    .from("kd_sutera_kasih_venue_media")
    .select("sort_order, storage_path")
    .eq("venue_id", venue.id)
    .eq("media_type", mediaType)
    .eq("is_active", true)
    .order("sort_order", { ascending: false });

  if (existingMediaError) {
    return NextResponse.json({ error: existingMediaError.message }, { status: 500 });
  }

  const existingPaths = (existingMedia ?? [])
    .map((item) => item.storage_path)
    .filter((path): path is string => Boolean(path));

  if (mediaType === "gallery_image" && existingPaths.length) {
    const { error: deleteRowsError } = await supabase
      .from("kd_sutera_kasih_venue_media")
      .delete()
      .eq("venue_id", venue.id)
      .eq("media_type", mediaType)
      .in("storage_path", existingPaths);

    if (deleteRowsError) {
      return NextResponse.json({ error: deleteRowsError.message }, { status: 500 });
    }

    const { error: removeFilesError } = await supabase.storage.from(BUCKET_ID).remove(existingPaths);

    if (removeFilesError && !isMissingStorageError(removeFilesError.message)) {
      return NextResponse.json({ error: removeFilesError.message }, { status: 500 });
    }
  }

  const nextSortOrder = mediaType === "gallery_image" ? 0 : existingMedia?.[0]?.sort_order ?? 0;
  const uploadedItems: Array<{ src: string; storagePath: string }> = [];

  for (const [index, file] of files.entries()) {
    const filename = sanitizeFilename(file.name);
    const storagePath = getStoragePath(venue.slug, mediaType, filename, index);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from(BUCKET_ID).upload(storagePath, fileBuffer, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: true,
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("kd_sutera_kasih_venue_media")
      .insert({
        alt_text: `${venue.name} ${getMediaTypeLabel(mediaType)}`,
        bucket_id: BUCKET_ID,
        caption: mediaType === "gallery_image" ? venue.gallery_title : null,
        is_active: true,
        media_type: mediaType,
        sort_order: nextSortOrder + index + 1,
        storage_path: storagePath,
        venue_id: venue.id,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    uploadedItems.push({
      src: supabase.storage.from(BUCKET_ID).getPublicUrl(storagePath).data.publicUrl,
      storagePath,
    });
  }

  return NextResponse.json({ items: uploadedItems });
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mediaType?: MediaType;
    storagePath?: string;
    venueSlug?: string;
  } | null;

  const venueSlug = body?.venueSlug?.trim() ?? "";
  const mediaType = body?.mediaType;
  const storagePath = body?.storagePath?.trim() ?? "";

  if (!venueSlug || !storagePath || !mediaType) {
    return NextResponse.json({ error: "Venue slug, media type, and storage path are required." }, { status: 400 });
  }

  if (mediaType !== "gallery_image" && mediaType !== "testimonial_video") {
    return NextResponse.json({ error: "Unsupported media type." }, { status: 400 });
  }

  const authorized = await authorizeAndLoadVenue(venueSlug);

  if ("error" in authorized) {
    return NextResponse.json({ error: authorized.error }, { status: authorized.status });
  }

  const { supabase, venue } = authorized;
  const { data: deletedRow, error: deleteRowError } = await supabase
    .from("kd_sutera_kasih_venue_media")
    .delete()
    .eq("venue_id", venue.id)
    .eq("media_type", mediaType)
    .eq("storage_path", storagePath)
    .select("storage_path")
    .maybeSingle();

  if (deleteRowError) {
    return NextResponse.json({ error: deleteRowError.message }, { status: 500 });
  }

  if (!deletedRow) {
    return NextResponse.json({ error: "Media row was not found in the database." }, { status: 404 });
  }

  const { error: removeFileError } = await supabase.storage.from(BUCKET_ID).remove([storagePath]);

  if (removeFileError && !isMissingStorageError(removeFileError.message)) {
    return NextResponse.json({ error: removeFileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
