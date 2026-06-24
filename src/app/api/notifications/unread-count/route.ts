import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { NotificationModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

import { unauthenticatedResponse } from "../utils";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return unauthenticatedResponse();
  }

  await connectMongoDB();

  const count = await NotificationModel.countDocuments({
    userId: session.user.id,
    isRead: false,
  });

  return NextResponse.json({ count });
}
