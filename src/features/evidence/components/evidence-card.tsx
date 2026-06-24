"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import type { EvidenceRecord } from "@/features/evidence/types";

import { PdfPreviewCard } from "./pdf-preview-card";

type EvidenceCardProps = {
  evidence: EvidenceRecord;
  onDelete: (id: string) => void;
  onOpenImage: (evidence: EvidenceRecord) => void;
};

export function EvidenceCard({
  evidence,
  onDelete,
  onOpenImage,
}: EvidenceCardProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/60">
      {evidence.fileType === "pdf" ? (
        <PdfPreviewCard evidence={evidence} />
      ) : (
        <button
          className="overflow-hidden rounded-xl border bg-slate-50 text-left"
          onClick={() => onOpenImage(evidence)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={evidence.fileName}
            className="h-44 w-full object-cover"
            src={evidence.fileUrl}
          />
          <span className="block p-3">
            <span className="block truncate text-sm font-semibold text-slate-950">
              {evidence.fileName}
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Uploaded {formatDate(evidence.createdAt)} by {evidence.uploadedByName}
            </span>
          </span>
        </button>
      )}
      <Button
        className="justify-center text-red-700 hover:bg-red-50"
        onClick={() => onDelete(evidence.id)}
        size="sm"
        type="button"
        variant="outline"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </Button>
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
