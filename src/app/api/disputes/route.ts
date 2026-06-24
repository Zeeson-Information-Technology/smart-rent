import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { DisputeModel, IssueModel } from "@/database/models";
import { createDisputeSchema } from "@/features/disputes/schemas";
import { connectMongoDB } from "@/lib/mongodb";
import { createDisputeNotification } from "@/lib/notifications";

import {
  forbiddenResponse,
  generateDisputeReference,
  serializeDispute,
  unauthenticatedResponse,
  validationErrorResponse,
} from "./utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) return unauthenticatedResponse();

  await connectMongoDB();
  const query =
    session.user.role === "admin"
      ? {}
      : session.user.role === "tenant"
        ? { tenantId: session.user.id }
        : { landlordId: session.user.id };
  const disputes = await DisputeModel.find(query).sort({ createdAt: -1 });

  return NextResponse.json({
    disputes: await Promise.all(disputes.map(serializeDispute)),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return unauthenticatedResponse();

  const body = await request.json().catch(() => null);
  const parsedBody = createDisputeSchema.safeParse(body);
  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  await connectMongoDB();
  const issue = await IssueModel.findOne({ _id: parsedBody.data.issueId });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  const canCreate =
    session.user.role === "admin" ||
    issue.tenantId === session.user.id ||
    issue.landlordId === session.user.id;
  if (!canCreate) {
    return forbiddenResponse("You cannot raise a dispute for this issue.");
  }

  const dispute = await DisputeModel.create({
    disputeReference: await generateDisputeReference(),
    issueId: issue._id.toString(),
    propertyId: issue.propertyId,
    tenancyId: issue.tenancyId,
    landlordId: issue.landlordId,
    tenantId: issue.tenantId,
    raisedBy: session.user.id,
    title: parsedBody.data.title,
    reason: parsedBody.data.reason,
    description: parsedBody.data.description,
    status: "open",
    priority: issue.priority,
  });

  if (issue.landlordId !== session.user.id) {
    await createDisputeNotification({
      userId: issue.landlordId,
      disputeId: dispute._id.toString(),
      title: "New dispute raised",
      message: `${session.user.name} raised "${dispute.title}".`,
      type: "dispute_created",
    });
  }

  return NextResponse.json({ dispute: await serializeDispute(dispute) }, { status: 201 });
}
