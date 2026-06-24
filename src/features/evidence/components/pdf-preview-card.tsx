import { FileText } from "lucide-react";

import type { EvidenceRecord } from "@/features/evidence/types";

type PdfPreviewCardProps = {
  evidence: EvidenceRecord;
};

export function PdfPreviewCard({ evidence }: PdfPreviewCardProps) {
  return (
    <a
      className="flex items-center gap-3 rounded-xl border bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
      href={evidence.fileUrl}
      rel="noreferrer"
      target="_blank"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
        <FileText className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-950">
          {evidence.fileName}
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          Uploaded {formatDate(evidence.createdAt)} by {evidence.uploadedByName}
        </span>
      </span>
    </a>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
