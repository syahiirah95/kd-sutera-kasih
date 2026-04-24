import { type BookingStatus } from "@/lib/types/booking";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:
    "!border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !text-white shadow-[0_8px_20px_rgba(184,111,41,0.18)]",
  approved:
    "!border-success/45 !bg-[linear-gradient(135deg,#78a979_0%,#5f8a65_56%,#a8cfa7_100%)] !text-white shadow-[0_8px_20px_rgba(95,138,101,0.16)]",
  rejected:
    "!border-[#ff1f2d]/60 !bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] !text-white shadow-[0_8px_20px_rgba(224,0,18,0.16)]",
};

export function StatusBadge({
  children,
  status,
}: Readonly<{
  children?: React.ReactNode;
  status: BookingStatus;
}>) {
  return (
    <Badge className={`!w-[5.35rem] justify-center !px-0 ${STATUS_STYLES[status]}`}>
      {children ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
