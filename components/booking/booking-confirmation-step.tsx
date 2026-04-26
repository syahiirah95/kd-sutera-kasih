"use client";

import { type BookingFormData } from "@/components/booking/booking-request-types";
import { Button } from "@/components/ui/button";

type BookingConfirmationStepProps = {
  bookingReference?: string;
  formData: BookingFormData;
  onStartNewRequest: () => void;
  paymentMethod: string;
  selectedEventType: string;
  selectedTimeRange: string;
  selectedVenueBookingVideoSrc?: string;
  selectedVenueContactPhone: string;
  selectedVenueName: string;
  selectedVenuePricing?: {
    depositAmount: number;
    furniturePackage: number;
    hallPackage: number;
    propsPackage: number;
  };
};

export type BookingReceiptDownloadDetails = {
  bookingReference?: string;
  fileName?: string;
  formData: BookingFormData;
  paymentMethod: string;
  paymentSectionTitle?: string;
  paymentStatusLabel?: string;
  receiptTitle?: string;
  selectedEventType: string;
  selectedTimeRange: string;
  selectedVenueBookingVideoSrc?: string;
  selectedVenueContactPhone: string;
  selectedVenueName: string;
  selectedVenuePricing?: {
    depositAmount: number;
    furniturePackage: number;
    hallPackage: number;
    propsPackage: number;
  };
};

const CONFIRM_ACTION_BUTTON_CLASS =
  "booking-form-nav-primary !h-7 !w-24 !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-2 !text-[11px] !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]";

