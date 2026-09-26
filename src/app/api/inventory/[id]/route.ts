import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { auth } from "@/auth";
import { InventoryItemModel } from "@/database/models";
import { getCloudinaryClient } from "@/lib/cloudinary";
import { connectMongoDB } from "@/lib/mongodb";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Context) {
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
  if (!Types.ObjectId.isValid(id))
    return NextResponse.json(
      { error: "Inventory item not found." },
      { status: 404 },
    );
  await connectMongoDB();
  const query =
    session.user.role === "admin"
      ? { _id: id }
      : { _id: id, landlordId: session.user.id };
  const item = await InventoryItemModel.findOne(query);
  if (!item)
    return NextResponse.json(
      { error: "Inventory item not found." },
      { status: 404 },
    );
  if (item.cloudinaryPublicId)
    await getCloudinaryClient().uploader.destroy(item.cloudinaryPublicId, {
      resource_type: "image",
    });
  await item.deleteOne();
  return NextResponse.json({ success: true });
}
