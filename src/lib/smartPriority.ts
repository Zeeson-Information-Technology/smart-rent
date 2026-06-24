import type { IssueCategory, IssuePriority } from "@/types/database";

const categoryPriorityMap: Record<IssueCategory, IssuePriority> = {
  "Water Leak": "high",
  "Electrical Fault": "high",
  "Heating Failure": "high",
  "Security Issue": "high",
  "Noise Complaint": "medium",
  "Appliance Fault": "medium",
  "General Maintenance": "low",
  "Cosmetic Repair": "low",
};

export function getIssuePriority(category: IssueCategory): IssuePriority {
  return categoryPriorityMap[category];
}
