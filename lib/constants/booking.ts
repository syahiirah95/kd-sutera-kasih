export const EVENT_TYPES = [
  {
    description: "Suitable for receptions with pelamin, dining tables, and family stage moments.",
    id: "wedding-reception",
    label: "Wedding Reception",
  },
  {
    description: "Ideal for intimate ceremonies, solemnisation setups, and family gatherings.",
    id: "engagement",
    label: "Engagement Ceremony",
  },
  {
    description: "Works well for award stages, family seating, and photo moments after the event.",
    id: "graduation",
    label: "Graduation Event",
  },
  {
    description: "Designed for launches, appreciation nights, annual dinners, and company functions.",
    id: "corporate",
    label: "Corporate Function",
  },
  {
    description: "A flexible option for birthdays, reunions, community programmes, and private events.",
    id: "private-gathering",
    label: "Private Gathering",
  },
] as const;

export const OPERATING_HOURS = {
  end: "23:00",
  label: "8:00 AM - 11:00 PM",
  start: "08:00",
} as const;

export const SUGGESTED_TIME_WINDOWS = [
  {
    description: "A comfortable daytime window for ceremonies, luncheon receptions, and family programmes.",
    endTime: "14:00",
    label: "Day event",
    note: "Many hosts choose this window when they want a smooth lunch-hour flow.",
    startTime: "10:00",
  },
  {
    description: "A popular range for late afternoon celebrations and dinner events that continue through sunset.",
    endTime: "19:00",
    label: "Golden hour event",
    note: "Useful for photography moments, formal entrances, and evening dining service.",
    startTime: "15:00",
  },
  {
    description: "A strong fit for elegant night events, appreciation dinners, and formal private functions.",
    endTime: "23:00",
    label: "Evening reception",
    note: "Hosts often use this window for dramatic lighting and a stronger evening ambience.",
    startTime: "20:00",
  },
] as const;
