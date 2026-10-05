"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import type { IssueRecord } from "@/features/issues/types";

type IssueConversationPanelProps = {
  currentUserId: string;
  issue: IssueRecord;
};

export function IssueConversationPanel({
  currentUserId,
  issue,
}: IssueConversationPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  async function openConversation() {
    setIsOpening(true);
    setMessage(null);

    const receiverId =
      currentUserId === issue.tenantId ? issue.landlordId : issue.tenantId;

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId,
        subject: `Issue: ${issue.title}`,
        message: `Opening a documented conversation about "${issue.title}".`,
        issueId: issue.id,
        tenancyId: issue.tenancyId ?? undefined,
        propertyId: issue.propertyId,
      }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to open conversation.");
      setIsOpening(false);
      return;
    }

    router.push(`/messages/${result.conversation.id}`);
  }

  return (
    <div className="grid gap-4 rounded-xl border bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Related conversation
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Keep issue communication documented for reporting and dispute
            review.
          </p>
        </div>
      </div>
      <Button disabled={isOpening} onClick={openConversation} type="button">
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        {isOpening ? "Opening..." : "Message about this issue"}
      </Button>
      {message ? (
        <p className="text-sm font-medium text-red-600">{message}</p>
      ) : null}
    </div>
  );
}
