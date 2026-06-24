import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { EvidenceModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import { createEvidenceNotification } from "@/lib/notifications";

import {
  badRequestResponse,
  findAccessibleDispute,
  findAccessibleIssue,
  serializeEvidence,
  unauthenticatedResponse,
  uploadEvidenceToCloudinary,
  validateEvidenceFile,
} from "../utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const formData = await request.formData();
  const issueId = formData.get("issueId");
  const disputeId = formData.get("disputeId");
  const file = formData.get("file");

  if (
    (typeof issueId !== "string" || !issueId) &&
    (typeof disputeId !== "string" || !disputeId)
  ) {
    return badRequestResponse("Issue ID or dispute ID is required.");
  }

  if (!(file instanceof File)) {
    return badRequestResponse("Evidence file is required.");
  }

  const issue =
    typeof issueId === "string" && issueId
      ? await findAccessibleIssue(issueId, session.user)
      : null;
  const dispute =
    typeof disputeId === "string" && disputeId
      ? await findAccessibleDispute(disputeId, session.user)
      : null;

  if (!issue && !dispute) {
    return NextResponse.json({ error: "Linked record not found." }, { status: 404 });
  }

  let validatedFile;

  try {
    validatedFile = await validateEvidenceFile(file);
  } catch (error) {
    return badRequestResponse(
      error instanceof Error ? error.message : "Invalid evidence file.",
    );
  }

  await connectMongoDB();

  const uploadResult = await uploadEvidenceToCloudinary(
    validatedFile,
    dispute ? "disputes" : "issues",
  );
  const evidence = await EvidenceModel.create({
    issueId: issue?._id.toString(),
    disputeId: dispute?._id.toString(),
    uploadedBy: session.user.id,
    fileName: validatedFile.fileName,
    fileUrl: uploadResult.secure_url,
    fileType: validatedFile.fileType,
    cloudinaryPublicId: uploadResult.public_id,
  });
  const recipientId = issue
    ? session.user.id === issue.tenantId
      ? issue.landlordId
      : issue.tenantId
    : dispute
      ? session.user.id === dispute.tenantId
        ? dispute.landlordId
        : dispute.tenantId
      : null;

  if (recipientId && recipientId !== session.user.id) {
    await createEvidenceNotification({
      userId: recipientId,
      evidenceId: evidence._id.toString(),
      message: `${session.user.name} uploaded ${validatedFile.fileName}.`,
    });
  }

  return NextResponse.json(
    {
      evidence: await serializeEvidence(evidence),
    },
    { status: 201 },
  );
}
