export const EVENT_TYPES = [
  { id: "wedding-reception", label: "Wedding Reception" },
  { id: "engagement", label: "Engagement Ceremony" },
  { id: "graduation", label: "Graduation Event" },
  { id: "corporate", label: "Corporate Function" },
  { id: "private-gathering", label: "Private Gathering" },
] as const;

export const BOOKING_TIME_SLOTS = [
  {
    id: "slot-afternoon",
    label: "Afternoon Celebration",
    startTime: "10:00 AM",
    endTime: "2:00 PM",
  },
  {
    id: "slot-golden-hour",
    label: "Golden Hour Event",
    startTime: "3:00 PM",
    endTime: "7:00 PM",
  },
  {
    id: "slot-evening",
    label: "Evening Reception",
    startTime: "8:00 PM",
    endTime: "11:00 PM",
  },
] as const;
