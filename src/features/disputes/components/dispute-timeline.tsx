import type { DisputeRecord } from "@/features/disputes/types";

import { disputeStatusLabels } from "./dispute-status-badge";

export function DisputeTimeline({ dispute }: { dispute: DisputeRecord }) {
  const items = [
    { label: "Issue Created", value: dispute.issueTitle },
    {
      label: "Evidence Uploaded",
      value: "Issue evidence attached where available",
    },
    { label: "Messages Sent", value: "Issue-linked communication available" },
    {
      label: "Dispute Raised",
      value: `${formatDate(dispute.createdAt)} by ${dispute.raisedByName}`,
    },
    { label: "Status Changes", value: disputeStatusLabels[dispute.status] },
    {
      label: "Resolution Notes Added",
      value: dispute.resolutionNotes ? "Yes" : "Pending",
    },
    {
      label: "Dispute Closed",
      value:
        dispute.status === "closed" ? formatDate(dispute.updatedAt) : "Pending",
    },
  ];

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="flex gap-3" key={item.label}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
            {index + 1}
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
