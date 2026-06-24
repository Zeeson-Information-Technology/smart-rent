import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES } from "@/constants";
import type { Issue } from "@/types/database";

export type IssueDocument = HydratedDocument<Omit<Issue, "id">>;

const issueSchema = new Schema<IssueDocument>(
  {
    propertyId: {
      type: String,
      required: true,
      index: true,
    },
    tenancyId: {
      type: String,
      index: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    landlordId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ISSUE_CATEGORIES,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ISSUE_STATUSES,
      required: true,
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ISSUE_PRIORITIES,
      required: true,
      default: "medium",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const IssueModel =
  (models.Issue as Model<IssueDocument> | undefined) ??
  model<IssueDocument>("Issue", issueSchema);
