import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

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
    tenantPhone: {
      type: String,
      trim: true,
      default: "",
    },
    additionalTenants: {
      type: [
        new Schema(
          {
            tenantId: { type: String, default: null },
            name: { type: String, required: true, trim: true },
            email: {
              type: String,
              required: true,
              lowercase: true,
              trim: true,
            },
            phone: { type: String, required: true, trim: true },
          },
          { _id: false },
        ),
      ],
      default: [],
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
