"use client";

import { useEffect, useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { EvidenceGallery } from "@/features/evidence/components";
import type { DisputeRecord } from "@/features/disputes/types";
import type { UserRole } from "@/types/database";

import { DisputeSummaryCard } from "./dispute-summary-card";
import { DisputeTimeline } from "./dispute-timeline";
import { ResolutionNotesCard } from "./resolution-notes-card";

export function DisputeDetails({ id, role }: { id: string; role: UserRole }) {
  const [dispute, setDispute] = useState<DisputeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDispute() {
      const response = await fetch(`/api/disputes/${id}`, { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (!response.ok) setError(result?.error ?? "Unable to load dispute.");
      else setDispute(result.dispute);
      setIsLoading(false);
    }
    void loadDispute();
  }, [id]);

  if (isLoading) return <p className="rounded-2xl border bg-white p-6 text-sm font-medium text-slate-600">Loading dispute...</p>;
  if (error || !dispute) return <EmptyState description={error ?? "The requested dispute could not be found."} icon={FileText} title="Dispute unavailable" />;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <DisputeSummaryCard dispute={dispute} />
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Issue Information</h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="font-semibold text-slate-950">{dispute.issueTitle}</p>
            <p className="text-sm text-slate-600">Property: {dispute.propertyName}</p>
            <Link href={`/issues/${dispute.issueId}`}>
              <Button variant="outline">View linked issue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Evidence Section</h2>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-950">Issue evidence</h3>
              <EvidenceGallery issueId={dispute.issueId} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-950">Dispute evidence</h3>
              <EvidenceGallery disputeId={dispute.id} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-950">Communication History</h2>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
              Issue-linked conversation is available from the linked issue record.
            </p>
            <Link href={`/issues/${dispute.issueId}`}>
              <Button variant="outline">Open issue communication</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ResolutionNotesCard dispute={dispute} onUpdated={setDispute} role={role} />
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Activity Timeline</h2>
          </CardHeader>
          <CardContent>
            <DisputeTimeline dispute={dispute} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
