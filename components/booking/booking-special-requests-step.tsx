import { type BookingFormData } from "@/components/booking/booking-request-types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookingSpecialRequestsStepProps = {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: string) => void;
};

export function BookingSpecialRequestsStep({
  formData,
  updateField,
}: BookingSpecialRequestsStepProps) {
  return (
    <section className="space-y-3">
      <div className="grid gap-1.5">
        <Label className="text-[13px]" htmlFor="theme-style">Theme or style (optional)</Label>
        <Textarea
          id="theme-style"
          className="h-16 min-h-0 resize-none rounded-[var(--radius-sm)] px-3 py-3 text-sm"
          placeholder="e.g. romantic ivory & gold"
          rows={2}
          value={formData.themeStyle}
          onChange={(event) => updateField("themeStyle", event.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-[13px]" htmlFor="special-requests">Requests and setup notes (optional)</Label>
        <Textarea
          id="special-requests"
          className="h-20 min-h-0 resize-none rounded-[var(--radius-sm)] px-3 py-3 text-sm"
          placeholder="Catering preferences, accessibility, music, setup, vendors, etc."
          rows={3}
          value={formData.specialRequests}
          onChange={(event) => updateField("specialRequests", event.target.value)}
        />
      </div>
    </section>
  );
}
