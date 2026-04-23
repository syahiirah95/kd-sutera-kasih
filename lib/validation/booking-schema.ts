import { z } from "zod";

export const bookingSchema = z.object({
  contactEmail: z.email("Please enter a valid email address."),
  contactName: z
    .string()
    .trim()
    .min(2, "Please enter the contact name."),
  eventDate: z.string().min(1, "Please choose an event date."),
  eventType: z.string().min(1, "Please choose an event type."),
  guestCount: z
    .number()
    .int()
    .min(10, "Guest count must be at least 10.")
    .max(1200, "Guest count exceeds the venue capacity."),
  phoneNumber: z.string().min(8, "Please enter a valid phone number."),
  timeSlotId: z.string().min(1, "Please select a time slot."),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
