import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { RENT_PAYMENT_STATUSES } from "@/constants";
import type { RentPayment } from "@/types/database";

export type RentPaymentDocument = HydratedDocument<Omit<RentPayment, "id">>;

const rentPaymentSchema = new Schema<RentPaymentDocument>(
  {
    tenancyId: { type: String, required: true, index: true },
    landlordId: { type: String, required: true, index: true },
    dueDate: { type: Date, required: true, index: true },
    amountDue: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: RENT_PAYMENT_STATUSES, required: true },
    paidAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

rentPaymentSchema.index({ tenancyId: 1, dueDate: -1 }, { unique: true });

export const RentPaymentModel =
  (models.RentPayment as Model<RentPaymentDocument> | undefined) ??
  model<RentPaymentDocument>("RentPayment", rentPaymentSchema);
