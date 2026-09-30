import { NextResponse } from "next/server";
import { Types } from "mongoose";

import {
  DisputeModel,
  IssueModel,
  TenancyModel,
  UserModel,
} from "@/database/models";
import { getCloudinaryClient } from "@/lib/cloudinary";
import { connectMongoDB } from "@/lib/mongodb";
import type {
  DisputeDocument,
  EvidenceDocument,
  IssueDocument,
} from "@/database/models";
import type { EvidenceType, UserRole } from "@/types/database";
import { tenantBelongsToTenancy } from "@/lib/tenancy-access";

export const MAX_EVIDENCE_FILE_SIZE = 10 * 1024 * 1024;

type ApiSessionUser = {
  email: string;
  id: string;
  role: UserRole;
};

type ValidatedEvidenceFile = {
  buffer: Buffer;
  dataUri: string;
  fileName: string;
  fileType: EvidenceType;
  mimeType: string;
};

export function unauthenticatedResponse() {
  return NextResponse.json(
    { error: "Authentication is required." },
    { status: 401 },
  );
}

export function forbiddenResponse(
  message = "You are not authorized to access this resource.",
) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFoundResponse(message = "Evidence not found.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function findAccessibleIssue(
  issueId: string,
  user: ApiSessionUser,
) {
  if (!Types.ObjectId.isValid(issueId)) {
    return null;
  }

  await connectMongoDB();

  const issue = await IssueModel.findOne({ _id: issueId });

  if (!issue) {
    return null;
  }

  if (!(await canAccessIssue(issue, user))) {
    return null;
  }

  return issue;
}

export async function findAccessibleDispute(
  disputeId: string,
  user: ApiSessionUser,
) {
  if (!Types.ObjectId.isValid(disputeId)) {
    return null;
  }

  await connectMongoDB();
  const dispute = await DisputeModel.findOne({ _id: disputeId });

  if (!dispute) {
    return null;
  }

  if (user.role === "admin") {
    return dispute;
  }

  if (user.role === "tenant") {
    if (dispute.tenantId === user.id || dispute.raisedBy === user.id)
      return dispute;
    const tenancy = dispute.tenancyId
      ? await TenancyModel.findById(dispute.tenancyId)
      : null;
    return tenancy && tenantBelongsToTenancy(tenancy, user) ? dispute : null;
  }

  return dispute.landlordId === user.id ? dispute : null;
}

export async function canAccessIssue(
  issue: IssueDocument,
  user: ApiSessionUser,
) {
  if (user.role === "admin") {
    return true;
  }

  if (user.role === "tenant") {
    if (issue.tenantId === user.id) return true;
    const tenancy = issue.tenancyId
      ? await TenancyModel.findById(issue.tenancyId)
      : null;
    return tenancy ? tenantBelongsToTenancy(tenancy, user) : false;
  }

  return issue.landlordId === user.id;
}

export function canDeleteEvidence(
  evidence: EvidenceDocument,
  record: IssueDocument | DisputeDocument,
  user: ApiSessionUser,
) {
  return (
    user.role === "admin" ||
    evidence.uploadedBy === user.id ||
    (user.role === "landlord" && record.landlordId === user.id)
  );
}

export async function validateEvidenceFile(
  file: File,
): Promise<ValidatedEvidenceFile> {
  if (file.size > MAX_EVIDENCE_FILE_SIZE) {
    throw new Error("File size must be 10 MB or less.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const detected = detectFileType(buffer);

  if (!detected) {
    throw new Error(
      "Unsupported file type. Upload JPG, JPEG, PNG, WEBP, or PDF files.",
    );
  }

  return {
    buffer,
    dataUri: `data:${detected.mimeType};base64,${buffer.toString("base64")}`,
    fileName: file.name,
    fileType: detected.fileType,
    mimeType: detected.mimeType,
  };
}

export async function uploadEvidenceToCloudinary(
  file: ValidatedEvidenceFile,
  folder: "issues" | "disputes" = "issues",
) {
  return getCloudinaryClient().uploader.upload(file.dataUri, {
    folder: `smartrent/${folder}`,
    resource_type: file.fileType === "pdf" ? "raw" : "image",
    type: "upload",
  });
}

export async function deleteEvidenceFromCloudinary(evidence: EvidenceDocument) {
  await getCloudinaryClient().uploader.destroy(evidence.cloudinaryPublicId, {
    resource_type: evidence.fileType === "pdf" ? "raw" : "image",
  });
}

export async function serializeEvidence(evidence: EvidenceDocument) {
  const uploader = await UserModel.findOne({ _id: evidence.uploadedBy });

  return {
    id: evidence._id.toString(),
    issueId: evidence.issueId ?? null,
    disputeId: evidence.disputeId ?? null,
    uploadedBy: evidence.uploadedBy,
    uploadedByName: uploader?.name ?? "SmartRent user",
    fileName: evidence.fileName,
    fileUrl: evidence.fileUrl,
    fileType: evidence.fileType,
    cloudinaryPublicId: evidence.cloudinaryPublicId,
    createdAt: evidence.createdAt.toISOString(),
    updatedAt: evidence.updatedAt.toISOString(),
  };
}

export async function serializeEvidenceList(evidenceItems: EvidenceDocument[]) {
  const uploaderIds = [
    ...new Set(evidenceItems.map((item) => item.uploadedBy)),
  ];
  const uploaders = await UserModel.find({ _id: { $in: uploaderIds } });
  const uploadersById = new Map(
    uploaders.map((uploader) => [uploader._id.toString(), uploader.name]),
  );

  return evidenceItems.map((evidence) => ({
    id: evidence._id.toString(),
    issueId: evidence.issueId ?? null,
    disputeId: evidence.disputeId ?? null,
    uploadedBy: evidence.uploadedBy,
    uploadedByName: uploadersById.get(evidence.uploadedBy) ?? "SmartRent user",
    fileName: evidence.fileName,
    fileUrl: evidence.fileUrl,
    fileType: evidence.fileType,
    cloudinaryPublicId: evidence.cloudinaryPublicId,
    createdAt: evidence.createdAt.toISOString(),
    updatedAt: evidence.updatedAt.toISOString(),
  }));
}

function detectFileType(
  buffer: Buffer,
): { fileType: EvidenceType; mimeType: string } | null {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { fileType: "image", mimeType: "image/jpeg" };
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { fileType: "image", mimeType: "image/png" };
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { fileType: "image", mimeType: "image/webp" };
  }

  if (buffer.toString("ascii", 0, 4) === "%PDF") {
    return { fileType: "pdf", mimeType: "application/pdf" };
  }

  return null;
}
