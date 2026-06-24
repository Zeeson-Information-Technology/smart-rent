import { z } from "zod";

import { TENANCY_STATUSES } from "@/constants";

export const tenancySchema = z.object({
  propertyId: z.string().trim().min(1, "Property is required"),
  tenantId: z.string().trim().min(1, "Tenant is required").optional(),
  tenantName: z.string().trim().min(1, "Tenant name is required"),
  tenantEmail: z.string().trim().email("Enter a valid tenant email"),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().optional(),
  rentAmount: z.coerce
    .number({ invalid_type_error: "Rent amount is required" })
    .positive("Rent amount must be greater than 0"),
  status: z.enum(TENANCY_STATUSES, {
    errorMap: () => ({ message: "Select a valid tenancy status" }),
  }),
});

export const updateTenancySchema = tenancySchema.partial({
  propertyId: true,
  tenantId: true,
  tenantName: true,
  tenantEmail: true,
  startDate: true,
  endDate: true,
  rentAmount: true,
  status: true,
});

export type TenancyInput = z.infer<typeof tenancySchema>;
export type UpdateTenancyInput = z.infer<typeof updateTenancySchema>;
