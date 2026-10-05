"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { ISSUE_STATUSES } from "@/constants";
import { EvidenceGallery } from "@/features/evidence/components";
import type { IssueRecord } from "@/features/issues/types";
import { IssueConversationPanel } from "@/features/messaging/components";
import type { IssueStatus, UserRole } from "@/types/database";

import { IssuePriorityBadge } from "./issue-priority-badge";
import { IssueStatusBadge, getIssueStatusLabel } from "./issue-status-badge";
import { IssueTimeline } from "./issue-timeline";

type IssueDetailsProps = {
  currentUserId: string;
  id: string;
  role: UserRole;
};

export function IssueDetails({ currentUserId, id, role }: IssueDetailsProps) {
  const [issue, setIssue] = useState<IssueRecord | null>(null);
  const [status, setStatus] = useState<IssueStatus>("open");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const canUpdateStatus = role === "landlord" || role === "admin";

  useEffect(() => {
    let mounted = true;

    async function loadIssue() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/issues/${id}`, { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load issue.");
        setIsLoading(false);
        return;
      }

      setIssue(result.issue);
      setStatus(result.issue.status);
      setIsLoading(false);
    }

    void loadIssue();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function updateStatus() {
    setIsSaving(true);
    setMessage(null);

    const response = await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to update issue status.");
      setIsSaving(false);
      return;
    }

    setIssue(result.issue);
    setStatus(result.issue.status);
    setMessage("Issue status updated.");
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-600">Loading issue...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <EmptyState
        action={
          <Link href="/issues">
            <Button variant="outline">Back to issues</Button>
          </Link>
        }
        description={error ?? "The requested issue could not be found."}
        icon={MessageSquare}
        title="Issue unavailable"
      />
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <Link href={`/disputes/new?issueId=${issue.id}`}>
            <Button variant="outline">Raise Dispute</Button>
          </Link>
        }
        description="Review issue details, smart priority, status, evidence, and communication history."
        eyebrow="Issue details"
        title={issue.title}
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <IssuePriorityBadge priority={issue.priority} />
              <IssueStatusBadge status={issue.status} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              Issue information
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-6 text-slate-600">
            <p>{issue.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Summary
                label="Property"
                value={issue.property?.propertyName ?? "Unavailable"}
              />
              <Summary label="Category" value={issue.category} />
              <Summary label="Reported by" value={issue.reportedByName} />
              <Summary
                label="Reported date"
                value={formatDate(issue.createdAt)}
              />
              <Summary label="Evidence" value={evidenceCount.toString()} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Status tracking
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            {canUpdateStatus ? (
              <>
                <label
                  className="grid gap-2 text-sm font-medium text-slate-700"
                  htmlFor="status"
                >
                  Status
                  <select
                    className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                    id="status"
                    name="status"
                    onChange={(event) =>
                      setStatus(event.target.value as IssueStatus)
                    }
                    value={status}
                  >
                    {ISSUE_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {getIssueStatusLabel(item)}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  disabled={isSaving || status === issue.status}
                  onClick={updateStatus}
                >
                  {isSaving ? "Saving..." : "Update status"}
                </Button>
                {message ? (
                  <p className="text-sm font-medium text-slate-600">
                    {message}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-950">
                  Current status: {getIssueStatusLabel(issue.status)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Your landlord will update the issue status as work progresses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Timeline</h2>
          </CardHeader>
          <CardContent>
            <IssueTimeline issue={issue} />
          </CardContent>
        </Card>
        <Card className="lg:row-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Evidence</h2>
          </CardHeader>
          <CardContent>
            <EvidenceGallery
              issueId={issue.id}
              onEvidenceCountChange={setEvidenceCount}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Communication
            </h2>
          </CardHeader>
          <CardContent>
            <IssueConversationPanel
              currentUserId={currentUserId}
              issue={issue}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-950">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
