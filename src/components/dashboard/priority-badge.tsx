import { cn } from "@/lib/utils/cn";

type PriorityBadgeProps = {
  priority: "Low" | "Medium" | "High" | "Urgent";
};

const styles: Record<PriorityBadgeProps["priority"], string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Medium: "bg-orange-50 text-orange-700 ring-orange-100",
  High: "bg-red-50 text-red-700 ring-red-100",
  Urgent: "bg-red-50 text-red-700 ring-red-100",
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}
