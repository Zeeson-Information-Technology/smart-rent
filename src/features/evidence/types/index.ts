import type { EvidenceType } from "@/types/database";

export type EvidenceRecord = {
  id: string;
  issueId: string | null;
  disputeId: string | null;
  uploadedBy: string;
  uploadedByName: string;
  fileName: string;
  fileUrl: string;
  fileType: EvidenceType;
  cloudinaryPublicId: string;
  createdAt: string;
  updatedAt: string;
};
