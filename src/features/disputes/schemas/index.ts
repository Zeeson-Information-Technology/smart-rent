import { z } from "zod";

import { DISPUTE_STATUSES } from "@/constants";

export const createDisputeSchema = z.object({
  issueId: z.string().trim().min(1, "Issue is required"),
  title: z.string().trim().min(1, "Title is required"),
  reason: z.string().trim().min(1, "Reason is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const updateDisputeSchema = z.object({
  status: z.enum(DISPUTE_STATUSES, {
    errorMap: () => ({ message: "Select a valid dispute status" }),
  }),
  resolutionNotes: z.string().trim().optional(),
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
export type UpdateDisputeInput = z.infer<typeof updateDisputeSchema>;
