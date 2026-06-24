import { Wrench } from "lucide-react";

import type { IssueRecord } from "@/features/issues/types";

import { getIssueStatusLabel } from "./issue-status-badge";

type IssueTimelineProps = {
  issue: IssueRecord;
};

export function IssueTimeline({ issue }: IssueTimelineProps) {
  const items = [
    {
      label: "Issue reported",
      value: formatDateTime(issue.createdAt),
    },
    {
      label: `Smart priority assigned: ${issue.priority}`,
      value: issue.category,
    },
    {
      label: `Current status: ${getIssueStatusLabel(issue.status)}`,
      value: formatDateTime(issue.updatedAt),
    },
  ];

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="flex gap-3" key={item.label}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            {index === 0 ? (
              <Wrench className="h-4 w-4" aria-hidden="true" />
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
            )}
          </span>
          <div className="flex-1 rounded-xl border bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-950">{item.label}</p>
            <p className="mt-1 text-sm text-slate-500">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
