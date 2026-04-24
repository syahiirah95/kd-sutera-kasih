import { type BookingFormData } from "@/components/booking/booking-request-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BookingContactDetailsStepProps = {
  formData: BookingFormData;
  updateField: (field: keyof BookingFormData, value: string) => void;
};

export function BookingContactDetailsStep({
  formData,
  updateField,
}: BookingContactDetailsStepProps) {
  return (
    <section className="space-y-3">
      <div className="grid gap-2.5 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="contact-name">Full name</Label>
          <Input
            className="h-9 rounded-[var(--radius-sm)] px-3 text-sm"
            id="contact-name"
            placeholder="Jane Doe"
            value={formData.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="contact-email">Email</Label>
          <Input
            className="h-9 rounded-[var(--radius-sm)] px-3 text-sm"
            id="contact-email"
            placeholder="you@example.com"
            type="email"
            value={formData.contactEmail}
            onChange={(event) => updateField("contactEmail", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="contact-phone">Phone</Label>
          <Input
            className="h-9 rounded-[var(--radius-sm)] px-3 text-sm"
            id="contact-phone"
            placeholder="+60 12-345 6789"
            value={formData.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="organization">Organization (optional)</Label>
          <Input
            className="h-9 rounded-[var(--radius-sm)] px-3 text-sm"
            id="organization"
            placeholder="Company / family name"
            value={formData.organization}
            onChange={(event) => updateField("organization", event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
