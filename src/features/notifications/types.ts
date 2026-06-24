import type {
  NotificationRelatedEntityType,
  NotificationType,
} from "@/types/database";

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedEntityType?: NotificationRelatedEntityType;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};
