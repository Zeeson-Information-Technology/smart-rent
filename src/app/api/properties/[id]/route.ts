import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { updatePropertySchema } from "@/features/properties/schemas";

import {
  canManageProperties,
  findAccessibleProperty,
  forbiddenResponse,
  notFoundResponse,
  serializeProperty,
  unauthenticatedResponse,
  validationErrorResponse,
} from "../utils";

type PropertyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: PropertyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (session.user.role === "tenant") {
    return forbiddenResponse("Tenants cannot access property records directly.");
  }

  const { id } = await context.params;
  const property = await findAccessibleProperty(id, session.user);

  if (!property) {
    return notFoundResponse();
  }

  return NextResponse.json({ property: serializeProperty(property) });
}

export async function PUT(request: Request, context: PropertyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageProperties(session.user.role)) {
    return forbiddenResponse("Only landlords and admins can edit properties.");
  }

  const { id } = await context.params;
  const property = await findAccessibleProperty(id, session.user);

  if (!property) {
    return notFoundResponse();
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updatePropertySchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  const nextData = { ...parsedBody.data };

  if (session.user.role !== "admin") {
    delete nextData.landlordId;
  }

  property.set(nextData);
  await property.save();

  return NextResponse.json({ property: serializeProperty(property) });
}

export async function DELETE(_request: Request, context: PropertyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageProperties(session.user.role)) {
    return forbiddenResponse("Only landlords and admins can delete properties.");
  }

  const { id } = await context.params;
  const property = await findAccessibleProperty(id, session.user);

  if (!property) {
    return notFoundResponse();
  }

  await property.deleteOne();

  return NextResponse.json({ success: true });
}
