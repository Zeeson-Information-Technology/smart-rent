import { z } from "zod";

import { TENANCY_STATUSES } from "@/constants";

const tenantContactSchema = z.object({
  name: z.string().trim().min(1, "Tenant name is required"),
  email: z.string().trim().email("Enter a valid tenant email"),
  phone: z.string().trim().min(7, "Enter a valid contact number").max(30),
});

export const tenancySchema = z.object({
  propertyId: z.string().trim().min(1, "Property is required"),
  tenantId: z.string().trim().min(1, "Tenant is required").optional(),
  tenantName: z.string().trim().min(1, "Tenant name is required"),
  tenantEmail: z.string().trim().email("Enter a valid tenant email"),
  tenantPhone: z.string().trim().min(7, "Enter a valid contact number").max(30),
  additionalTenants: z.array(tenantContactSchema).max(10).default([]),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().optional(),
  rentAmount: z.coerce
    .number({ invalid_type_error: "Rent amount is required" })
    .positive("Rent amount must be greater than 0"),
  depositAmount: z.coerce
    .number({ invalid_type_error: "Deposit amount is required" })
    .min(0, "Deposit amount cannot be negative"),
  status: z.enum(TENANCY_STATUSES, {
    errorMap: () => ({ message: "Select a valid tenancy status" }),
  }),
});

export const updateTenancySchema = tenancySchema.partial({
  propertyId: true,
  tenantId: true,
  tenantName: true,
  tenantEmail: true,
  tenantPhone: true,
  additionalTenants: true,
  startDate: true,
  endDate: true,
  rentAmount: true,
  depositAmount: true,
  status: true,
});

export type TenancyInput = z.infer<typeof tenancySchema>;
export type UpdateTenancyInput = z.infer<typeof updateTenancySchema>;
