"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";

import { EmptyState } from "@/components/dashboard";
import type { ConversationRecord } from "@/features/messaging/types";

import { ConversationCard } from "./conversation-card";

type ConversationListProps = {
  currentUserId: string;
  onLoaded?: (conversations: ConversationRecord[]) => void;
};

export function ConversationList({
  currentUserId,
  onLoaded,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadConversations() {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/messages", { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load conversations.");
        setIsLoading(false);
        return;
      }

      const nextConversations = result?.conversations ?? [];
      setConversations(nextConversations);
      onLoaded?.(nextConversations);
      setIsLoading(false);
    }

    void loadConversations();

    return () => {
      mounted = false;
    };
  }, [onLoaded]);

  if (isLoading) {
    return <p className="p-5 text-sm font-medium text-slate-600">Loading conversations...</p>;
  }

  if (error) {
    return <p className="p-5 text-sm font-medium text-red-600">{error}</p>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          description="Issue-linked conversation history will appear here."
          icon={Inbox}
          title="No conversations yet"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 p-5">
      {conversations.map((conversation) => (
        <ConversationCard
          conversation={conversation}
          currentUserId={currentUserId}
          key={conversation.id}
        />
      ))}
    </div>
  );
}
