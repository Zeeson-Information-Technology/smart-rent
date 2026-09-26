"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Banknote, Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import type { UserRole } from "@/types/database";

type Payment = {
  id: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  outstandingBalance: number;
  status: string;
};
const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function RentTracker({
  tenancyId,
  role,
  monthlyRent,
}: {
  tenancyId: string;
  role: UserRole;
  monthlyRent: number;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`/api/tenancies/${tenancyId}/rent-payments`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (response.ok) {
      setPayments(result.payments ?? []);
    } else {
      setMessage(result?.error ?? "Unable to load rent records.");
    }
  }, [tenancyId]);
  useEffect(() => {
    void load();
  }, [load]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(`/api/tenancies/${tenancyId}/rent-payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok)
      setMessage(result?.error ?? "Unable to record rent payment.");
    else {
      form.reset();
      await load();
    }
    setBusy(false);
  }
  const outstanding = payments.reduce(
    (total, payment) => total + payment.outstandingBalance,
    0,
  );
  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <Banknote className="h-5 w-5 text-blue-600" />
          Rent tracking
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Outstanding balance:{" "}
          <strong className="text-slate-950">
            {money.format(outstanding)}
          </strong>
        </p>
      </CardHeader>
      <CardContent className="grid gap-5">
        {message ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {message}
          </p>
        ) : null}
        {role !== "tenant" ? (
          <form
            className="grid gap-3 rounded-xl border bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-5"
            onSubmit={submit}
          >
            <Input label="Due date" name="dueDate" required type="date" />
            <Input
              defaultValue={monthlyRent}
              label="Amount due"
              min="0.01"
              name="amountDue"
              required
              step="0.01"
              type="number"
            />
            <Input
              defaultValue="0"
              label="Amount paid"
              min="0"
              name="amountPaid"
              step="0.01"
              type="number"
            />
            <Input label="Payment date" name="paidAt" type="date" />
            <Input label="Notes" name="notes" placeholder="Bank transfer" />
            <Button disabled={busy} type="submit">
              <Plus className="h-4 w-4" />
              {busy ? "Saving..." : "Save rent record"}
            </Button>
          </form>
        ) : null}
        {payments.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
            No rent payments recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="p-3">Due date</th>
                  <th className="p-3">Due</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Outstanding</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr className="border-b last:border-0" key={payment.id}>
                    <td className="p-3">
                      {new Date(payment.dueDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-3">{money.format(payment.amountDue)}</td>
                    <td className="p-3">{money.format(payment.amountPaid)}</td>
                    <td className="p-3 font-medium">
                      {money.format(payment.outstandingBalance)}
                    </td>
                    <td className="p-3 capitalize">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
