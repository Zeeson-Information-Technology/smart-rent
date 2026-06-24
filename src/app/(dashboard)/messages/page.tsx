import type { Metadata } from "next";
import { Inbox, MessageSquare } from "lucide-react";

import { auth } from "@/auth";
import { EmptyState, PageHeader, StatCard } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui";
import { ConversationList } from "@/features/messaging/components";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return (
    <>
      <PageHeader
        description="Documented communication for tenancy and issue workflows."
        eyebrow="Communication"
        title="Messages"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={MessageSquare} label="Inbox" value="Live" />
        <StatCard icon={MessageSquare} label="Issue-linked" value="Ready" />
        <StatCard icon={MessageSquare} label="Dispute-ready" value="History" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardContent className="p-0">
            <ConversationList currentUserId={userId} />
          </CardContent>
        </Card>
        <EmptyState
          description="Select a conversation to view messages."
          icon={Inbox}
          title="No conversation selected"
        />
      </div>
    </>
  );
}
