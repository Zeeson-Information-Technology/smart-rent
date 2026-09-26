import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/constants";
import type { Property } from "@/types/database";

export type PropertyDocument = HydratedDocument<Omit<Property, "id">>;

const propertySchema = new Schema<PropertyDocument>(
  {
    landlordId: {
      type: String,
      required: true,
      index: true,
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      required: true,
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
    bedroomCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

export const PropertyModel =
  (models.Property as Model<PropertyDocument> | undefined) ??
  model<PropertyDocument>("Property", propertySchema);
