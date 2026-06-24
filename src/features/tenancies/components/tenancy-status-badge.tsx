import { Badge } from "@/components/ui";
import type { TenancyStatus } from "@/types/database";

type TenancyStatusBadgeProps = {
  status: TenancyStatus;
};

const statusStyles: Record<TenancyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pending: "bg-blue-50 text-blue-700 ring-blue-100",
  ended: "bg-slate-100 text-slate-700 ring-slate-200",
  cancelled: "bg-red-50 text-red-700 ring-red-100",
};

const statusLabels: Record<TenancyStatus, string> = {
  active: "Active",
  pending: "Pending",
  ended: "Ended",
  cancelled: "Cancelled",
};

export function TenancyStatusBadge({ status }: TenancyStatusBadgeProps) {
  return (
    <Badge className={statusStyles[status]} variant="slate">
      {statusLabels[status]}
    </Badge>
  );
}
