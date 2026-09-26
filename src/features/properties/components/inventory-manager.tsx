"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ImageIcon, Package, Plus, Trash2 } from "lucide-react";
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
};

export function InventoryManager({ propertyId }: { propertyId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`/api/properties/${propertyId}/inventory`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (response.ok) {
      setItems(result.items ?? []);
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
      await load();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this inventory item and its image?")) return;
    const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    if (response.ok) {
      await load();
    } else {
      setMessage("Unable to delete inventory item.");
    }
  }

  return (
    <Card className="mt-6">
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
        <form
          className="grid gap-3 rounded-xl border bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-5"
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
          <Input
            accept="image/jpeg,image/png,image/webp"
            label="Image (optional)"
            name="image"
            type="file"
          />
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
                      {item.category} · {item.condition}
                    </p>
                    {item.notes ? (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.notes}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    aria-label={`Delete ${item.name}`}
                    className="h-9 w-9 px-0"
                    onClick={() => void remove(item.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
