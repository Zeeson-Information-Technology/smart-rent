"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui";
import type { EvidenceRecord } from "@/features/evidence/types";
import { uploadEvidenceFile } from "@/features/evidence/upload-client";

import { UploadProgress } from "./upload-progress";

type EvidenceUploaderProps = {
  disputeId?: string;
  issueId?: string;
  onUploaded?: (evidence: EvidenceRecord) => void;
};

export function EvidenceUploader({ disputeId, issueId, onUploaded }: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      for (const file of Array.from(files)) {
        setProgress((current) => ({ ...current, [file.name]: 0 }));
        const evidence = await uploadEvidenceFile({
          disputeId,
          file,
          issueId,
          onProgress: (nextProgress) => {
            setProgress((current) => ({
              ...current,
              [file.name]: nextProgress,
            }));
          },
        });
        onUploaded?.(evidence);
      }

      setMessage("Evidence uploaded successfully.");
      setProgress({});
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload evidence.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-xl border border-dashed bg-slate-50 p-5">
      <input
        accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        multiple
        onChange={(event) => void handleFiles(event.target.files)}
        ref={inputRef}
        type="file"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">Upload evidence</p>
            <p className="text-sm text-slate-500">JPG, PNG, WEBP, or PDF up to 10 MB.</p>
          </div>
        </div>
        <Button
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {isUploading ? "Uploading..." : "Choose files"}
        </Button>
      </div>
      {Object.entries(progress).map(([fileName, value]) => (
        <UploadProgress fileName={fileName} key={fileName} progress={value} />
      ))}
      {message ? (
        <p className="text-sm font-medium text-slate-600">{message}</p>
      ) : null}
    </div>
  );
}
