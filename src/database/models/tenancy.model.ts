import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

import { TENANCY_STATUSES } from "@/constants";
import type { Tenancy } from "@/types/database";

export type TenancyDocument = HydratedDocument<Omit<Tenancy, "id">>;

const tenancySchema = new Schema<TenancyDocument>(
  {
    propertyId: {
      type: String,
      required: true,
      index: true,
    },
    landlordId: {
      type: String,
      required: true,
      index: true,
    },
    tenantId: {
      type: String,
      index: true,
    },
    tenantName: {
      type: String,
      required: true,
      trim: true,
    },
    tenantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: TENANCY_STATUSES,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const TenancyModel =
  (models.Tenancy as Model<TenancyDocument> | undefined) ??
  model<TenancyDocument>("Tenancy", tenancySchema);
