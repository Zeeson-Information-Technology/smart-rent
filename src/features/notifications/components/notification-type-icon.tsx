import {
  Bell,
  Building2,
  FileUp,
  Home,
  MessageSquare,
  Scale,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { AppNotification } from "../types";

const iconByType: Record<AppNotification["type"], LucideIcon> = {
  dispute_created: Scale,
  dispute_status_updated: Scale,
  evidence_uploaded: FileUp,
  issue_created: Wrench,
  issue_status_updated: Wrench,
  message_received: MessageSquare,
  property_created: Home,
  tenancy_created: Building2,
};

export function NotificationTypeIcon({
  notification,
}: {
  notification: AppNotification;
}) {
  const Icon = iconByType[notification.type] ?? Bell;

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}
