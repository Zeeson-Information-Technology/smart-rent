import { cn } from "@/lib/utils/cn";
import type { IssuePriority } from "@/types/database";

type IssuePriorityBadgeProps = {
  priority: IssuePriority;
};

const styles: Record<IssuePriority, string> = {
  high: "bg-red-50 text-red-700 ring-red-100",
  medium: "bg-orange-50 text-orange-700 ring-orange-100",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

const labels: Record<IssuePriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function IssuePriorityBadge({ priority }: IssuePriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[priority],
      )}
    >
      {labels[priority]}
    </span>
  );
}
