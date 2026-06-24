import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import { IssuePriorityBadge, IssueStatusBadge } from "@/features/issues/components";
import type { LinkedIssueSummary } from "@/features/messaging/types";

type LinkedIssuePanelProps = {
  issue: LinkedIssueSummary | null;
};

export function LinkedIssuePanel({ issue }: LinkedIssuePanelProps) {
  if (!issue) {
    return (
      <div className="rounded-xl border bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-950">No linked issue</p>
        <p className="mt-1 text-sm text-slate-500">
          This conversation is not linked to an issue record.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-950">Linked issue</h2>
      </div>
      <div>
        <p className="font-semibold text-slate-950">{issue.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {issue.category} at {issue.propertyName}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <IssuePriorityBadge priority={issue.priority} />
        <IssueStatusBadge status={issue.status} />
      </div>
      <Link href={`/issues/${issue.id}`}>
        <Button variant="outline">View issue</Button>
      </Link>
    </div>
  );
}
