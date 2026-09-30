"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ImageIcon,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { INVENTORY_CONDITIONS } from "@/constants";

type Item = {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  notes: string;
  imageUrl: string | null;
  acknowledgements: Array<{
    id: string;
    tenantId: string;
    tenantName: string;
    status: "confirmed" | "disputed";
    note: string;
    confirmedAt: string;
  }>;
};

export function InventoryManager({
  canManage = true,
  propertyId,
}: {
  canManage?: boolean;
  propertyId: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tenancyId, setTenancyId] = useState<string | null>(null);
  const [acknowledgementNotes, setAcknowledgementNotes] = useState<
    Record<string, string>
  >({});
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const load = useCallback(async () => {
    const response = await fetch(`/api/properties/${propertyId}/inventory`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (response.ok) {
      setItems(result.items ?? []);
      setTenancyId(result.tenancyId ?? null);
    } else {
      setMessage(result?.error ?? "Unable to load inventory.");
    }
  }, [propertyId]);
  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = event.currentTarget;
    const response = await fetch(`/api/properties/${propertyId}/inventory`, {
      method: "POST",
      body: new FormData(form),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok)
      setMessage(result?.error ?? "Unable to add inventory item.");
    else {
      form.reset();
      setSelectedFileName("");
      await load();
    }
    setBusy(false);
  }

  async function remove() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const response = await fetch(`/api/inventory/${deleteTarget.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setDeleteTarget(null);
      await load();
    } else {
      setMessage("Unable to delete inventory item.");
    }
    setIsDeleting(false);
  }

  async function acknowledge(itemId: string, status: "confirmed" | "disputed") {
    if (!tenancyId) return;
    setAcknowledgingId(itemId);
    setMessage(null);
    const response = await fetch(`/api/inventory/${itemId}/acknowledgement`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenancyId,
        status,
        note: acknowledgementNotes[itemId] ?? "",
      }),
    });
    const result = await response.json().catch(() => null);
    if (response.ok) {
      await load();
    } else {
      setMessage(result?.error ?? "Unable to save your inventory response.");
    }
    setAcknowledgingId(null);
  }

  return (
    <>
      <Card className="mt-6 min-w-0 overflow-hidden">
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Package className="h-5 w-5 text-blue-600" />
            Property inventory
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Record furniture, appliances, condition, and check-in images.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5">
          {message ? (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}
          {canManage ? (
            <form
              className="grid min-w-0 gap-3 rounded-xl border bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.4fr)]"
              onSubmit={submit}
            >
              <Input
                label="Item"
                name="name"
                placeholder="Washing machine"
                required
              />
              <Input
                label="Category"
                name="category"
                placeholder="Appliance"
                required
              />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Condition
                <select
                  className="h-11 rounded-lg border bg-white px-3 capitalize"
                  name="condition"
                >
                  {INVENTORY_CONDITIONS.map((condition) => (
                    <option key={condition}>{condition}</option>
                  ))}
                </select>
              </label>
              <Input
                defaultValue="1"
                label="Quantity"
                min="1"
                name="quantity"
                required
                type="number"
              />
              <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700">
                Image (optional)
                <span className="flex h-11 min-w-0 items-center gap-2 overflow-hidden rounded-lg border bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-100">
                  <Upload
                    className="h-4 w-4 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <span className="shrink-0 font-medium text-blue-700">
                    Choose image
                  </span>
                  <span className="min-w-0 flex-1 truncate text-slate-500">
                    {selectedFileName || "No file selected"}
                  </span>
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    name="image"
                    onChange={(event) =>
                      setSelectedFileName(event.target.files?.[0]?.name ?? "")
                    }
                    type="file"
                  />
                </span>
              </label>
              <Input
                className="md:col-span-2 lg:col-span-4"
                label="Notes"
                name="notes"
                placeholder="Condition notes or serial number"
              />
              <Button className="self-end" disabled={busy} type="submit">
                <Plus className="h-4 w-4" />
                {busy ? "Adding..." : "Add item"}
              </Button>
            </form>
          ) : null}
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              No inventory items recorded yet.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  className="overflow-hidden rounded-xl border bg-white"
                  key={item.id}
                >
                  {item.imageUrl ? (
                    <Image
                      alt={item.name}
                      className="h-40 w-full object-cover"
                      height={320}
                      src={item.imageUrl}
                      unoptimized
                      width={640}
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {item.name}{" "}
                        <span className="text-slate-500">x{item.quantity}</span>
                      </h3>
                      <p className="text-sm capitalize text-slate-600">
                        {item.category} - {item.condition}
                      </p>
                      {item.notes ? (
                        <p className="mt-2 text-sm text-slate-500">
                          {item.notes}
                        </p>
                      ) : null}
                    </div>
                    {canManage ? (
                      <Button
                        aria-label={`Delete ${item.name}`}
                        className="h-9 w-9 px-0"
                        onClick={() => setDeleteTarget(item)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                  {item.acknowledgements.length > 0 ? (
                    <div className="border-t bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Tenant responses
                      </p>
                      <div className="mt-2 grid gap-1">
                        {item.acknowledgements.map((entry) => (
                          <p className="text-sm text-slate-700" key={entry.id}>
                            <span className="font-medium">
                              {entry.tenantName}
                            </span>
                            :{" "}
                            {entry.status === "confirmed"
                              ? "Condition confirmed"
                              : "Condition differs"}
                            {entry.note ? ` - ${entry.note}` : ""}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {!canManage && tenancyId ? (
                    <div className="grid gap-3 border-t p-4">
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        Condition note (optional)
                        <input
                          className="h-10 min-w-0 rounded-lg border px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                          onChange={(event) =>
                            setAcknowledgementNotes((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          placeholder="Note any difference from the recorded condition"
                          value={acknowledgementNotes[item.id] ?? ""}
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={acknowledgingId === item.id}
                          onClick={() => void acknowledge(item.id, "confirmed")}
                          size="sm"
                        >
                          Confirm condition
                        </Button>
                        <Button
                          disabled={acknowledgingId === item.id}
                          onClick={() => void acknowledge(item.id, "disputed")}
                          size="sm"
                          variant="outline"
                        >
                          Condition differs
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {canManage ? (
        <InventoryDeleteDialog
          busy={isDeleting}
          item={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void remove()}
        />
      ) : null}
    </>
  );
}

function InventoryDeleteDialog({
  busy,
  item,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  item: Item | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!item) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [busy, item, onCancel]);

  if (!item) return null;

  return (
    <div
      aria-labelledby="delete-inventory-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={() => !busy && onCancel()}
      role="dialog"
    >
      <div
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <Button
            aria-label="Close confirmation"
            className="h-8 w-8 px-0"
            disabled={busy}
            onClick={onCancel}
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <h3
          className="mt-4 text-lg font-semibold text-slate-950"
          id="delete-inventory-title"
        >
          Delete inventory item?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {item.name} and its uploaded image will be permanently removed.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button disabled={busy} onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            autoFocus
            className="bg-red-600 text-white shadow-none hover:bg-red-700 focus-visible:outline-red-600"
            disabled={busy}
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {busy ? "Deleting..." : "Delete item"}
          </Button>
        </div>
      </div>
    </div>
  );
}
