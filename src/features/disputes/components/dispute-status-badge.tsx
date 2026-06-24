import { cn } from "@/lib/utils/cn";
import type { DisputeStatus } from "@/types/database";

const styles: Record<DisputeStatus, string> = {
  open: "bg-blue-50 text-blue-700 ring-blue-100",
  under_review: "bg-orange-50 text-orange-700 ring-orange-100",
  in_progress: "bg-purple-50 text-purple-700 ring-purple-100",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const disputeStatusLabels: Record<DisputeStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", styles[status])}>
      {disputeStatusLabels[status]}
    </span>
  );
}
