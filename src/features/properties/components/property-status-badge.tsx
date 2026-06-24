import { Badge } from "@/components/ui";
import type { PropertyStatus } from "@/types/database";

type PropertyStatusBadgeProps = {
  status: PropertyStatus;
};

const statusStyles: Record<PropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  inactive: "bg-slate-100 text-slate-700 ring-slate-200",
  maintenance: "bg-orange-50 text-orange-700 ring-orange-100",
};

const statusLabels: Record<PropertyStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  maintenance: "Maintenance",
};

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  return (
    <Badge className={statusStyles[status]} variant="slate">
      {statusLabels[status]}
    </Badge>
  );
}
