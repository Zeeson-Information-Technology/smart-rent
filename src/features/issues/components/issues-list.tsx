"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Eye, Plus } from "lucide-react";
import Link from "next/link";

import { DataTable, EmptyState, LoadingState, StatCard } from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { UserRole } from "@/types/database";
import type { IssueRecord } from "@/features/issues/types";

import { IssuePriorityBadge } from "./issue-priority-badge";
import { IssueStatusBadge } from "./issue-status-badge";

type IssuesListProps = {
  role: UserRole;
};

export function IssuesList({ role }: IssuesListProps) {
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canCreate = role === "tenant";

  useEffect(() => {
    let mounted = true;

    async function loadIssues() {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/issues", { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load issues.");
        setIsLoading(false);
        return;
      }

      setIssues(result?.issues ?? []);
      setIsLoading(false);
    }

    void loadIssues();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState title="Loading issues" />;
  }

  if (error) {
    return (
      <EmptyState
        description={error}
        icon={AlertCircle}
        title="Unable to load issues"
      />
    );
  }

  if (issues.length === 0) {
    return (
      <EmptyState
        action={
          canCreate ? (
            <Link href="/issues/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Report Issue
              </Button>
            </Link>
          ) : null
        }
        description="No issue records are currently linked to this account."
        icon={AlertCircle}
        title="No issues yet"
      />
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={AlertCircle}
          label="Open issues"
          value={issues.filter((issue) => issue.status === "open").length.toString()}
        />
        <StatCard
          icon={AlertCircle}
          label="High priority"
          value={issues.filter((issue) => issue.priority === "high").length.toString()}
        />
        <StatCard
          icon={AlertCircle}
          label="Resolved"
          value={issues.filter((issue) => issue.status === "resolved").length.toString()}
        />
      </div>
      <DataTable
        columns={[
          {
            header: "Issue",
            render: (row) => (
              <Link
                className="font-medium text-blue-700 hover:text-blue-800"
                href={`/issues/${row.id}`}
              >
                {row.title}
              </Link>
            ),
          },
          { header: "Property", render: (row) => row.property?.propertyName ?? "Unavailable" },
          { header: "Category", render: (row) => row.category },
          { header: "Priority", render: (row) => <IssuePriorityBadge priority={row.priority} /> },
          { header: "Status", render: (row) => <IssueStatusBadge status={row.status} /> },
          { header: "Date Reported", render: (row) => formatDate(row.createdAt) },
          {
            header: "Actions",
            render: (row) => (
              <Link href={`/issues/${row.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View
                </Button>
              </Link>
            ),
          },
        ]}
        rows={issues}
      />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
