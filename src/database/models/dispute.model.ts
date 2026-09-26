import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { DISPUTE_STATUSES, ISSUE_PRIORITIES } from "@/constants";
import type { Dispute } from "@/types/database";

export type DisputeDocument = HydratedDocument<Omit<Dispute, "id">>;

const disputeSchema = new Schema<DisputeDocument>(
  {
    disputeReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    issueId: {
      type: String,
      required: true,
      index: true,
    },
    propertyId: {
      type: String,
      required: true,
      index: true,
    },
    tenancyId: {
      type: String,
      index: true,
    },
    landlordId: {
      type: String,
      required: true,
      index: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    raisedBy: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: DISPUTE_STATUSES,
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
    resolutionNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const DisputeModel =
  (models.Dispute as Model<DisputeDocument> | undefined) ??
  model<DisputeDocument>("Dispute", disputeSchema);
