import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { PropertyModel } from "@/database/models";
import { propertySchema } from "@/features/properties/schemas";
import { connectMongoDB } from "@/lib/mongodb";
import { createNotification } from "@/lib/notifications";

import {
  canManageProperties,
  forbiddenResponse,
  serializeProperty,
  unauthenticatedResponse,
  validationErrorResponse,
} from "./utils";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (session.user.role === "tenant") {
    return forbiddenResponse("Tenants cannot access the property portfolio.");
  }

  await connectMongoDB();

  const query =
    session.user.role === "admin" ? {} : { landlordId: session.user.id };
  const properties = await PropertyModel.find(query).sort({ createdAt: -1 });

  return NextResponse.json({
    properties: properties.map(serializeProperty),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageProperties(session.user.role)) {
    return forbiddenResponse(
      "Only landlords and admins can create properties.",
    );
  }

  const body = await request.json().catch(() => null);
  const parsedBody = propertySchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  const landlordId =
    session.user.role === "admin" && parsedBody.data.landlordId
      ? parsedBody.data.landlordId
      : session.user.id;

  await connectMongoDB();

  const property = await PropertyModel.create({
    landlordId,
    propertyName: parsedBody.data.propertyName,
    address: parsedBody.data.address,
    city: parsedBody.data.city,
    postcode: parsedBody.data.postcode,
    propertyType: parsedBody.data.propertyType,
    status: parsedBody.data.status,
    description: parsedBody.data.description,
    bedroomCount: parsedBody.data.bedroomCount,
  });

  await createNotification({
    userId: session.user.id,
    title: "Property created",
    message: `${property.propertyName} has been added to your portfolio.`,
    type: "property_created",
    relatedEntityType: "property",
    relatedEntityId: property._id.toString(),
  });

  return NextResponse.json(
    {
      property: serializeProperty(property),
    },
    { status: 201 },
  );
}
