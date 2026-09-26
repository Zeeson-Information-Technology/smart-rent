import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { PropertyModel, type PropertyDocument } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import type { UserRole } from "@/types/database";

export type ApiSessionUser = {
  id: string;
  role: UserRole;
};

export function forbiddenResponse(
  message = "You are not authorized to access this resource.",
) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function unauthenticatedResponse() {
  return NextResponse.json(
    { error: "Authentication is required." },
    { status: 401 },
  );
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Property not found." }, { status: 404 });
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

export function canManageProperties(role: UserRole) {
  return role === "landlord" || role === "admin";
}

export async function findAccessibleProperty(id: string, user: ApiSessionUser) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectMongoDB();

  const query =
    user.role === "admin" ? { _id: id } : { _id: id, landlordId: user.id };

  return PropertyModel.findOne(query);
}

export function serializeProperty(property: PropertyDocument) {
  return {
    id: property._id.toString(),
    landlordId: property.landlordId,
    propertyName: property.propertyName,
    address: property.address,
    city: property.city,
    postcode: property.postcode,
    propertyType: property.propertyType,
    status: property.status,
    description: property.description ?? "",
    bedroomCount: property.bedroomCount ?? 0,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}
