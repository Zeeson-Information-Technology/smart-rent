import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { RentPaymentModel } from "@/database/models";
import { connectMongoDB } from "@/lib/mongodb";
import { findAccessibleTenancy } from "@/app/api/tenancies/utils";

const paymentSchema = z.object({
  dueDate: z.string().min(1, "Due date is required"),
  amountDue: z.coerce.number().positive("Amount due must be greater than zero"),
  amountPaid: z.coerce.number().min(0).default(0),
  paidAt: z.string().optional(),
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
  const tenancy = await findAccessibleTenancy(id, session.user);
  if (!tenancy)
    return NextResponse.json({ error: "Tenancy not found." }, { status: 404 });
  await connectMongoDB();
  const payments = await RentPaymentModel.find({ tenancyId: id }).sort({
    dueDate: -1,
  });
  return NextResponse.json({ payments: payments.map(serializePayment) });
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
      { error: "Only landlords and admins can record rent payments." },
      { status: 403 },
    );
  const { id } = await params;
  const tenancy = await findAccessibleTenancy(id, session.user);
  if (!tenancy)
    return NextResponse.json({ error: "Tenancy not found." }, { status: 404 });
  const parsed = paymentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Check the payment details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const amountPaid = Math.min(parsed.data.amountPaid, parsed.data.amountDue);
  const dueDate = new Date(parsed.data.dueDate);
  const status = getStatus(parsed.data.amountDue, amountPaid, dueDate);
  const payment = await RentPaymentModel.findOneAndUpdate(
    { tenancyId: id, dueDate },
    {
      $set: {
        landlordId: tenancy.landlordId,
        amountDue: parsed.data.amountDue,
        amountPaid,
        status,
        paidAt: parsed.data.paidAt
          ? new Date(parsed.data.paidAt)
          : status === "paid"
            ? new Date()
            : undefined,
        notes: parsed.data.notes,
      },
      $setOnInsert: { tenancyId: id, dueDate },
    },
    { new: true, runValidators: true, upsert: true },
  );
  return NextResponse.json(
    { payment: serializePayment(payment) },
    { status: 200 },
  );
}

function getStatus(amountDue: number, amountPaid: number, dueDate: Date) {
  if (amountPaid >= amountDue) return "paid" as const;
  if (amountPaid > 0) return "partial" as const;
  if (dueDate.getTime() < Date.now()) return "overdue" as const;
  return "pending" as const;
}

function serializePayment(payment: InstanceType<typeof RentPaymentModel>) {
  const currentStatus = getStatus(
    payment.amountDue,
    payment.amountPaid,
    payment.dueDate,
  );

  return {
    id: String(payment._id),
    tenancyId: payment.tenancyId,
    dueDate: payment.dueDate.toISOString(),
    amountDue: payment.amountDue,
    amountPaid: payment.amountPaid,
    outstandingBalance: Math.max(0, payment.amountDue - payment.amountPaid),
    status: currentStatus,
    paidAt: payment.paidAt?.toISOString() ?? null,
    notes: payment.notes ?? "",
    createdAt: payment.createdAt.toISOString(),
  };
}
