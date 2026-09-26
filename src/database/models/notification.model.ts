import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import {
  NOTIFICATION_RELATED_ENTITY_TYPES,
  NOTIFICATION_TYPES,
} from "@/constants";
import type { Notification } from "@/types/database";

export type NotificationDocument = HydratedDocument<Omit<Notification, "id">>;

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    relatedEntityType: {
      type: String,
      enum: NOTIFICATION_RELATED_ENTITY_TYPES,
    },
    relatedEntityId: {
      type: String,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const NotificationModel =
  (models.Notification as Model<NotificationDocument> | undefined) ??
  model<NotificationDocument>("Notification", notificationSchema);
