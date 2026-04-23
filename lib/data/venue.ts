import {
  CalendarDays,
  CircleHelp,
  LayoutPanelTop,
  ShieldCheck,
} from "lucide-react";

export const VENUE_DETAILS = {
  description:
    "Dewan Sutera Kasih is positioned as a premium single-venue experience with flexible layouts, exact custom time slots, and a planner-ready flow for polished event bookings.",
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
    "Bookings must use exact start and end times shown in the slot picker.",
    "Slot availability is rechecked before final submission and again during admin approval.",
    "The competition build uses a demo role switch after login so judges can test both user and admin views.",
  ],
} as const;

export const HIGHLIGHT_ITEMS = [
  {
    description: "Single-venue focus keeps the MVP sharp while leaving room for future multi-venue expansion.",
    icon: LayoutPanelTop,
    title: "Modular architecture",
  },
  {
    description: "Exact start and end times reduce confusion and support realistic availability logic from the beginning.",
    icon: CalendarDays,
    title: "Custom slot clarity",
  },
  {
    description: "Hover tooltips and click modals help judges understand unfamiliar flows without cluttering the layout.",
    icon: CircleHelp,
    title: "Built-in guidance",
  },
  {
    description: "OWASP-aware planning, Supabase-ready auth helpers, and route separation keep the scaffold honest and practical.",
    icon: ShieldCheck,
    title: "Security-first setup",
  },
] as const;
