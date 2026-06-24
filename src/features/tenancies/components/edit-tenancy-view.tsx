"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { TenancyRecord } from "@/features/tenancies/types";

import { TenancyForm } from "./tenancy-form";

type EditTenancyViewProps = {
  id: string;
};

export function EditTenancyView({ id }: EditTenancyViewProps) {
  const [tenancy, setTenancy] = useState<TenancyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTenancy() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tenancies/${id}`, {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load tenancy.");
        setIsLoading(false);
        return;
      }

      setTenancy(result.tenancy);
      setIsLoading(false);
    }

    void loadTenancy();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-600">Loading tenancy...</p>
      </div>
    );
  }

  if (error || !tenancy) {
    return (
      <EmptyState
        action={
          <Link href="/tenancies">
            <Button variant="outline">Back to tenancies</Button>
          </Link>
        }
        description={error ?? "The requested tenancy could not be found."}
        icon={User}
        title="Tenancy unavailable"
      />
    );
  }

  return <TenancyForm mode="edit" tenancy={tenancy} />;
}
