import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import {
  InventoryAcknowledgementModel,
  InventoryItemModel,
  TenancyModel,
} from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import { tenantMembershipConditions } from "@/lib/tenancy-access";

const acknowledgementSchema = z.object({
  tenancyId: z.string().trim().min(1),
  status: z.enum(["confirmed", "disputed"]),
  note: z.string().trim().max(1000).optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }
  if (session.user.role !== "tenant") {
    return NextResponse.json(
      { error: "Only tenants can confirm inventory condition." },
      { status: 403 },
    );
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Inventory item not found." },
      { status: 404 },
    );
  }
  const parsed = acknowledgementSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Select an inventory condition response." },
      { status: 400 },
    );
  }

  await connectMongoDB();
  const [item, tenancy] = await Promise.all([
    InventoryItemModel.findById(id),
    TenancyModel.findOne({
      _id: parsed.data.tenancyId,
      $or: tenantMembershipConditions(session.user),
    }),
  ]);
  if (!item || !tenancy || tenancy.propertyId !== item.propertyId) {
    return NextResponse.json(
      { error: "Inventory item not found." },
      { status: 404 },
    );
  }

  const acknowledgement = await InventoryAcknowledgementModel.findOneAndUpdate(
    {
      inventoryItemId: id,
      tenancyId: tenancy._id.toString(),
      tenantId: session.user.id,
    },
    {
      $set: {
        propertyId: item.propertyId,
        status: parsed.data.status,
        note: parsed.data.note,
        confirmedAt: new Date(),
      },
    },
    { new: true, runValidators: true, upsert: true },
  );

  return NextResponse.json({
    acknowledgement: {
      id: acknowledgement._id.toString(),
      tenantId: acknowledgement.tenantId,
      status: acknowledgement.status,
      note: acknowledgement.note ?? "",
      confirmedAt: acknowledgement.confirmedAt.toISOString(),
    },
  });
}
