import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { issueStatusUpdateSchema } from "@/features/issues/schemas";
import { createIssueNotification } from "@/lib/notifications";

import {
  findAccessibleIssue,
  forbiddenResponse,
  notFoundResponse,
  serializeIssueWithRelations,
  unauthenticatedResponse,
  validationErrorResponse,
} from "../utils";

type IssueRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: IssueRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;
  const issue = await findAccessibleIssue(id, session.user);

  if (!issue) {
    return notFoundResponse();
  }

  return NextResponse.json({ issue: await serializeIssueWithRelations(issue) });
}

export async function PUT(request: Request, context: IssueRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (session.user.role === "tenant") {
    return forbiddenResponse("Tenants cannot update issue status.");
  }

  const { id } = await context.params;
  const issue = await findAccessibleIssue(id, session.user);

  if (!issue) {
    return notFoundResponse();
  }

  const body = await request.json().catch(() => null);
  const parsedBody = issueStatusUpdateSchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  const previousStatus = issue.status;
  issue.status = parsedBody.data.status;
  await issue.save();

  if (previousStatus !== issue.status) {
    await createIssueNotification({
      userId: issue.tenantId,
      issueId: issue._id.toString(),
      title: "Issue status updated",
      message: `"${issue.title}" is now ${issue.status.replaceAll("_", " ")}.`,
      type: "issue_status_updated",
    });
  }

  return NextResponse.json({ issue: await serializeIssueWithRelations(issue) });
}

export async function DELETE(_request: Request, context: IssueRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (session.user.role !== "admin") {
    return forbiddenResponse("Only admins can delete issues.");
  }

  const { id } = await context.params;
  const issue = await findAccessibleIssue(id, session.user);

  if (!issue) {
    return notFoundResponse();
  }

  await issue.deleteOne();

  return NextResponse.json({ success: true });
}
