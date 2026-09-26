import { Types } from "mongoose";
import { NextResponse } from "next/server";

import {
  PropertyModel,
  TenancyModel,
  type TenancyDocument,
} from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type { Property, UserRole } from "@/types/database";

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

export function notFoundResponse() {
  return NextResponse.json({ error: "Tenancy not found." }, { status: 404 });
}

export function validationErrorResponse(
  fieldErrors: Record<string, string[] | undefined>,
) {
  return NextResponse.json(
    {
      error: "Validation failed.",
      fieldErrors,
    },
    { status: 400 },
  );
}

export function canManageTenancies(role: UserRole) {
  return role === "landlord" || role === "admin";
}

export async function findAccessibleTenancy(id: string, user: ApiSessionUser) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectMongoDB();

  if (user.role === "admin") {
    return TenancyModel.findOne({ _id: id });
  }

  if (user.role === "tenant") {
    return TenancyModel.findOne({
      _id: id,
      $or: [
        { tenantId: user.id },
        { tenantEmail: user.email.toLowerCase() },
        { "additionalTenants.tenantId": user.id },
        { "additionalTenants.email": user.email.toLowerCase() },
      ],
    });
  }

  return TenancyModel.findOne({ _id: id, landlordId: user.id });
}

export async function findAccessibleProperty(
  propertyId: string,
  user: ApiSessionUser,
) {
  if (!Types.ObjectId.isValid(propertyId)) {
    return null;
  }

  await connectMongoDB();

  const query =
    user.role === "admin"
      ? { _id: propertyId }
      : { _id: propertyId, landlordId: user.id };

  return PropertyModel.findOne(query);
}

export function serializeTenancy(
  tenancy: TenancyDocument,
  property?: PropertySummary | null,
) {
  return {
    id: tenancy._id.toString(),
    propertyId: tenancy.propertyId,
    landlordId: tenancy.landlordId,
    tenantId: tenancy.tenantId ?? null,
    tenantName: tenancy.tenantName,
    tenantEmail: tenancy.tenantEmail,
    tenantPhone: tenancy.tenantPhone ?? "",
    additionalTenants: (tenancy.additionalTenants ?? []).map((tenant) => ({
      tenantId: tenant.tenantId ?? null,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
    })),
    startDate: tenancy.startDate.toISOString(),
    endDate: tenancy.endDate?.toISOString() ?? null,
    rentAmount: tenancy.rentAmount,
    status: tenancy.status,
    property: property ?? null,
    createdAt: tenancy.createdAt.toISOString(),
    updatedAt: tenancy.updatedAt.toISOString(),
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
