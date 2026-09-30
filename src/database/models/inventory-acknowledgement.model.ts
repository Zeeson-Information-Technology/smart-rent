import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import type { InventoryAcknowledgement } from "@/types/database";

export type InventoryAcknowledgementDocument = HydratedDocument<
  Omit<InventoryAcknowledgement, "id">
>;

const inventoryAcknowledgementSchema =
  new Schema<InventoryAcknowledgementDocument>(
    {
      inventoryItemId: { type: String, required: true, index: true },
      tenancyId: { type: String, required: true, index: true },
      propertyId: { type: String, required: true, index: true },
      tenantId: { type: String, required: true, index: true },
      status: { type: String, enum: ["confirmed", "disputed"], required: true },
      note: { type: String, trim: true, maxlength: 1000 },
      confirmedAt: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true },
  );

inventoryAcknowledgementSchema.index(
  { inventoryItemId: 1, tenancyId: 1, tenantId: 1 },
  { unique: true },
);

export const InventoryAcknowledgementModel =
  (models.InventoryAcknowledgement as
    | Model<InventoryAcknowledgementDocument>
    | undefined) ??
  model<InventoryAcknowledgementDocument>(
    "InventoryAcknowledgement",
    inventoryAcknowledgementSchema,
  );
