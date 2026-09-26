"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { TenancyRecord } from "@/features/tenancies/types";

import { TenancyDetails } from "./tenancy-details";

export function MyTenancyView() {
  const [tenancy, setTenancy] = useState<TenancyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTenancy() {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/tenancies", {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load your tenancy.");
        setIsLoading(false);
        return;
      }

      setTenancy(result?.tenancies?.[0] ?? null);
      setIsLoading(false);
    }

    void loadTenancy();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          Loading your tenancy...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        description={error}
        icon={Home}
        title="Unable to load tenancy"
      />
    );
  }

  if (!tenancy) {
    return (
      <EmptyState
        action={
          <Link href="/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        }
        description="No tenancy has been assigned to your account yet."
        icon={Home}
        title="No tenancy assigned"
      />
    );
  }

  return <TenancyDetails id={tenancy.id} role="tenant" />;
}
