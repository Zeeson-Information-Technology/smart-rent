import { IssuePriorityBadge } from "@/features/issues/components";
import type { IssuePriority } from "@/types/database";

export function DisputePriorityBadge({ priority }: { priority: IssuePriority }) {
  return <IssuePriorityBadge priority={priority} />;
}
