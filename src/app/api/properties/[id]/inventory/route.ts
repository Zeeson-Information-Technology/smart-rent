import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { INVENTORY_CONDITIONS } from "@/constants";
import {
  InventoryAcknowledgementModel,
  InventoryItemModel,
  UserModel,
} from "@/database/models";
import { getCloudinaryClient } from "@/lib/cloudinary";
import { connectMongoDB } from "@/lib/mongodb";
import { findAccessibleProperty } from "@/app/api/properties/utils";
import { findTenantTenancyForProperty } from "@/lib/tenancy-access";

export const runtime = "nodejs";

const inventorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  condition: z.enum(INVENTORY_CONDITIONS),
  quantity: z.coerce.number().int().min(1).max(1000),
  notes: z.string().trim().max(1000).optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );

  const { id } = await params;
  const property =
    session.user.role === "tenant"
      ? null
      : await findAccessibleProperty(id, session.user);
  const tenancy =
    session.user.role === "tenant"
      ? await findTenantTenancyForProperty(id, session.user)
      : null;

  if (!property && !tenancy)
    return NextResponse.json({ error: "Property not found." }, { status: 404 });

  const items = await InventoryItemModel.find({ propertyId: id }).sort({
    createdAt: -1,
  });
  const acknowledgements = await InventoryAcknowledgementModel.find({
    inventoryItemId: { $in: items.map((item) => item._id.toString()) },
    ...(tenancy ? { tenancyId: tenancy._id.toString() } : {}),
  });
  const users = await UserModel.find({
    _id: { $in: acknowledgements.map((item) => item.tenantId) },
  }).select("name");
  const names = new Map(users.map((user) => [user._id.toString(), user.name]));

  return NextResponse.json({
    tenancyId: tenancy?._id.toString() ?? null,
    items: items.map((item) => ({
      ...serializeItem(item),
      acknowledgements: acknowledgements
        .filter((entry) => entry.inventoryItemId === item._id.toString())
        .map((entry) => ({
          id: entry._id.toString(),
          tenantId: entry.tenantId,
          tenantName: names.get(entry.tenantId) ?? "Tenant",
          status: entry.status,
          note: entry.note ?? "",
          confirmedAt: entry.confirmedAt.toISOString(),
        })),
    })),
  });
}

export async function POST(request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  if (session.user.role === "tenant")
    return NextResponse.json(
      { error: "Only landlords and admins can manage inventory." },
      { status: 403 },
    );

  const { id } = await params;
  const property = await findAccessibleProperty(id, session.user);
  if (!property)
    return NextResponse.json({ error: "Property not found." }, { status: 404 });

  const formData = await request.formData();
  const parsed = inventorySchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Check the inventory details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );

  const file = formData.get("image");
  let imageUrl: string | undefined;
  let cloudinaryPublicId: string | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json(
        { error: "Image must be 10 MB or less." },
        { status: 400 },
      );
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = detectImage(buffer);
    if (!mimeType)
      return NextResponse.json(
        { error: "Upload a JPG, PNG, or WEBP image." },
        { status: 400 },
      );
    const upload = await getCloudinaryClient().uploader.upload(
      `data:${mimeType};base64,${buffer.toString("base64")}`,
      {
        folder: "smartrent/properties/inventory",
        resource_type: "image",
      },
    );
    imageUrl = upload.secure_url;
    cloudinaryPublicId = upload.public_id;
  }

  await connectMongoDB();
  const item = await InventoryItemModel.create({
    propertyId: id,
    landlordId: property.landlordId,
    ...parsed.data,
    imageUrl,
    cloudinaryPublicId,
  });
  return NextResponse.json({ item: serializeItem(item) }, { status: 201 });
}

function serializeItem(item: InstanceType<typeof InventoryItemModel>) {
  return {
    id: String(item._id),
    propertyId: item.propertyId,
    name: item.name,
    category: item.category,
    condition: item.condition,
    quantity: item.quantity,
    notes: item.notes ?? "",
    imageUrl: item.imageUrl ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function detectImage(buffer: Buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return "image/jpeg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return "image/png";
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  return null;
}
