import { auth } from "@/auth";
import { MessageModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  findAccessibleConversation,
  notFoundResponse,
  unauthenticatedResponse,
} from "../../utils";

type MarkReadContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function PUT(_request: Request, context: MarkReadContext) {
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

  await MessageModel.updateMany(
    {
      conversationId: conversation._id.toString(),
      receiverId: session.user.id,
      isRead: false,
    },
    { $set: { isRead: true } },
  );

  return Response.json({ success: true });
}
