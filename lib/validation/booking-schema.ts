import { z } from "zod";

export const bookingSchema = z.object({
  contactEmail: z.email("Please enter a valid email address."),
  contactName: z
    .string()
    .trim()
    .min(2, "Please enter the contact name."),
  endTime: z.string().min(1, "Please choose an end time."),
  eventDate: z.string().min(1, "Please choose an event date."),
  eventType: z.string().min(1, "Please choose an event type."),
  guestCount: z
    .number()
    .int()
    .min(10, "Guest count must be at least 10.")
    .max(1200, "Guest count exceeds the venue capacity."),
  phoneNumber: z.string().min(8, "Please enter a valid phone number."),
  startTime: z.string().min(1, "Please choose a start time."),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be later than start time.",
  path: ["endTime"],
});

export type BookingSchema = z.infer<typeof bookingSchema>;
