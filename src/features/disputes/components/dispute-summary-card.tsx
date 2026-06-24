import { Card, CardContent, CardHeader } from "@/components/ui";
import type { DisputeRecord } from "@/features/disputes/types";

import { DisputePriorityBadge } from "./dispute-priority-badge";
import { DisputeStatusBadge } from "./dispute-status-badge";

export function DisputeSummaryCard({ dispute }: { dispute: DisputeRecord }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <DisputeStatusBadge status={dispute.status} />
          <DisputePriorityBadge priority={dispute.priority} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Dispute Summary</h2>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <Info label="Reference" value={dispute.disputeReference} />
        <Info label="Title" value={dispute.title} />
        <Info label="Reason" value={dispute.reason} />
        <Info label="Property" value={dispute.propertyName} />
        <Info label="Tenant" value={dispute.tenantName} />
        <div className="rounded-xl border bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {dispute.description}
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border bg-white p-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}
