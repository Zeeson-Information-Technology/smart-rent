import { Types } from "mongoose";
import { NextResponse } from "next/server";

import {
  ConversationModel,
  IssueModel,
  MessageModel,
  PropertyModel,
  TenancyModel,
  UserModel,
  type ConversationDocument,
  type MessageDocument,
} from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type { UserRole } from "@/types/database";

export type ApiSessionUser = {
  email: string;
  id: string;
  role: UserRole;
};

export function unauthenticatedResponse() {
  return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
}

export function forbiddenResponse(message = "You are not authorized to access this resource.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFoundResponse(message = "Conversation not found.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function validationErrorResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      error: "Validation failed.",
      fieldErrors,
    },
    { status: 400 },
  );
}

export async function findAccessibleConversation(id: string, user: ApiSessionUser) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectMongoDB();

  const query =
    user.role === "admin"
      ? { _id: id }
      : { _id: id, participants: user.id };

  return ConversationModel.findOne(query);
}

export async function canSendMessage({
  issueId,
  propertyId,
  receiverId,
  sender,
  tenancyId,
}: {
  issueId?: string;
  propertyId?: string;
  receiverId: string;
  sender: ApiSessionUser;
  tenancyId?: string;
}) {
  if (sender.role === "admin") {
    return true;
  }

  if (sender.id === receiverId) {
    return false;
  }

  await connectMongoDB();

  if (issueId) {
    const issue = await IssueModel.findOne({ _id: issueId });

    if (!issue) {
      return false;
    }

    if (sender.role === "tenant") {
      return issue.tenantId === sender.id && issue.landlordId === receiverId;
    }

    return issue.landlordId === sender.id && issue.tenantId === receiverId;
  }

  if (tenancyId) {
    const tenancy = await TenancyModel.findOne({ _id: tenancyId });

    if (!tenancy) {
      return false;
    }

    if (sender.role === "tenant") {
      return (
        (tenancy.tenantId === sender.id || tenancy.tenantEmail === sender.email.toLowerCase()) &&
        tenancy.landlordId === receiverId
      );
    }

    return tenancy.landlordId === sender.id && tenancy.tenantId === receiverId;
  }

  if (propertyId) {
    const tenancy = await TenancyModel.findOne(
      sender.role === "tenant"
        ? {
            propertyId,
            $or: [{ tenantId: sender.id }, { tenantEmail: sender.email.toLowerCase() }],
            landlordId: receiverId,
          }
        : {
            propertyId,
            landlordId: sender.id,
            tenantId: receiverId,
          },
    );

    return Boolean(tenancy);
  }

  const tenancy = await TenancyModel.findOne(
    sender.role === "tenant"
      ? {
          $or: [{ tenantId: sender.id }, { tenantEmail: sender.email.toLowerCase() }],
          landlordId: receiverId,
        }
      : {
          landlordId: sender.id,
          tenantId: receiverId,
        },
  );

  return Boolean(tenancy);
}

export async function getOrCreateConversation({
  issueId,
  message,
  propertyId,
  receiverId,
  senderId,
  subject,
  tenancyId,
}: {
  issueId?: string;
  message: string;
  propertyId?: string;
  receiverId: string;
  senderId: string;
  subject: string;
  tenancyId?: string;
}) {
  const participants = [senderId, receiverId].sort();
  const query = {
    participants: { $all: participants, $size: 2 },
    issueId: issueId ?? { $exists: false },
    tenancyId: tenancyId ?? { $exists: false },
    propertyId: propertyId ?? { $exists: false },
  };

  const existing = await ConversationModel.findOne(query);

  if (existing) {
    return existing;
  }

  return ConversationModel.create({
    participants,
    issueId,
    tenancyId,
    propertyId,
    subject,
    lastMessage: message,
    lastMessageAt: new Date(),
  });
}

export async function serializeConversation(
  conversation: ConversationDocument,
  currentUserId: string,
) {
  const [participants, unreadCount] = await Promise.all([
    UserModel.find({ _id: { $in: conversation.participants } }),
    MessageModel.countDocuments({
      conversationId: conversation._id.toString(),
      receiverId: currentUserId,
      isRead: false,
    }),
  ]);
  const participantsById = new Map(
    participants.map((participant) => [
      participant._id.toString(),
      {
        id: participant._id.toString(),
        name: participant.name,
        email: participant.email,
      },
    ]),
  );

  return {
    id: conversation._id.toString(),
    participants: conversation.participants.map(
      (participantId) =>
        participantsById.get(participantId) ?? {
          id: participantId,
          name: "SmartRent user",
          email: "",
        },
    ),
    issueId: conversation.issueId ?? null,
    tenancyId: conversation.tenancyId ?? null,
    propertyId: conversation.propertyId ?? null,
    subject: conversation.subject,
    lastMessage: conversation.lastMessage,
    lastMessageAt: conversation.lastMessageAt.toISOString(),
    unreadCount,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

export async function serializeMessage(message: MessageDocument) {
  const users = await UserModel.find({
    _id: { $in: [message.senderId, message.receiverId] },
  });
  const usersById = new Map(
    users.map((user) => [user._id.toString(), user.name]),
  );

  return {
    id: message._id.toString(),
    conversationId: message.conversationId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    senderName: usersById.get(message.senderId) ?? "SmartRent user",
    receiverName: usersById.get(message.receiverId) ?? "SmartRent user",
    subject: message.subject,
    message: message.message,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

export async function serializeMessages(messages: MessageDocument[]) {
  const userIds = [
    ...new Set(messages.flatMap((message) => [message.senderId, message.receiverId])),
  ];
  const users = await UserModel.find({ _id: { $in: userIds } });
  const usersById = new Map(
    users.map((user) => [user._id.toString(), user.name]),
  );

  return messages.map((message) => ({
    id: message._id.toString(),
    conversationId: message.conversationId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    senderName: usersById.get(message.senderId) ?? "SmartRent user",
    receiverName: usersById.get(message.receiverId) ?? "SmartRent user",
    subject: message.subject,
    message: message.message,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  }));
}

export async function getLinkedIssueSummary(issueId?: string) {
  if (!issueId) {
    return null;
  }

  const issue = await IssueModel.findOne({ _id: issueId });

  if (!issue) {
    return null;
  }

  const property = await PropertyModel.findOne({ _id: issue.propertyId });

  return {
    id: issue._id.toString(),
    title: issue.title,
    category: issue.category,
    priority: issue.priority,
    status: issue.status,
    propertyName: property?.propertyName ?? "Property unavailable",
  };
}
