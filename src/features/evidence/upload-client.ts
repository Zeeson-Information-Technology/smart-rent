import type { EvidenceRecord } from "./types";

type UploadEvidenceFileOptions = {
  disputeId?: string;
  file: File;
  issueId?: string;
  onProgress?: (progress: number) => void;
};

export function uploadEvidenceFile({
  disputeId,
  file,
  issueId,
  onProgress,
}: UploadEvidenceFileOptions): Promise<EvidenceRecord> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    if (issueId) formData.append("issueId", issueId);
    if (disputeId) formData.append("disputeId", disputeId);
    formData.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/evidence/upload");

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress?.(Math.round((event.loaded / event.total) * 100));
    });

    request.addEventListener("load", () => {
      const result = safeParseJson(request.responseText);

      if (request.status < 200 || request.status >= 300) {
        reject(new Error(result?.error ?? "Unable to upload evidence."));
        return;
      }

      resolve(result.evidence);
    });

    request.addEventListener("error", () => {
      reject(new Error("Unable to upload evidence."));
    });

    request.send(formData);
  });
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
