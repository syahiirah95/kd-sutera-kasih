import { type BookingStatus } from "@/lib/types/booking";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "border-warning/30 bg-warning/15 text-warning",
  approved: "border-success/30 bg-success/15 text-success",
  rejected: "border-destructive/30 bg-destructive/15 text-destructive",
};

export function StatusBadge({
  children,
  status,
}: Readonly<{
  children?: React.ReactNode;
  status: BookingStatus;
}>) {
  return (
    <Badge className={STATUS_STYLES[status]}>
      {children ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
