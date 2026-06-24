import type { Metadata } from "next";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { MessageThread } from "@/features/messaging/components";

export const metadata: Metadata = {
  title: "Message Details",
};

type MessageDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MessageDetailsPage({
  params,
}: MessageDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  return (
    <>
      <PageHeader
        description="Conversation thread with linked issue context where available."
        eyebrow="Message details"
        title="Conversation"
      />
      <MessageThread conversationId={id} currentUserId={session?.user?.id ?? ""} />
    </>
  );
}
