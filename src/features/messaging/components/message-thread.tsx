"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import type {
  ConversationRecord,
  LinkedIssueSummary,
  MessageRecord,
} from "@/features/messaging/types";

import { LinkedIssuePanel } from "./linked-issue-panel";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";

type MessageThreadProps = {
  conversationId: string;
  currentUserId: string;
};

export function MessageThread({
  conversationId,
  currentUserId,
}: MessageThreadProps) {
  const [conversation, setConversation] = useState<ConversationRecord | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [linkedIssue, setLinkedIssue] = useState<LinkedIssueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadThread() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/messages/${conversationId}`, {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load conversation.");
        setIsLoading(false);
        return;
      }

      setConversation(result.conversation);
      setMessages(result.messages ?? []);
      setLinkedIssue(result.linkedIssue ?? null);
      setIsLoading(false);

      void fetch(`/api/messages/${conversationId}/read`, {
        method: "PUT",
      });
    }

    void loadThread();

    return () => {
      mounted = false;
    };
  }, [conversationId]);

  const receiverId = useMemo(() => {
    return conversation?.participants.find((participant) => participant.id !== currentUserId)?.id;
  }, [conversation, currentUserId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-600">Loading conversation...</p>
      </div>
    );
  }

  if (error || !conversation || !receiverId) {
    return (
      <EmptyState
        action={
          <Link href="/messages">
            <Button variant="outline">Back to messages</Button>
          </Link>
        }
        description={error ?? "The requested conversation could not be found."}
        icon={MessageSquare}
        title="Conversation unavailable"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-blue-700">Conversation</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            {conversation.subject}
          </h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid max-h-[520px] gap-3 overflow-y-auto rounded-xl bg-slate-50 p-4">
            {messages.map((message) => (
              <MessageBubble
                currentUserId={currentUserId}
                key={message.id}
                message={message}
              />
            ))}
          </div>
          <MessageInput
            conversationId={conversation.id}
            onSent={(message) => setMessages((current) => [...current, message])}
            receiverId={receiverId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <LinkedIssuePanel issue={linkedIssue} />
        </CardContent>
      </Card>
    </div>
  );
}
