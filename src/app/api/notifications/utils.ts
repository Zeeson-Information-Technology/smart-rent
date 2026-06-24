import { NextResponse } from "next/server";
import { Types } from "mongoose";

import type { NotificationDocument } from "@/database/models";

export function unauthenticatedResponse() {
  return NextResponse.json({ error: "Authentication required." }, { status: 401 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Notification not found." }, { status: 404 });
}

export function invalidNotificationResponse() {
  return NextResponse.json({ error: "Invalid notification id." }, { status: 400 });
}

export function isValidObjectId(id: string) {
  return Types.ObjectId.isValid(id);
}

export function serializeNotification(notification: NotificationDocument) {
  return {
    id: notification._id.toString(),
    userId: notification.userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    relatedEntityType: notification.relatedEntityType,
    relatedEntityId: notification.relatedEntityId,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt.toISOString(),
  };
}
