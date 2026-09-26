"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Eye, Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";

import {
  DataTable,
  EmptyState,
  LoadingState,
  StatCard,
} from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { UserRole } from "@/types/database";
import type { TenancyRecord } from "@/features/tenancies/types";

import { DeleteTenancyButton } from "./delete-tenancy-button";
import { RentAmountDisplay } from "./rent-amount-display";
import { TenancyStatusBadge } from "./tenancy-status-badge";

type TenanciesListProps = {
  role: UserRole;
};

export function TenanciesList({ role }: TenanciesListProps) {
  const [tenancies, setTenancies] = useState<TenancyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canManage = role === "landlord" || role === "admin";

  useEffect(() => {
    let mounted = true;

    async function loadTenancies() {
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
        setError(result?.error ?? "Unable to load tenancies.");
        setIsLoading(false);
        return;
      }

      setTenancies(result?.tenancies ?? []);
      setIsLoading(false);
    }

    void loadTenancies();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState title="Loading tenancies" />;
  }

  if (error) {
    return (
      <EmptyState
        description={error}
        icon={Users}
        title="Unable to load tenancies"
      />
    );
  }

  if (tenancies.length === 0) {
    return (
      <EmptyState
        action={
          canManage ? (
            <Link href="/tenancies/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Tenancy
              </Button>
            </Link>
          ) : null
        }
        description="No tenancy records are currently linked to this account."
        icon={Users}
        title="No tenancies yet"
      />
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total tenancies"
          value={tenancies.length.toString()}
        />
        <StatCard
          icon={Users}
          label="Active tenancies"
          value={tenancies
            .filter((tenancy) => tenancy.status === "active")
            .length.toString()}
        />
        <StatCard
          icon={CalendarDays}
          label="Pending setup"
          value={tenancies
            .filter((tenancy) => tenancy.status === "pending")
            .length.toString()}
        />
      </div>
      <DataTable
        columns={[
          {
            header: "Tenant",
            render: (row) => (
              <Link
                className="font-medium text-blue-700 hover:text-blue-800"
                href={`/tenancies/${row.id}`}
              >
                {row.tenantName}
              </Link>
            ),
          },
          { header: "Email", render: (row) => row.tenantEmail },
          {
            header: "Property",
            render: (row) =>
              row.property?.propertyName ?? "Property unavailable",
          },
          { header: "Start Date", render: (row) => formatDate(row.startDate) },
          {
            header: "End Date",
            render: (row) =>
              row.endDate ? formatDate(row.endDate) : "Open-ended",
          },
          {
            header: "Rent Amount",
            render: (row) => <RentAmountDisplay amount={row.rentAmount} />,
          },
          {
            header: "Status",
            render: (row) => <TenancyStatusBadge status={row.status} />,
          },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/tenancies/${row.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Button>
                </Link>
                {canManage ? (
                  <>
                    <Link href={`/tenancies/${row.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteTenancyButton id={row.id} />
                  </>
                ) : null}
              </div>
            ),
          },
        ]}
        rows={tenancies}
      />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
