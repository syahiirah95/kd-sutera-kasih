export type VenueRecord = {
  address: string;
  badgeLabel?: string;
  bookingVideoSrc?: string;
  capacity: string;
  capacityMax?: number;
  capacityMin?: number;
  contactEmail: string;
  contactPhone: string;
  description: string;
  facilities: string[];
  gallery?: VenueMediaRecord[];
  galleryTitle: string;
  heroImageSrc?: string;
  intro: string;
  mapEmbedUrl?: string;
  name: string;
  operatingHours: string;
  policies: string[];
  pricing: {
    depositAmount: number;
    furniturePackage: number;
    hallPackage: number;
    propsPackage: number;
  };
  slug: string;
  state: string;
  testimonyVideos?: VenueMediaRecord[];
};

export type VenueMediaRecord = {
  alt: string;
  caption?: string;
  src: string;
  storagePath?: string;
};

const STANDARD_AMENITIES = [
  "In-house bar service",
  "Professional sound & lighting",
  "Bridal & green rooms",
  "Valet parking",
  "Wheelchair accessible",
  "Climate-controlled hall",
  "On-site coordinator",
  "High-speed Wi-Fi",
];

export const VENUES: VenueRecord[] = [
  {
    address: "142 Persiaran Sereni, Shah Alam, Selangor",
    capacity: "80 - 320 guests",
    contactEmail: "cinta@suterakasih.example",
    contactPhone: "+60 13-820 1142",
    description: "Sutera Cinta is a polished ballroom-style venue in Selangor, designed for elegant receptions, solemn occasions, and milestone celebrations that need a refined yet welcoming atmosphere.",
    facilities: STANDARD_AMENITIES,
    galleryTitle: "Warm reception atmosphere and polished ballroom styling",
    intro: "Sutera Cinta balances elegance and comfort for wedding receptions, engagement ceremonies, and intimate milestone events. The hall is especially popular for hosts who want a classic ballroom feeling with smooth guest flow and a polished arrival experience.",
    name: "Sutera Cinta",
    operatingHours: "9:00 AM - 11:30 PM, Monday through Sunday",
    policies: [
      "Custom booking times are reviewed again before final confirmation.",
      "Large decor or live performance setups should be noted during booking.",
      "Venue team will advise on layout suitability based on guest count and event type.",
    ],
    pricing: {
      depositAmount: 500,
      furniturePackage: 650,
      hallPackage: 3200,
      propsPackage: 850,
    },
    slug: "sutera-kasih-cinta",
    state: "Selangor",
  },
  {
    address: "28 Jalan Pesisir Mutiara, Johor Bahru, Johor",
    capacity: "60 - 260 guests",
    contactEmail: "rindu@suterakasih.example",
    contactPhone: "+60 17-441 2035",
    description: "Sutera Rindu brings a softer, more intimate hall experience in Johor, designed for engagement events, family gatherings, and community celebrations that need a warm yet welcoming atmosphere.",
    facilities: STANDARD_AMENITIES,
    galleryTitle: "An intimate space for heartfelt gatherings and smaller celebrations",
    intro: "Sutera Rindu is suited to events that feel personal and close-knit. It works beautifully for engagement ceremonies, doa selamat gatherings, and smaller receptions where atmosphere and family comfort matter most.",
    name: "Sutera Rindu",
    operatingHours: "10:00 AM - 10:30 PM, Monday through Sunday",
    policies: [
      "Layout planning is recommended for events with more than 180 guests.",
      "Live cooking and heavier vendor load-in should be scheduled in advance.",
      "Final approval depends on the venue calendar and setup requirements.",
    ],
    pricing: {
      depositAmount: 450,
      furniturePackage: 520,
      hallPackage: 2600,
      propsPackage: 700,
    },
    slug: "sutera-kasih-rindu",
    state: "Johor",
  },
  {
    address: "55 Lebuh Seri Bayu, George Town, Pulau Pinang",
    capacity: "100 - 380 guests",
    contactEmail: "pesona@suterakasih.example",
    contactPhone: "+60 12-502 7714",
    description: "Sutera Pesona offers a brighter, larger-capacity venue in Penang, designed for wedding receptions, annual dinners, and private functions that need a spacious yet polished atmosphere.",
    facilities: STANDARD_AMENITIES,
    galleryTitle: "A brighter large-capacity hall for receptions and corporate dinners",
    intro: "Sutera Pesona is designed for events that need more breathing room. From high-guest-count receptions to polished dinner functions, this hall offers stronger capacity support while still feeling warm and premium.",
    name: "Sutera Pesona",
    operatingHours: "9:00 AM - 11:00 PM, Monday through Sunday",
    policies: [
      "High-capacity events may require layout approval before confirmation.",
      "Vendor access windows should match the selected booking time range.",
      "3D preview recommendations are most useful for large-scale setups in this hall.",
    ],
    pricing: {
      depositAmount: 650,
      furniturePackage: 820,
      hallPackage: 4200,
      propsPackage: 1100,
    },
    slug: "sutera-kasih-pesona",
    state: "Pulau Pinang",
  },
  {
    address: "19 Jalan Taman Damai, Seremban, Negeri Sembilan",
    capacity: "70 - 280 guests",
    contactEmail: "bahagia@suterakasih.example",
    contactPhone: "+60 14-330 9648",
    description: "Sutera Bahagia is a practical and elegant hall in Negeri Sembilan, designed for graduations, family receptions, and private functions that need a flexible yet polished atmosphere.",
    facilities: STANDARD_AMENITIES,
    galleryTitle: "A balanced hall for family events, graduations, and receptions",
    intro: "Sutera Bahagia is a versatile choice when you need a hall that feels polished but still practical. It works especially well for graduations, family functions, and celebrations that need flexible seating and easy movement.",
    name: "Sutera Bahagia",
    operatingHours: "9:30 AM - 11:00 PM, Monday through Sunday",
    policies: [
      "Graduation and stage-heavy events should indicate AV needs during booking.",
      "The hall supports both banquet and open-floor arrangements.",
      "Final setup suitability is reviewed together with guest count and notes.",
    ],
    pricing: {
      depositAmount: 480,
      furniturePackage: 580,
      hallPackage: 2900,
      propsPackage: 720,
    },
    slug: "sutera-kasih-bahagia",
    state: "Negeri Sembilan",
  },
  {
    address: "7 Jalan Seri Kenanga, Ayer Keroh, Melaka",
    capacity: "90 - 300 guests",
    contactEmail: "anggun@suterakasih.example",
    contactPhone: "+60 19-288 6401",
    description: "Sutera Anggun is a polished Melaka venue with a romantic atmosphere, designed for wedding receptions, vow celebrations, and styled evening events that need a graceful yet welcoming setting.",
    facilities: STANDARD_AMENITIES,
    galleryTitle: "A romantic ballroom atmosphere for elegant evening celebrations",
    intro: "Sutera Anggun leans into a softer and more romantic hall presentation. It suits hosts who want a graceful visual mood for receptions, solemn celebrations, and evening events that feel warm and memorable.",
    name: "Sutera Anggun",
    operatingHours: "10:00 AM - 11:30 PM, Monday through Sunday",
    policies: [
      "Evening ambience setups should be included in the notes section when booking.",
      "Custom planner layouts are encouraged for pelamin-focused events.",
      "Venue review will confirm timing, layout suitability, and staging needs.",
    ],
    pricing: {
      depositAmount: 520,
      furniturePackage: 640,
      hallPackage: 3400,
      propsPackage: 900,
    },
    slug: "sutera-kasih-anggun",
    state: "Melaka",
  },
] as const;

export function getVenueBySlug(slug?: string) {
  return VENUES.find((venue) => venue.slug === slug) ?? VENUES[0];
}
