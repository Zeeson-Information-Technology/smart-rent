import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { INVENTORY_CONDITIONS } from "@/constants";
import type { InventoryItem } from "@/types/database";

export type InventoryItemDocument = HydratedDocument<Omit<InventoryItem, "id">>;

const inventoryItemSchema = new Schema<InventoryItemDocument>(
  {
    propertyId: { type: String, required: true, index: true },
    landlordId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    condition: { type: String, enum: INVENTORY_CONDITIONS, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    notes: { type: String, trim: true },
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String },
  },
  { timestamps: true },
);

export const InventoryItemModel =
  (models.InventoryItem as Model<InventoryItemDocument> | undefined) ??
  model<InventoryItemDocument>("InventoryItem", inventoryItemSchema);
