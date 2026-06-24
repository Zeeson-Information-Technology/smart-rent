"use client";

import { useState } from "react";

import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { DISPUTE_STATUSES } from "@/constants";
import type { DisputeRecord } from "@/features/disputes/types";
import type { DisputeStatus, UserRole } from "@/types/database";

import { disputeStatusLabels } from "./dispute-status-badge";

export function ResolutionNotesCard({
  dispute,
  onUpdated,
  role,
}: {
  dispute: DisputeRecord;
  onUpdated: (dispute: DisputeRecord) => void;
  role: UserRole;
}) {
  const [status, setStatus] = useState<DisputeStatus>(dispute.status);
  const [resolutionNotes, setResolutionNotes] = useState(dispute.resolutionNotes);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const canManage = role === "landlord" || role === "admin";

  async function updateDispute() {
    setIsSaving(true);
    setMessage(null);
    const response = await fetch(`/api/disputes/${dispute.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolutionNotes }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(result?.error ?? "Unable to update dispute.");
    } else {
      onUpdated(result.dispute);
      setMessage("Dispute updated.");
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">Resolution Notes</h2>
      </CardHeader>
      <CardContent className="grid gap-4">
        {canManage ? (
          <>
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="status">
              Status
              <select className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100" id="status" onChange={(event) => setStatus(event.target.value as DisputeStatus)} value={status}>
                {DISPUTE_STATUSES.map((item) => (
                  <option key={item} value={item}>{disputeStatusLabels[item]}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="resolutionNotes">
              Notes
              <textarea className="min-h-28 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100" id="resolutionNotes" onChange={(event) => setResolutionNotes(event.target.value)} value={resolutionNotes} />
            </label>
            <Button disabled={isSaving} onClick={updateDispute}>{isSaving ? "Saving..." : "Save resolution notes"}</Button>
          </>
        ) : (
          <div className="rounded-xl border bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {dispute.resolutionNotes || "No resolution notes have been added yet."}
          </div>
        )}
        {message ? <p className="text-sm font-medium text-slate-600">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
