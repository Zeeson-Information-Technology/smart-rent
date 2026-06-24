import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import {
  invalidNotificationResponse,
  isValidObjectId,
  notFoundResponse,
  serializeNotification,
  unauthenticatedResponse,
} from "../../utils";

type NotificationReadRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  _request: Request,
  context: NotificationReadRouteContext,
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

  const notification = await NotificationModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: { isRead: true } },
    { new: true },
  );

  if (!notification) {
    return notFoundResponse();
  }

  return NextResponse.json({ notification: serializeNotification(notification) });
}
