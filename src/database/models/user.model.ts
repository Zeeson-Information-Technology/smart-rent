import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { USER_ROLES } from "@/constants";
import type { User } from "@/types/database";

export type UserDocument = HydratedDocument<Omit<User, "id">>;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: "tenant",
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel =
  (models.User as Model<UserDocument> | undefined) ??
  model<UserDocument>("User", userSchema);
