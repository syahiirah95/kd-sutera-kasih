import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { getVenueBySlug, VENUES, type VenueMediaRecord, type VenueRecord } from "@/lib/data/venues";

type VenueRow = {
  address: string;
  badge_label: string | null;
  capacity_label: string;
  capacity_max: number | null;
  capacity_min: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  deposit_amount: number;
  description: string;
  facilities: string[];
  furniture_package: number;
  gallery_title: string | null;
  hall_package: number;
  id: string;
  intro: string;
  map_embed_url: string | null;
  name: string;
  operating_hours: string | null;
  policies: string[];
  props_package: number;
  slug: string;
  sort_order: number;
  state: string;
};

type VenueMediaRow = {
  alt_text: string | null;
  bucket_id: string;
  caption: string | null;
  is_active: boolean;
  media_type: "booking_video" | "gallery_image" | "hero_image" | "testimonial_video" | "thumbnail";
  public_url: string | null;
  sort_order: number;
  storage_path: string;
  venue_id: string;
};

export type VenuePageData = {
  activeVenue: VenueRecord;
  venues: VenueRecord[];
};

function attachStaticFallbacks(venue: VenueRecord): VenueRecord {
  return {
    ...venue,
    badgeLabel: venue.badgeLabel ?? "Featured Venue",
    gallery: venue.gallery ?? [],
    testimonyVideos: venue.testimonyVideos ?? [],
  };
}

function getMediaUrl(
  media: VenueMediaRow,
  getPublicUrl: (bucketId: string, path: string) => string,
) {
  return media.public_url || getPublicUrl(media.bucket_id, media.storage_path);
}

function mapVenueRows(
  venueRows: VenueRow[],
  mediaRows: VenueMediaRow[],
  getPublicUrl: (bucketId: string, path: string) => string,
) {
  return venueRows.map((venue): VenueRecord => {
    const venueMedia = mediaRows
      .filter((media) => media.venue_id === venue.id && media.is_active)
      .sort((left, right) => left.sort_order - right.sort_order);
    const hero = venueMedia.find((media) => media.media_type === "hero_image");
    const bookingVideo = venueMedia.find((media) => media.media_type === "booking_video");
    const gallery = venueMedia
      .filter((media) => media.media_type === "gallery_image")
      .map((media): VenueMediaRecord => ({
        alt: media.alt_text || `${venue.name} gallery image`,
        caption: media.caption ?? undefined,
        src: getMediaUrl(media, getPublicUrl),
        storagePath: media.storage_path,
      }));
    const testimonyVideos = venueMedia
      .filter((media) => media.media_type === "testimonial_video")
      .map((media): VenueMediaRecord => ({
        alt: media.alt_text || `${venue.name} testimony video`,
        caption: media.caption ?? undefined,
        src: getMediaUrl(media, getPublicUrl),
        storagePath: media.storage_path,
      }));

    return {
      address: venue.address,
      badgeLabel: venue.badge_label ?? undefined,
      bookingVideoSrc: bookingVideo ? getMediaUrl(bookingVideo, getPublicUrl) : undefined,
      capacity: venue.capacity_label,
      capacityMax: venue.capacity_max ?? undefined,
      capacityMin: venue.capacity_min ?? undefined,
      contactEmail: venue.contact_email ?? "",
      contactPhone: venue.contact_phone ?? "",
      description: venue.description,
      facilities: venue.facilities ?? [],
      gallery,
      galleryTitle: venue.gallery_title ?? "",
      heroImageSrc: hero ? getMediaUrl(hero, getPublicUrl) : undefined,
      intro: venue.intro,
      mapEmbedUrl: venue.map_embed_url ?? undefined,
      name: venue.name,
      operatingHours: venue.operating_hours ?? "",
      policies: venue.policies ?? [],
      pricing: {
        depositAmount: venue.deposit_amount,
        furniturePackage: venue.furniture_package,
        hallPackage: venue.hall_package,
        propsPackage: venue.props_package,
      },
      slug: venue.slug,
      state: venue.state,
      testimonyVideos,
    };
  });
}

export async function getVenuesFromSupabase(): Promise<VenueRecord[]> {
  noStore();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return VENUES.map(attachStaticFallbacks);
  }

  const { data: venueRows, error: venueError } = await supabase
    .from("kd_sutera_kasih_venues")
    .select(
      "id, slug, name, badge_label, state, address, capacity_min, capacity_max, capacity_label, description, intro, gallery_title, contact_email, contact_phone, operating_hours, facilities, policies, map_embed_url, deposit_amount, hall_package, furniture_package, props_package, sort_order",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (venueError || !venueRows?.length) {
    return VENUES.map(attachStaticFallbacks);
  }

  const venueIds = venueRows.map((venue) => venue.id);
  const { data: mediaRows } = await supabase
    .from("kd_sutera_kasih_venue_media")
    .select("venue_id, media_type, bucket_id, storage_path, public_url, alt_text, caption, sort_order, is_active")
    .in("venue_id", venueIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const getPublicUrl = (bucketId: string, path: string) =>
    supabase.storage.from(bucketId).getPublicUrl(path).data.publicUrl;

  return mapVenueRows(
    venueRows as VenueRow[],
    (mediaRows ?? []) as VenueMediaRow[],
    getPublicUrl,
  ).map(attachStaticFallbacks);
}

export async function getVenuePageData(slug?: string): Promise<VenuePageData> {
  noStore();
  const venues = await getVenuesFromSupabase();
  const activeVenue = venues.find((venue) => venue.slug === slug) ?? venues[0] ?? attachStaticFallbacks(getVenueBySlug(slug));

  return {
    activeVenue,
    venues,
  };
}
