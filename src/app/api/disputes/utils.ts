import { Types } from "mongoose";
import { NextResponse } from "next/server";

import {
  DisputeModel,
  IssueModel,
  PropertyModel,
  TenancyModel,
  UserModel,
  type DisputeDocument,
} from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type { UserRole } from "@/types/database";

export type ApiSessionUser = {
  id: string;
  role: UserRole;
};

export function unauthenticatedResponse() {
  return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
}

export function forbiddenResponse(message = "You are not authorized to access this resource.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Dispute not found." }, { status: 404 });
}

export function validationErrorResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json({ error: "Validation failed.", fieldErrors }, { status: 400 });
}

export async function generateDisputeReference() {
  const year = new Date().getFullYear();
  const count = await DisputeModel.countDocuments({
    disputeReference: new RegExp(`^DIS-${year}-`),
  });

  return `DIS-${year}-${String(count + 1).padStart(4, "0")}`;
}

export function canAccessDispute(dispute: DisputeDocument, user: ApiSessionUser) {
  if (user.role === "admin") return true;
  if (user.role === "tenant") return dispute.tenantId === user.id || dispute.raisedBy === user.id;
  return dispute.landlordId === user.id;
}

export async function findAccessibleDispute(id: string, user: ApiSessionUser) {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectMongoDB();
  const dispute = await DisputeModel.findOne({ _id: id });
  if (!dispute || !canAccessDispute(dispute, user)) return null;
  return dispute;
}

export async function serializeDispute(dispute: DisputeDocument) {
  const [issue, property, tenancy, tenant] = await Promise.all([
    IssueModel.findOne({ _id: dispute.issueId }),
    PropertyModel.findOne({ _id: dispute.propertyId }),
    dispute.tenancyId ? TenancyModel.findOne({ _id: dispute.tenancyId }) : null,
    UserModel.findOne({ _id: dispute.tenantId }),
  ]);

  return {
    id: dispute._id.toString(),
    disputeReference: dispute.disputeReference,
    issueId: dispute.issueId,
    propertyId: dispute.propertyId,
    tenancyId: dispute.tenancyId ?? null,
    landlordId: dispute.landlordId,
    tenantId: dispute.tenantId,
    raisedBy: dispute.raisedBy,
    title: dispute.title,
    reason: dispute.reason,
    description: dispute.description,
    status: dispute.status,
    priority: dispute.priority,
    resolutionNotes: dispute.resolutionNotes ?? "",
    issueTitle: issue?.title ?? "Issue unavailable",
    propertyName: property?.propertyName ?? "Property unavailable",
    tenantName: tenancy?.tenantName ?? tenant?.name ?? "Tenant",
    createdAt: dispute.createdAt.toISOString(),
    updatedAt: dispute.updatedAt.toISOString(),
  };
}
