import { auth } from "@/auth";
import { EvidenceModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  findAccessibleDispute,
  notFoundResponse,
  serializeEvidenceList,
  unauthenticatedResponse,
} from "../../utils";

export const runtime = "nodejs";

type EvidenceByDisputeContext = {
  params: Promise<{ disputeId: string }>;
};

export async function GET(_request: Request, context: EvidenceByDisputeContext) {
  const session = await auth();
  if (!session?.user) return unauthenticatedResponse();

  const { disputeId } = await context.params;
  const dispute = await findAccessibleDispute(disputeId, session.user);
  if (!dispute) return notFoundResponse("Dispute not found.");

  await connectMongoDB();
  const evidenceItems = await EvidenceModel.find({ disputeId }).sort({ createdAt: -1 });

  return Response.json({ evidence: await serializeEvidenceList(evidenceItems) });
}
