import { Types } from "mongoose";
import { NextResponse } from "next/server";

import {
  IssueModel,
  PropertyModel,
  TenancyModel,
  type IssueDocument,
} from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type { Property, Tenancy, UserRole } from "@/types/database";

export type ApiSessionUser = {
  email: string;
  id: string;
  role: UserRole;
};

type PropertySummary = Pick<
  Property,
  "address" | "city" | "postcode" | "propertyName" | "propertyType" | "status"
> & {
  id: string;
};

type TenancySummary = Pick<Tenancy, "tenantEmail" | "tenantName"> & {
  id: string;
};

export function unauthenticatedResponse() {
  return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
}

export function forbiddenResponse(message = "You are not authorized to access this resource.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Issue not found." }, { status: 404 });
}

export function validationErrorResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      error: "Validation failed.",
      fieldErrors,
    },
    { status: 400 },
  );
}

export async function findAccessibleIssue(id: string, user: ApiSessionUser) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectMongoDB();

  if (user.role === "admin") {
    return IssueModel.findOne({ _id: id });
  }

  if (user.role === "tenant") {
    return IssueModel.findOne({ _id: id, tenantId: user.id });
  }

  return IssueModel.findOne({ _id: id, landlordId: user.id });
}

export async function serializeIssueWithRelations(issue: IssueDocument) {
  const [property, tenancy] = await Promise.all([
    PropertyModel.findOne({ _id: issue.propertyId }),
    issue.tenancyId ? TenancyModel.findOne({ _id: issue.tenancyId }) : null,
  ]);

  return serializeIssue(
    issue,
    property ? serializePropertySummary(property) : null,
    tenancy ? serializeTenancySummary(tenancy) : null,
  );
}

export function serializeIssue(
  issue: IssueDocument,
  property?: PropertySummary | null,
  tenancy?: TenancySummary | null,
) {
  return {
    id: issue._id.toString(),
    propertyId: issue.propertyId,
    tenancyId: issue.tenancyId ?? null,
    tenantId: issue.tenantId,
    landlordId: issue.landlordId,
    title: issue.title,
    category: issue.category,
    description: issue.description,
    priority: issue.priority,
    status: issue.status,
    property: property ?? null,
    tenancy: tenancy ?? null,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
  };
}

export function serializePropertySummary(property: {
  _id: unknown;
  address: string;
  city: string;
  postcode: string;
  propertyName: string;
  propertyType: Property["propertyType"];
  status: Property["status"];
}): PropertySummary {
  return {
    id: String(property._id),
    propertyName: property.propertyName,
    address: property.address,
    city: property.city,
    postcode: property.postcode,
    propertyType: property.propertyType,
    status: property.status,
  };
}

export function serializeTenancySummary(tenancy: {
  _id: unknown;
  tenantEmail: string;
  tenantName: string;
}): TenancySummary {
  return {
    id: String(tenancy._id),
    tenantEmail: tenancy.tenantEmail,
    tenantName: tenancy.tenantName,
  };
}
