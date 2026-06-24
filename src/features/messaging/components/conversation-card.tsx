import Link from "next/link";

import type { ConversationRecord } from "@/features/messaging/types";

import { UnreadBadge } from "./unread-badge";

type ConversationCardProps = {
  conversation: ConversationRecord;
  currentUserId: string;
};

export function ConversationCard({
  conversation,
  currentUserId,
}: ConversationCardProps) {
  const otherParticipant =
    conversation.participants.find((participant) => participant.id !== currentUserId) ??
    conversation.participants[0];

  return (
    <Link
      className="block rounded-xl border bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
      href={`/messages/${conversation.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-950">
            {otherParticipant?.name ?? "SmartRent user"}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {conversation.subject}
          </p>
        </div>
        <div className="grid justify-items-end gap-2">
          <p className="whitespace-nowrap text-xs text-slate-500">
            {formatDate(conversation.lastMessageAt)}
          </p>
          <UnreadBadge count={conversation.unreadCount} />
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
        {conversation.lastMessage}
      </p>
    </Link>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}
