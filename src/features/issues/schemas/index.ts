import { z } from "zod";

import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/constants";

export const issueCreateSchema = z.object({
  propertyId: z.string().trim().min(1, "Property is required"),
  tenancyId: z.string().trim().min(1, "Tenancy is required").optional(),
  title: z.string().trim().min(1, "Issue title is required"),
  category: z.enum(ISSUE_CATEGORIES, {
    errorMap: () => ({ message: "Select a valid issue category" }),
  }),
  description: z.string().trim().min(1, "Description is required"),
});

export const issueStatusUpdateSchema = z.object({
  status: z.enum(ISSUE_STATUSES, {
    errorMap: () => ({ message: "Select a valid issue status" }),
  }),
});

export type IssueCreateInput = z.infer<typeof issueCreateSchema>;
export type IssueStatusUpdateInput = z.infer<typeof issueStatusUpdateSchema>;
