import { Types } from "mongoose";

import { auth } from "@/auth";
import { DisputeModel, EvidenceModel, IssueModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  canDeleteEvidence,
  deleteEvidenceFromCloudinary,
  forbiddenResponse,
  notFoundResponse,
  unauthenticatedResponse,
} from "../utils";

export const runtime = "nodejs";

type EvidenceRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: EvidenceRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return notFoundResponse();
  }

  await connectMongoDB();

  const evidence = await EvidenceModel.findOne({ _id: id });

  if (!evidence || (!evidence.issueId && !evidence.disputeId)) {
    return notFoundResponse();
  }

  const record = evidence.issueId
    ? await IssueModel.findOne({ _id: evidence.issueId })
    : await DisputeModel.findOne({ _id: evidence.disputeId });

  if (!record) {
    return notFoundResponse("Linked record not found.");
  }

  if (!canDeleteEvidence(evidence, record, session.user)) {
    return forbiddenResponse("You cannot delete this evidence.");
  }

  await deleteEvidenceFromCloudinary(evidence);
  await evidence.deleteOne();

  return Response.json({ success: true });
}
