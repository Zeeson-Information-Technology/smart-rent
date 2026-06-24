import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { PropertyModel, TenancyModel, UserModel } from "@/database/models";
import { tenancySchema } from "@/features/tenancies/schemas";
import { connectMongoDB } from "@/lib/mongodb";
import { createNotification } from "@/lib/notifications";

import {
  canManageTenancies,
  findAccessibleProperty,
  forbiddenResponse,
  serializePropertySummary,
  serializeTenancy,
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
        ? {
            $or: [
              { tenantId: session.user.id },
              { tenantEmail: session.user.email.toLowerCase() },
            ],
          }
        : { landlordId: session.user.id };

  const tenancies = await TenancyModel.find(query).sort({ createdAt: -1 });
  const propertyIds = [...new Set(tenancies.map((tenancy) => tenancy.propertyId))];
  const properties = await PropertyModel.find({ _id: { $in: propertyIds } });
  const propertiesById = new Map(
    properties.map((property) => [
      property._id.toString(),
      serializePropertySummary(property),
    ]),
  );

  return NextResponse.json({
    tenancies: tenancies.map((tenancy) =>
      serializeTenancy(tenancy, propertiesById.get(tenancy.propertyId)),
    ),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageTenancies(session.user.role)) {
    return forbiddenResponse("Only landlords and admins can create tenancies.");
  }

  const body = await request.json().catch(() => null);
  const parsedBody = tenancySchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  const property = await findAccessibleProperty(parsedBody.data.propertyId, session.user);

  if (!property) {
    return forbiddenResponse("You cannot create a tenancy for this property.");
  }

  const tenantEmail = parsedBody.data.tenantEmail.toLowerCase();
  const tenantUser = await UserModel.findOne({
    email: tenantEmail,
    role: "tenant",
  });

  const tenancy = await TenancyModel.create({
    propertyId: property._id.toString(),
    landlordId: property.landlordId,
    tenantId: tenantUser?._id.toString() ?? parsedBody.data.tenantId,
    tenantName: parsedBody.data.tenantName,
    tenantEmail,
    startDate: new Date(parsedBody.data.startDate),
    endDate: parsedBody.data.endDate
      ? new Date(parsedBody.data.endDate)
      : undefined,
    rentAmount: parsedBody.data.rentAmount,
    status: parsedBody.data.status,
  });

  await createNotification({
    userId: tenantUser?._id.toString(),
    title: "Tenancy assigned",
    message: `You have been assigned to ${property.propertyName}.`,
    type: "tenancy_created",
    relatedEntityType: "tenancy",
    relatedEntityId: tenancy._id.toString(),
  });

  return NextResponse.json(
    {
      tenancy: serializeTenancy(tenancy, serializePropertySummary(property)),
    },
    { status: 201 },
  );
}
