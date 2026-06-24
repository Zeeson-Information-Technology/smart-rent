import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import { unauthenticatedResponse } from "../utils";

export async function PUT() {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  await connectMongoDB();

  await NotificationModel.updateMany(
    { userId: session.user.id, isRead: false },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ success: true });
}
