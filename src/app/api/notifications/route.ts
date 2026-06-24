import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import { serializeNotification, unauthenticatedResponse } from "./utils";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  await connectMongoDB();

  const notifications = await NotificationModel.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(Number.isFinite(limit) && limit > 0 ? limit : 50);

  return NextResponse.json({
    notifications: notifications.map(serializeNotification),
  });
}
