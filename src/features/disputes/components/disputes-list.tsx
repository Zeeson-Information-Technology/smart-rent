"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import Link from "next/link";

import { DataTable, EmptyState, LoadingState, StatCard } from "@/components/dashboard";
import type { DisputeRecord } from "@/features/disputes/types";

import { DisputePriorityBadge } from "./dispute-priority-badge";
import { DisputeStatusBadge } from "./dispute-status-badge";

export function DisputesList() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDisputes() {
      const response = await fetch("/api/disputes", { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? "Unable to load disputes.");
      } else {
        setDisputes(result?.disputes ?? []);
      }
      setIsLoading(false);
    }
    void loadDisputes();
  }, []);

  if (isLoading) return <LoadingState title="Loading disputes" />;
  if (error) return <EmptyState description={error} icon={Scale} title="Unable to load disputes" />;
  if (disputes.length === 0) return <EmptyState description="No dispute records are currently linked to this account." icon={Scale} title="No disputes yet" />;

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Scale} label="Active disputes" value={disputes.filter((dispute) => !["resolved", "closed"].includes(dispute.status)).length.toString()} />
        <StatCard icon={Scale} label="Resolved" value={disputes.filter((dispute) => dispute.status === "resolved").length.toString()} />
        <StatCard icon={Scale} label="Closed cases" value={disputes.filter((dispute) => dispute.status === "closed").length.toString()} />
      </div>
      <DataTable
        columns={[
          { header: "Reference", render: (row) => <Link className="font-medium text-blue-700 hover:text-blue-800" href={`/disputes/${row.id}`}>{row.disputeReference}</Link> },
          { header: "Case", render: (row) => row.title },
          { header: "Property", render: (row) => row.propertyName },
          { header: "Priority", render: (row) => <DisputePriorityBadge priority={row.priority} /> },
          { header: "Status", render: (row) => <DisputeStatusBadge status={row.status} /> },
        ]}
        rows={disputes}
      />
    </>
  );
}
