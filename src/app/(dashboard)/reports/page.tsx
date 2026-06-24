import type { Metadata } from "next";
import { Download, FileText, Plus } from "lucide-react";

import { DataTable, EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Reports",
};

const reports = [
  { name: "Move-in condition report", property: "Flat 8B, Canary Wharf", owner: "Alex Morgan", status: "Draft" as const },
  { name: "Maintenance response summary", property: "Dockside House", owner: "Nadia Patel", status: "Pending" as const },
  { name: "Dispute evidence bundle", property: "Meridian Court", owner: "Owen Brooks", status: "Active" as const },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        actions={
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New report
          </Button>
        }
        description="Static report workspace for future export and documentation flows."
        eyebrow="Reporting"
        title="Reports"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Report drafts" value="9" />
        <StatCard icon={FileText} label="Ready for review" value="4" />
        <StatCard icon={Download} label="Exports this month" value="16" />
      </div>
      <DataTable
        columns={[
          { header: "Report", render: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
          { header: "Property", render: (row) => row.property },
          { header: "Owner", render: (row) => row.owner },
          { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        rows={reports}
      />
      <div className="mt-6">
        <EmptyState
          action={
            <Button type="button">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New report
            </Button>
          }
          description="Generated report previews, export history, and scheduled reports will appear here later."
          icon={FileText}
          title="Report automation is not connected yet"
        />
      </div>
    </>
  );
}
