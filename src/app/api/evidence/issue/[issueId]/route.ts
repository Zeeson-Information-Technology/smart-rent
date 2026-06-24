import { auth } from "@/auth";
import { EvidenceModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  findAccessibleIssue,
  notFoundResponse,
  serializeEvidenceList,
  unauthenticatedResponse,
} from "../../utils";

export const runtime = "nodejs";

type EvidenceByIssueContext = {
  params: Promise<{
    issueId: string;
  }>;
};

export async function GET(_request: Request, context: EvidenceByIssueContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { issueId } = await context.params;
  const issue = await findAccessibleIssue(issueId, session.user);

  if (!issue) {
    return notFoundResponse("Issue not found.");
  }

  await connectMongoDB();

  const evidenceItems = await EvidenceModel.find({ issueId }).sort({
    createdAt: -1,
  });

  return Response.json({
    evidence: await serializeEvidenceList(evidenceItems),
  });
}
