import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type {
  NotificationRelatedEntityType,
  NotificationType,
} from "@/types/database";

type CreateNotificationInput = {
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: NotificationRelatedEntityType;
  title: string;
  type: NotificationType;
  userId?: string | null;
};

export async function createNotification({
  message,
  relatedEntityId,
  relatedEntityType,
  title,
  type,
  userId,
}: CreateNotificationInput) {
  if (!userId) {
    return null;
  }

  await connectMongoDB();

  return NotificationModel.create({
    userId,
    title,
    message,
    type,
    relatedEntityType,
    relatedEntityId,
    isRead: false,
  });
}

type IssueNotificationInput = {
  issueId: string;
  message: string;
  title: string;
  type: Extract<NotificationType, "issue_created" | "issue_status_updated">;
  userId?: string | null;
};

export function createIssueNotification({
  issueId,
  message,
  title,
  type,
  userId,
}: IssueNotificationInput) {
  return createNotification({
    userId,
    title,
    message,
    type,
    relatedEntityType: "issue",
    relatedEntityId: issueId,
  });
}

type MessageNotificationInput = {
  conversationId: string;
  message: string;
  title?: string;
  userId?: string | null;
};

export function createMessageNotification({
  conversationId,
  message,
  title = "New message received",
  userId,
}: MessageNotificationInput) {
  return createNotification({
    userId,
    title,
    message,
    type: "message_received",
    relatedEntityType: "message",
    relatedEntityId: conversationId,
  });
}

type DisputeNotificationInput = {
  disputeId: string;
  message: string;
  title: string;
  type: Extract<
    NotificationType,
    "dispute_created" | "dispute_status_updated"
  >;
  userId?: string | null;
};

export function createDisputeNotification({
  disputeId,
  message,
  title,
  type,
  userId,
}: DisputeNotificationInput) {
  return createNotification({
    userId,
    title,
    message,
    type,
    relatedEntityType: "dispute",
    relatedEntityId: disputeId,
  });
}

type EvidenceNotificationInput = {
  evidenceId: string;
  message: string;
  title?: string;
  userId?: string | null;
};

export function createEvidenceNotification({
  evidenceId,
  message,
  title = "New evidence uploaded",
  userId,
}: EvidenceNotificationInput) {
  return createNotification({
    userId,
    title,
    message,
    type: "evidence_uploaded",
    relatedEntityType: "evidence",
    relatedEntityId: evidenceId,
  });
}
