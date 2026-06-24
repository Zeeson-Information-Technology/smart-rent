"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";

type DeleteTenancyButtonProps = {
  id: string;
  label?: string;
  redirectTo?: string;
};

export function DeleteTenancyButton({
  id,
  label = "Delete",
  redirectTo,
}: DeleteTenancyButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this tenancy? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const response = await fetch(`/api/tenancies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Unable to delete tenancy.");
      setIsDeleting(false);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <Button
        className="text-red-700 hover:bg-red-50"
        disabled={isDeleting}
        onClick={handleDelete}
        size="sm"
        type="button"
        variant="outline"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {isDeleting ? "Deleting..." : label}
      </Button>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