function escapePdfText(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function formatRinggit(value: number) {
  return `RM ${value.toLocaleString("en-MY")}`;
}

function truncatePdfText(value: string, maxLength = 86) {
  if (!value) {
    return "Not added";
  }

  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function pdfColor([red, green, blue]: readonly [number, number, number]) {
  return `${red} ${green} ${blue}`;
}

function pdfRect(x: number, y: number, width: number, height: number, color: readonly [number, number, number]) {
  return `q ${pdfColor(color)} rg ${x} ${y} ${width} ${height} re f Q`;
}

function pdfStroke(x1: number, y1: number, x2: number, y2: number, color: readonly [number, number, number]) {
  return `q ${pdfColor(color)} RG 0.6 w ${x1} ${y1} m ${x2} ${y2} l S Q`;
}

function pdfText(
  text: string,
  x: number,
  y: number,
  options: {
    color?: readonly [number, number, number];
    font?: "F1" | "F2" | "F3";
    size?: number;
  } = {},
) {
  const color = options.color ?? [0.21, 0.15, 0.11];
  const font = options.font ?? "F1";
  const size = options.size ?? 10;

  return `BT ${pdfColor(color)} rg /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;
}

function pdfRows(rows: Array<[string, string]>, startY: number, x = 58) {
  const commands: string[] = [];
  rows.forEach(([label, value], index) => {
    const y = startY - index * 18;
    commands.push(pdfText(label, x, y, { color: [0.45, 0.35, 0.29], size: 9 }));
    commands.push(pdfText(value, x + 116, y, { font: "F2", size: 9.5 }));
    commands.push(pdfStroke(x, y - 5, 537, y - 5, [0.86, 0.78, 0.69]));
  });
  return commands;
}

function pdfSection(title: string, y: number) {
  return [
    pdfText(title.toUpperCase(), 58, y, { color: [0.55, 0.32, 0.17], font: "F2", size: 10 }),
    pdfStroke(58, y - 7, 537, y - 7, [0.76, 0.55, 0.35]),
  ];
}

export function downloadBookingPdf(details: BookingReceiptDownloadDetails) {
  const {
    bookingReference,
    fileName,
    formData,
    paymentMethod,
    paymentSectionTitle,
    paymentStatusLabel,
    receiptTitle,
    selectedEventType,
    selectedTimeRange,
    selectedVenueContactPhone,
    selectedVenueName,
    selectedVenuePricing,
  } = details;
  const pricing = selectedVenuePricing ?? {
    depositAmount: 500,
    furniturePackage: 650,
    hallPackage: 3200,
    propsPackage: 850,
  };
  const estimatedTotal = pricing.hallPackage + pricing.furniturePackage + pricing.propsPackage;
  const commands = [
    pdfRect(0, 0, 595, 842, [0.98, 0.94, 0.88]),
    pdfRect(36, 54, 523, 706, [1, 0.99, 0.96]),
    pdfRect(36, 724, 523, 36, [0.79, 0.49, 0.19]),
    pdfText("Sutera Kasih Hall", 58, 736, { color: [1, 1, 1], font: "F2", size: 21 }),
    pdfText(receiptTitle || "Booking Request Receipt", 365, 740, { color: [1, 0.94, 0.84], font: "F2", size: 12 }),
    pdfText(`Reference: ${bookingReference || "Pending reference"}`, 58, 706, { color: [0.55, 0.32, 0.17], font: "F2", size: 10 }),
    pdfText("Status: Pending venue review", 382, 706, { color: [0.55, 0.32, 0.17], font: "F2", size: 10 }),
    ...pdfSection("Event", 675),
    ...pdfRows(
      [
        ["Venue", selectedVenueName],
        ["Event type", selectedEventType],
        ["Date", formData.eventDate],
        ["Time", selectedTimeRange],
        ["Guests", formData.guestCount || "Not added"],
      ],
      652,
    ),
    ...pdfSection("Contact", 545),
    ...pdfRows(
      [
        ["Name", formData.contactName || "Not added"],
        ["Email", formData.contactEmail || "Not added"],
        ["Phone", formData.phoneNumber || "Not added"],
        ["Organization", formData.organization || "Optional"],
      ],
      522,
    ),
    ...pdfSection("Layout Notes", 432),
    ...pdfRows(
      [
        ["Theme / style", truncatePdfText(formData.themeStyle, 68)],
        ["Setup notes", truncatePdfText(formData.specialRequests, 68)],
      ],
      409,
    ),
    ...pdfSection("Transparent Pricing", 340),
    ...pdfRows(
      [
        ["Hall package", formatRinggit(pricing.hallPackage)],
        ["Furniture", formatRinggit(pricing.furniturePackage)],
        ["Props / decor", formatRinggit(pricing.propsPackage)],
      ],
      317,
    ),
    pdfRect(58, 240, 479, 34, [0.96, 0.88, 0.74]),
    pdfText("Estimated total", 74, 253, { color: [0.45, 0.25, 0.11], font: "F2", size: 12 }),
    pdfText(formatRinggit(estimatedTotal), 440, 253, { color: [0.45, 0.25, 0.11], font: "F2", size: 14 }),
    ...pdfSection(paymentSectionTitle || "Payment Deposit", 212),
    ...pdfRows(
      [
        ["Payment method", paymentMethod],
        ["Deposit now", formatRinggit(pricing.depositAmount)],
        ["Payment status", paymentStatusLabel || "Mock payment pending"],
      ],
      189,
    ),
    ...pdfSection("Next Step", 112),
    pdfText(`Contact ${selectedVenueContactPhone} if anything looks off.`, 58, 90, {
      color: [0.45, 0.35, 0.29],
      size: 9.5,
    }),
    pdfText("Our team will review this request and follow up with final confirmation.", 58, 74, {
      color: [0.45, 0.35, 0.29],
      size: 9.5,
    }),
  ];
  const stream = commands.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >> endobj",
    `7 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefPosition = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join("\n");
  pdf += `\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "sutera-kasih-booking-request.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

export function BookingConfirmationStep({
  bookingReference,
  formData,
  onStartNewRequest,
  paymentMethod,
  selectedEventType,
  selectedTimeRange,
  selectedVenueBookingVideoSrc,
  selectedVenueContactPhone,
  selectedVenueName,
  selectedVenuePricing,
}: BookingConfirmationStepProps) {
  const pdfDetails = {
    formData,
    bookingReference,
    paymentMethod,
    selectedEventType,
    selectedTimeRange,
    selectedVenueBookingVideoSrc,
    selectedVenueContactPhone,
    selectedVenueName,
    selectedVenuePricing,
  };

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <div className="relative h-32 w-full max-w-lg overflow-hidden rounded-[var(--radius-sm)] shadow-[0_8px_20px_rgba(114,76,43,0.08)]">
        {selectedVenueBookingVideoSrc ? (
          <video
            aria-label="Venue event preview"
            className="absolute inset-0 size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={selectedVenueBookingVideoSrc} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(52,38,29,0.02)_0%,rgba(52,38,29,0.16)_100%)]" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {bookingReference ? (
          <p className="w-full text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#8d542d]">
            Reference {bookingReference}
          </p>
        ) : null}
        <Button
          className={CONFIRM_ACTION_BUTTON_CLASS}
          onClick={() => downloadBookingPdf(pdfDetails)}
        >
          Download PDF
        </Button>
        <Button
          className={CONFIRM_ACTION_BUTTON_CLASS}
          onClick={onStartNewRequest}
        >
          New booking
        </Button>
      </div>
    </div>
  );
}
