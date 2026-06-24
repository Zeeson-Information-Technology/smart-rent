import type { IssuePriority, IssueStatus } from "@/types/database";

export type ConversationParticipant = {
  id: string;
  name: string;
  email: string;
};

export type ConversationRecord = {
  id: string;
  participants: ConversationParticipant[];
  issueId?: string | null;
  tenancyId?: string | null;
  propertyId?: string | null;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MessageRecord = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LinkedIssueSummary = {
  id: string;
  title: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  propertyName: string;
};
