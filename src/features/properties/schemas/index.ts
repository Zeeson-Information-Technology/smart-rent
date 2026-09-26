import { z } from "zod";

import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/constants";

export const propertySchema = z.object({
  landlordId: z.string().trim().min(1, "Landlord is required").optional(),
  propertyName: z.string().trim().min(1, "Property name is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  postcode: z.string().trim().min(1, "Postcode is required"),
  propertyType: z.enum(PROPERTY_TYPES, {
    errorMap: () => ({ message: "Select a valid property type" }),
  }),
  status: z.enum(PROPERTY_STATUSES, {
    errorMap: () => ({ message: "Select a valid property status" }),
  }),
  description: z.string().trim().optional(),
  bedroomCount: z.coerce.number().int().min(0).max(100),
});

export const updatePropertySchema = propertySchema.partial({
  landlordId: true,
  propertyName: true,
  address: true,
  city: true,
  postcode: true,
  propertyType: true,
  status: true,
  description: true,
  bedroomCount: true,
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
