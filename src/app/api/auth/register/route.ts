import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UserModel } from "@/database/models";
import { registerSchema } from "@/lib/auth/schemas";
import { connectMongoDB } from "@/lib/mongodb";

const PASSWORD_SALT_ROUNDS = 12;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());

    await connectMongoDB();

    const existingUser = await UserModel.exists({ email: payload.email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(
      payload.password,
      PASSWORD_SALT_ROUNDS,
    );
    const name = `${payload.firstName} ${payload.lastName}`;

    const user = await UserModel.create({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      name,
      passwordHash,
      role: payload.role,
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid registration input.",
          issues: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        {
          error:
            "Unable to connect to the database. Check MongoDB Atlas network access and MONGODB_URI.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Unable to register account." },
      { status: 500 },
    );
  }
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function isMongoConnectionError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "MongoServerSelectionError" ||
      error.name === "MongooseServerSelectionError" ||
      error.name === "MongoParseError" ||
      error.message.includes("Invalid MONGODB_URI") ||
      error.message.includes("Invalid scheme") ||
      error.message.includes("querySrv") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ETIMEOUT") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("bad auth"))
  );
}
