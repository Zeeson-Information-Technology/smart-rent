import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { EVIDENCE_TYPES } from "@/constants";
import type { Evidence } from "@/types/database";

export type EvidenceDocument = HydratedDocument<Omit<Evidence, "id">>;

const evidenceSchema = new Schema<EvidenceDocument>(
  {
    uploadedBy: {
      type: String,
      required: true,
      index: true,
    },
    issueId: {
      type: String,
      index: true,
    },
    disputeId: {
      type: String,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: EVIDENCE_TYPES,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const EvidenceModel =
  (models.Evidence as Model<EvidenceDocument> | undefined) ??
  model<EvidenceDocument>("Evidence", evidenceSchema);
