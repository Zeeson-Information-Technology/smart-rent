import { NextResponse } from "next/server";
import { z } from "zod";

import { ContactMessageModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be 120 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2_000, "Message must be 2,000 characters or fewer"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedBody = contactMessageSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Please check the contact form.",
        fieldErrors: parsedBody.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await connectMongoDB();

    const contactMessage = await ContactMessageModel.create({
      ...parsedBody.data,
      status: "new",
    });

    return NextResponse.json(
      {
        message: {
          id: contactMessage._id.toString(),
          status: contactMessage.status,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 503 },
    );
  }
}
