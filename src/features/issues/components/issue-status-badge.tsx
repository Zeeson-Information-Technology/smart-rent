import { cn } from "@/lib/utils/cn";
import type { IssueStatus } from "@/types/database";

type IssueStatusBadgeProps = {
  status: IssueStatus;
};

const styles: Record<IssueStatus, string> = {
  open: "bg-blue-50 text-blue-700 ring-blue-100",
  in_progress: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  awaiting_response: "bg-amber-50 text-amber-700 ring-amber-100",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
};

const labels: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_response: "Awaiting Response",
  resolved: "Resolved",
  closed: "Closed",
};

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

export function getIssueStatusLabel(status: IssueStatus) {
  return labels[status];
}
