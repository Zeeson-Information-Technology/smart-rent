import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { PropertyModel, UserModel } from "@/database/models";
import { updateTenancySchema } from "@/features/tenancies/schemas";

import {
  canManageTenancies,
  findAccessibleProperty,
  findAccessibleTenancy,
  forbiddenResponse,
  notFoundResponse,
  serializePropertySummary,
  serializeTenancy,
  unauthenticatedResponse,
  validationErrorResponse,
} from "../utils";

type TenancyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: TenancyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;
  const tenancy = await findAccessibleTenancy(id, session.user);

  if (!tenancy) {
    return notFoundResponse();
  }

  const property = await PropertyModel.findOne({ _id: tenancy.propertyId });

  return NextResponse.json({
    tenancy: serializeTenancy(
      tenancy,
      property ? serializePropertySummary(property) : null,
    ),
  });
}

export async function PUT(request: Request, context: TenancyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageTenancies(session.user.role)) {
    return forbiddenResponse("Only landlords and admins can edit tenancies.");
  }

  const { id } = await context.params;
  const tenancy = await findAccessibleTenancy(id, session.user);

  if (!tenancy) {
    return notFoundResponse();
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateTenancySchema.safeParse(body);

  if (!parsedBody.success) {
    return validationErrorResponse(parsedBody.error.flatten().fieldErrors);
  }

  let property = await PropertyModel.findOne({ _id: tenancy.propertyId });

  if (parsedBody.data.propertyId) {
    property = await findAccessibleProperty(
      parsedBody.data.propertyId,
      session.user,
    );

    if (!property) {
      return forbiddenResponse(
        "You cannot move this tenancy to that property.",
      );
    }

    tenancy.propertyId = property._id.toString();
    tenancy.landlordId = property.landlordId;
  }

  if (parsedBody.data.tenantEmail) {
    const tenantEmail = parsedBody.data.tenantEmail.toLowerCase();
    const tenantUser = await UserModel.findOne({
      email: tenantEmail,
      role: "tenant",
    });

    tenancy.tenantEmail = tenantEmail;
    tenancy.tenantId = tenantUser?._id.toString() ?? parsedBody.data.tenantId;
  }

  if (parsedBody.data.tenantName !== undefined) {
    tenancy.tenantName = parsedBody.data.tenantName;
  }

  if (parsedBody.data.tenantPhone !== undefined) {
    tenancy.tenantPhone = parsedBody.data.tenantPhone;
  }

  if (parsedBody.data.additionalTenants !== undefined) {
    tenancy.additionalTenants = await Promise.all(
      parsedBody.data.additionalTenants.map(async (tenant) => {
        const email = tenant.email.toLowerCase();
        const user = await UserModel.findOne({ email, role: "tenant" }).select(
          "_id",
        );
        return { ...tenant, email, tenantId: user?._id.toString() ?? null };
      }),
    );
  }

  if (parsedBody.data.startDate !== undefined) {
    tenancy.startDate = new Date(parsedBody.data.startDate);
  }

  if (parsedBody.data.endDate !== undefined) {
    tenancy.endDate = parsedBody.data.endDate
      ? new Date(parsedBody.data.endDate)
      : undefined;
  }

  if (parsedBody.data.rentAmount !== undefined) {
    tenancy.rentAmount = parsedBody.data.rentAmount;
  }

  if (parsedBody.data.depositAmount !== undefined) {
    tenancy.depositAmount = parsedBody.data.depositAmount;
  }

  if (parsedBody.data.status !== undefined) {
    tenancy.status = parsedBody.data.status;
  }

  await tenancy.save();

  return NextResponse.json({
    tenancy: serializeTenancy(
      tenancy,
      property ? serializePropertySummary(property) : null,
    ),
  });
}

export async function DELETE(_request: Request, context: TenancyRouteContext) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  if (!canManageTenancies(session.user.role)) {
    return forbiddenResponse("Only landlords and admins can delete tenancies.");
  }

  const { id } = await context.params;
  const tenancy = await findAccessibleTenancy(id, session.user);

  if (!tenancy) {
    return notFoundResponse();
  }

  await tenancy.deleteOne();

  return NextResponse.json({ success: true });
}
