import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import type { Message } from "@/types/database";

export type MessageDocument = HydratedDocument<Omit<Message, "id">>;

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    propertyId: {
      type: String,
      index: true,
    },
    tenancyId: {
      type: String,
      index: true,
    },
    issueId: {
      type: String,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
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

export const MessageModel =
  (models.Message as Model<MessageDocument> | undefined) ??
  model<MessageDocument>("Message", messageSchema);
