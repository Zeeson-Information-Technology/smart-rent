"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui";
import type { EvidenceRecord } from "@/features/evidence/types";

import { EvidenceCard } from "./evidence-card";
import { EvidenceUploader } from "./evidence-uploader";

type EvidenceGalleryProps = {
  disputeId?: string;
  issueId?: string;
  onEvidenceCountChange?: (count: number) => void;
};

export function EvidenceGallery({
  disputeId,
  issueId,
  onEvidenceCountChange,
}: EvidenceGalleryProps) {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceRecord[]>([]);
  const [selectedImage, setSelectedImage] = useState<EvidenceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvidence() {
      setIsLoading(true);
      const response = await fetch(
        disputeId ? `/api/evidence/dispute/${disputeId}` : `/api/evidence/issue/${issueId}`,
        {
        cache: "no-store",
        },
      );
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setMessage(result?.error ?? "Unable to load evidence.");
        setIsLoading(false);
        return;
      }

      const nextEvidence = result?.evidence ?? [];
      setEvidenceItems(nextEvidence);
      onEvidenceCountChange?.(nextEvidence.length);
      setIsLoading(false);
    }

    void loadEvidence();

    return () => {
      mounted = false;
    };
  }, [disputeId, issueId, onEvidenceCountChange]);

  async function deleteEvidence(id: string) {
    const confirmed = window.confirm("Delete this evidence file?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/evidence/${id}`, {
      method: "DELETE",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to delete evidence.");
      return;
    }

    setEvidenceItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.id !== id);
      onEvidenceCountChange?.(nextItems.length);
      return nextItems;
    });
    setMessage("Evidence deleted.");
  }

  return (
    <div className="grid gap-4">
      <EvidenceUploader
        disputeId={disputeId}
        issueId={issueId}
        onUploaded={(evidence) => {
          setEvidenceItems((currentItems) => {
            const nextItems = [evidence, ...currentItems];
            onEvidenceCountChange?.(nextItems.length);
            return nextItems;
          });
        }}
      />

      {message ? (
        <p className="text-sm font-medium text-slate-600">{message}</p>
      ) : null}

      {isLoading ? (
        <p className="text-sm font-medium text-slate-600">Loading evidence...</p>
      ) : evidenceItems.length === 0 ? (
        <div className="rounded-xl border bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-950">No evidence uploaded yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload photos or PDF documents to support this issue record.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {evidenceItems.map((evidence) => (
            <EvidenceCard
              evidence={evidence}
              key={evidence.id}
              onDelete={(id) => void deleteEvidence(id)}
              onOpenImage={setSelectedImage}
            />
          ))}
        </div>
      )}

      {selectedImage ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-950">
                {selectedImage.fileName}
              </p>
              <Button
                aria-label="Close image preview"
                onClick={() => setSelectedImage(null)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={selectedImage.fileName}
              className="max-h-[80vh] w-full object-contain"
              src={selectedImage.fileUrl}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
