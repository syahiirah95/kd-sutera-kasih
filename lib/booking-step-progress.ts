import { type BookingFormData } from "@/components/booking/booking-request-types";

function fraction(checks: boolean[]) {
  const total = checks.length || 1;
  const done = checks.filter(Boolean).length;
  return done / total;
}

export function getBookingStepProgresses(
  formData: BookingFormData,
  timeRangeIsValid: boolean,
  layoutSkipped: boolean,
) {
  return [
    fraction([
      Boolean(formData.venueSlug),
      Boolean(formData.eventType),
      Boolean(formData.guestCount),
      Boolean(formData.eventDate),
      timeRangeIsValid,
    ]),
    fraction([
      Boolean(formData.contactName),
      Boolean(formData.contactEmail),
      Boolean(formData.phoneNumber),
    ]),
    fraction([
      Boolean(formData.themeStyle),
      Boolean(formData.specialRequests),
      Boolean(formData.vendorNotes),
    ]),
    layoutSkipped ? 1 : 0.42,
    1,
  ];
}
