import { auth } from "@/auth";
import { MessageModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  findAccessibleConversation,
  getLinkedIssueSummary,
  notFoundResponse,
  serializeConversation,
  serializeMessages,
  unauthenticatedResponse,
} from "../utils";

type MessageThreadContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_request: Request, context: MessageThreadContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { conversationId } = await context.params;
  const conversation = await findAccessibleConversation(conversationId, session.user);

  if (!conversation) {
    return notFoundResponse();
  }

  await connectMongoDB();

  const messages = await MessageModel.find({
    conversationId: conversation._id.toString(),
  }).sort({ createdAt: 1 });

  return Response.json({
    conversation: await serializeConversation(conversation, session.user.id),
    linkedIssue: await getLinkedIssueSummary(conversation.issueId),
    messages: await serializeMessages(messages),
  });
}
