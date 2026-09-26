import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import type { Conversation } from "@/types/database";

export type ConversationDocument = HydratedDocument<Omit<Conversation, "id">>;

const conversationSchema = new Schema<ConversationDocument>(
  {
    participants: {
      type: [String],
      required: true,
      index: true,
    },
    issueId: {
      type: String,
      index: true,
    },
    tenancyId: {
      type: String,
      index: true,
    },
    propertyId: {
      type: String,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    lastMessage: {
      type: String,
      required: true,
      trim: true,
    },
    lastMessageAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ConversationModel =
  (models.Conversation as Model<ConversationDocument> | undefined) ??
  model<ConversationDocument>("Conversation", conversationSchema);
