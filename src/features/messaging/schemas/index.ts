import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation is required").optional(),
  receiverId: z.string().trim().min(1, "Receiver is required"),
  subject: z.string().trim().min(1, "Subject is required").optional(),
  message: z.string().trim().min(1, "Message is required"),
  issueId: z.string().trim().min(1, "Issue is required").optional(),
  tenancyId: z.string().trim().min(1, "Tenancy is required").optional(),
  propertyId: z.string().trim().min(1, "Property is required").optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
