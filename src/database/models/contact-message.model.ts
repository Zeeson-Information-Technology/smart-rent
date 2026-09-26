import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import type { ContactMessage } from "@/types/database";

export type ContactMessageDocument = HydratedDocument<
  Omit<ContactMessage, "id">
>;

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "reviewed"],
      required: true,
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ContactMessageModel =
  (models.ContactMessage as Model<ContactMessageDocument> | undefined) ??
  model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
