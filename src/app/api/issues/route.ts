import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { IssueModel, PropertyModel, TenancyModel } from "@/database/models";
import { issueCreateSchema } from "@/features/issues/schemas";
import { connectMongoDB } from "@/lib/mongodb";
import { createIssueNotification } from "@/lib/notifications";
import { getIssuePriority } from "@/lib/smartPriority";

import {
  forbiddenResponse,
  serializeIssue,
  serializePropertySummary,
  serializeTenancySummary,
  unauthenticatedResponse,
  validationErrorResponse,
} from "./utils";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  await connectMongoDB();

  const query =
    session.user.role === "admin"
      ? {}
      : session.user.role === "tenant"
        ? { tenantId: session.user.id }
        : { landlordId: session.user.id };

  const issues = await IssueModel.find(query).sort({ createdAt: -1 });
  const propertyIds = [...new Set(issues.map((issue) => issue.propertyId))];
  const tenancyIds = [
    ...new Set(issues.map((issue) => issue.tenancyId).filter(Boolean)),
  ];
  const [properties, tenancies] = await Promise.all([
    PropertyModel.find({ _id: { $in: propertyIds } }),
    TenancyModel.find({ _id: { $in: tenancyIds } }),
  ]);
  const propertiesById = new Map(
    properties.map((property) => [
      property._id.toString(),
      serializePropertySummary(property),
    ]),
  );
  const tenanciesById = new Map(
    tenancies.map((tenancy) => [
      tenancy._id.toString(),
      serializeTenancySummary(tenancy),
    ]),
  );

  return NextResponse.json({
    issues: issues.map((issue) =>
      serializeIssue(
        issue,
        propertiesById.get(issue.propertyId),
        issue.tenancyId ? tenanciesById.get(issue.tenancyId) : null,
      ),
    ),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (session.user.role !== "tenant") {
    return forbiddenResponse("Only tenants can report issues.");
  }

  const body = await request.json().catch(() => null);
  const parsedBody = issueCreateSchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  await connectMongoDB();

  const tenancy = await TenancyModel.findOne({
    propertyId: parsedBody.data.propertyId,
    $or: [
      { tenantId: session.user.id },
      { tenantEmail: session.user.email.toLowerCase() },
      { "additionalTenants.tenantId": session.user.id },
      { "additionalTenants.email": session.user.email.toLowerCase() },
    ],
  });

  if (!tenancy) {
    return forbiddenResponse(
      "You can only report issues for your assigned tenancy.",
    );
  }

  if (
    parsedBody.data.tenancyId &&
    parsedBody.data.tenancyId !== tenancy._id.toString()
  ) {
    return forbiddenResponse(
      "You can only report issues for your assigned tenancy.",
    );
  }

  const property = await PropertyModel.findOne({ _id: tenancy.propertyId });

  if (!property) {
    return forbiddenResponse("The assigned property could not be verified.");
  }

  const issue = await IssueModel.create({
    propertyId: property._id.toString(),
    tenancyId: tenancy._id.toString(),
    tenantId: session.user.id,
    landlordId: tenancy.landlordId,
    title: parsedBody.data.title,
    category: parsedBody.data.category,
    description: parsedBody.data.description,
    priority: getIssuePriority(parsedBody.data.category),
    status: "open",
  });

  await createIssueNotification({
    userId: issue.landlordId,
    issueId: issue._id.toString(),
    title: "New issue reported",
    message: `${session.user.name} reported "${issue.title}" at ${property.propertyName}.`,
    type: "issue_created",
  });

  return NextResponse.json(
    {
      issue: serializeIssue(
        issue,
        serializePropertySummary(property),
        serializeTenancySummary(tenancy),
      ),
    },
    { status: 201 },
  );
}
