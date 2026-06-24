import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  invalidNotificationResponse,
  isValidObjectId,
  notFoundResponse,
  unauthenticatedResponse,
} from "../utils";

type NotificationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: Request,
  context: NotificationRouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return invalidNotificationResponse();
  }

  await connectMongoDB();

  const notification = await NotificationModel.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  });

  if (!notification) {
    return notFoundResponse();
  }

  return NextResponse.json({ success: true });
}
