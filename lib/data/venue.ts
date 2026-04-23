import {
  CalendarDays,
  CircleHelp,
  LayoutPanelTop,
  ShieldCheck,
} from "lucide-react";

export const VENUE_DETAILS = {
  description:
    "Dewan Sutera Kasih offers a warm, elegant event space for wedding receptions, engagement ceremonies, graduation celebrations, corporate gatherings, and private functions with flexible setup options and clear booking slots.",
  facilities: [
    "Indoor main hall with flexible layout zones",
    "Bridal room and prep space",
    "Sound-ready stage area",
    "Parking and guest arrival flow",
    "Registration and reception setup area",
    "Photo and gallery-ready corners",
  ],
  name: "Dewan Sutera Kasih",
  policies: [
    "Booking requests follow the exact start and end times shown in the slot picker.",
    "Slot availability is reviewed again before final confirmation to avoid schedule conflicts.",
    "Large setup requests may be reviewed together with layout and event notes before approval.",
  ],
} as const;

export const VENUE_GALLERY = [
  {
    alt: "Main hall inspiration",
    category: "Grand hall",
    src: "/venue-gallery/Screenshot_1.png",
  },
  {
    alt: "Stage and pelamin styling",
    category: "Stage styling",
    src: "/venue-gallery/Screenshot_10.png",
  },
  {
    alt: "Reception seating arrangement",
    category: "Reception setup",
    src: "/venue-gallery/Screenshot_17.png",
  },
  {
    alt: "Elegant aisle presentation",
    category: "Ceremony mood",
    src: "/venue-gallery/Screenshot_21.png",
  },
] as const;

export const BOOKING_EXPERIENCE_NOTES = [
  "Clear booking steps from event details to final submission",
  "Exact time slots with visible start and end times",
  "Helpful guidance throughout the booking journey",
  "Flexible event support for weddings, graduations, and private functions",
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The hall felt premium the moment we arrived. What we loved most was being able to picture the setup before committing to the booking.",
    name: "Aina & Hakim",
    role: "Wedding Reception",
  },
  {
    quote:
      "The exact time-slot flow is much clearer than the usual morning or evening labels. It made planning our graduation dinner way easier.",
    name: "Nabilah Rahman",
    role: "Graduation Event Organizer",
  },
  {
    quote:
      "Everything felt professional and easy to understand, from viewing the hall details to sending the booking request.",
    name: "Faris Zulkifli",
    role: "Corporate Event Coordinator",
  },
] as const;

export const VENUE_VIDEO_NOTES = [
  "A short hall preview helps guests understand the atmosphere before sending a request.",
  "Video makes it easier to picture lighting, spaciousness, and overall event mood.",
  "It adds confidence for customers comparing the hall with other venue options.",
] as const;

export const HIGHLIGHT_ITEMS = [
  {
    description: "A spacious hall with flexible arrangements for dining, ceremonies, stage moments, and guest flow.",
    icon: LayoutPanelTop,
    title: "Flexible setup options",
  },
  {
    description: "Choose clear start and end times so planning feels straightforward from the beginning.",
    icon: CalendarDays,
    title: "Exact booking slots",
  },
  {
    description: "Helpful guidance is available throughout the booking flow to make each step easier to understand.",
    icon: CircleHelp,
    title: "Easy-to-follow booking journey",
  },
  {
    description: "A polished presentation that helps customers feel confident when considering Dewan Sutera Kasih for their event.",
    icon: ShieldCheck,
    title: "Professional venue experience",
  },
] as const;
