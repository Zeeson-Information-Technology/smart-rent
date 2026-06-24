"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import type { IssueRecord } from "@/features/issues/types";

export function DisputeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIssueId = searchParams.get("issueId") ?? "";
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [issueId, setIssueId] = useState(initialIssueId);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadIssues() {
      const response = await fetch("/api/issues", { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (response.ok) {
        const nextIssues = result?.issues ?? [];
        setIssues(nextIssues);
        setIssueId((current) => current || nextIssues[0]?.id || "");
      }
    }
    void loadIssues();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueId, title, reason, description }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to raise dispute.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/disputes/${result.dispute.id}`);
    router.refresh();
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">Dispute information</h2>
        <p className="mt-1 text-sm text-slate-600">
          Select the issue and describe the formal dispute context.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {message ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{message}</p> : null}
          <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="issueId">
            Related issue
            <select
              className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
              id="issueId"
              onChange={(event) => setIssueId(event.target.value)}
              value={issueId}
            >
              {issues.map((issue) => (
                <option key={issue.id} value={issue.id}>
                  {issue.title} - {issue.property?.propertyName ?? "Property"}
                </option>
              ))}
            </select>
          </label>
          <Input label="Title" name="title" onChange={(event) => setTitle(event.target.value)} required value={title} />
          <Input label="Reason" name="reason" onChange={(event) => setReason(event.target.value)} placeholder="Repair timeline disagreement" required value={reason} />
          <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="description">
            Description
            <textarea
              className="min-h-36 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              id="description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the dispute, timeline, and review request."
              required
              value={description}
            />
          </label>
          <Button disabled={isSubmitting || !issueId} type="submit">
            {isSubmitting ? "Submitting..." : "Submit dispute"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
