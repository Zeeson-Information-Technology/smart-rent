import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { ConversationModel, MessageModel } from "@/database/models";
import { createMessageSchema } from "@/features/messaging/schemas";
import { connectMongoDB } from "@/lib/mongodb";
import { createMessageNotification } from "@/lib/notifications";

import {
  canSendMessage,
  findAccessibleConversation,
  forbiddenResponse,
  getOrCreateConversation,
  serializeConversation,
  serializeMessage,
  unauthenticatedResponse,
  validationErrorResponse,
} from "./utils";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const user = session.user;

  await connectMongoDB();

  const query = user.role === "admin" ? {} : { participants: user.id };
  const conversations = await ConversationModel.find(query).sort({
    lastMessageAt: -1,
  });

  return NextResponse.json({
    conversations: await Promise.all(
      conversations.map((conversation) =>
        serializeConversation(conversation, user.id),
      ),
    ),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const user = session.user;

  const body = await request.json().catch(() => null);
  const parsedBody = createMessageSchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  await connectMongoDB();

  let conversation = parsedBody.data.conversationId
    ? await findAccessibleConversation(parsedBody.data.conversationId, user)
    : null;

  if (parsedBody.data.conversationId && !conversation) {
    return forbiddenResponse("You cannot send messages to this conversation.");
  }

  const receiverId = parsedBody.data.receiverId;
  const allowed = await canSendMessage({
    issueId: parsedBody.data.issueId ?? conversation?.issueId,
    propertyId: parsedBody.data.propertyId ?? conversation?.propertyId,
    receiverId,
    sender: user,
    tenancyId: parsedBody.data.tenancyId ?? conversation?.tenancyId,
  });

  if (!allowed) {
    return forbiddenResponse("You cannot message this user.");
  }

  const subject = parsedBody.data.subject ?? conversation?.subject;

  if (!subject) {
    return validationErrorResponse({
      subject: ["Subject is required"],
    });
  }

  if (!conversation) {
    conversation = await getOrCreateConversation({
      issueId: parsedBody.data.issueId,
      message: parsedBody.data.message,
      propertyId: parsedBody.data.propertyId,
      receiverId,
      senderId: user.id,
      subject,
      tenancyId: parsedBody.data.tenancyId,
    });
  }

  const message = await MessageModel.create({
    conversationId: conversation._id.toString(),
    senderId: user.id,
    receiverId,
    issueId: conversation.issueId,
    tenancyId: conversation.tenancyId,
    propertyId: conversation.propertyId,
    subject,
    message: parsedBody.data.message,
    isRead: false,
  });

  conversation.lastMessage = parsedBody.data.message;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  await createMessageNotification({
    userId: receiverId,
    conversationId: conversation._id.toString(),
    title: `New message from ${user.name}`,
    message: subject,
  });

  return NextResponse.json(
    {
      conversation: await serializeConversation(conversation, user.id),
      message: await serializeMessage(message),
    },
    { status: 201 },
  );
}
