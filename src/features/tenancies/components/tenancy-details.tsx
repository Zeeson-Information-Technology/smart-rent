"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  CalendarDays,
  Home,
  Mail,
  Pencil,
  Scale,
  User,
} from "lucide-react";
import Link from "next/link";

import {
  DataTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import type { UserRole } from "@/types/database";
import type { TenancyRecord } from "@/features/tenancies/types";

import { DeleteTenancyButton } from "./delete-tenancy-button";
import { RentAmountDisplay } from "./rent-amount-display";
import { RentTracker } from "./rent-tracker";
import { InventoryManager } from "@/features/properties/components";
import { TenancyStatusBadge } from "./tenancy-status-badge";

type TenancyDetailsProps = {
  id: string;
  role: UserRole;
};

const placeholderIssues = [
  {
    title: "Related issues will appear here",
    date: "Not connected yet",
    status: "Pending" as const,
  },
];

const placeholderDisputes = [
  {
    title: "Related disputes will appear here",
    date: "Not connected yet",
    status: "Draft" as const,
  },
];

export function TenancyDetails({ id, role }: TenancyDetailsProps) {
  const [tenancy, setTenancy] = useState<TenancyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canManage = role === "landlord" || role === "admin";

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
          <Link href={role === "tenant" ? "/my-tenancy" : "/tenancies"}>
            <Button variant="outline">Back to tenancies</Button>
          </Link>
        }
        description={error ?? "The requested tenancy could not be found."}
        icon={User}
        title="Tenancy unavailable"
      />
    );
  }

  return (
    <>
      <PageHeader
        actions={
          canManage ? (
            <div className="flex flex-wrap gap-2">
              <Link href={`/tenancies/${tenancy.id}/edit`}>
                <Button variant="outline">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Button>
              </Link>
              <DeleteTenancyButton
                id={tenancy.id}
                label="Delete tenancy"
                redirectTo="/tenancies"
              />
            </div>
          ) : null
        }
        description="Tenancy record with tenant, property, and lease context."
        eyebrow="Tenancy details"
        title={`${tenancy.tenantName} tenancy`}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard icon={User} label="Tenant" value={tenancy.tenantName} />
        <StatCard
          icon={Home}
          label="Property"
          value={tenancy.property?.propertyName ?? "Unavailable"}
        />
        <StatCard
          icon={CalendarDays}
          label="Ends"
          value={tenancy.endDate ? formatDate(tenancy.endDate) : "Open-ended"}
        />
        <StatCard icon={Mail} label="Status" value={tenancy.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Tenant details
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <Detail label="Name" value={tenancy.tenantName} />
            <Detail label="Email" value={tenancy.tenantEmail} />
            <Detail
              label="Contact number"
              value={tenancy.tenantPhone || "Not provided"}
            />
            <Detail
              label="Linked account"
              value={tenancy.tenantId ? "Linked" : "Pending registration"}
            />
            <Detail
              label="Status"
              value={<TenancyStatusBadge status={tenancy.status} />}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Property details
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <Detail
              label="Property"
              value={tenancy.property?.propertyName ?? "Unavailable"}
            />
            <Detail
              label="Address"
              value={tenancy.property ? formatAddress(tenancy) : "Unavailable"}
            />
            <Detail
              label="Type"
              value={tenancy.property?.propertyType ?? "Unavailable"}
            />
            <Detail
              label="Property status"
              value={tenancy.property?.status ?? "Unavailable"}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Lease details
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <Detail label="Start date" value={formatDate(tenancy.startDate)} />
            <Detail
              label="End date"
              value={
                tenancy.endDate ? formatDate(tenancy.endDate) : "Open-ended"
              }
            />
            <Detail
              label="Rent amount"
              value={<RentAmountDisplay amount={tenancy.rentAmount} />}
            />
            <Detail
              label="Refundable deposit"
              value={formatCurrency(tenancy.depositAmount)}
            />
            <Detail label="Created" value={formatDate(tenancy.createdAt)} />
          </CardContent>
        </Card>
      </div>
      {tenancy.additionalTenants.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Additional tenants
            </h2>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {tenancy.additionalTenants.map((tenant) => (
              <div className="rounded-xl border p-4" key={tenant.email}>
                <p className="font-semibold text-slate-950">{tenant.name}</p>
                <p className="mt-1 text-sm text-slate-600">{tenant.email}</p>
                <p className="text-sm text-slate-600">{tenant.phone}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <RentTracker
        monthlyRent={tenancy.rentAmount}
        role={role}
        tenancyId={tenancy.id}
      />
      {role === "tenant" && tenancy.property ? (
        <InventoryManager canManage={false} propertyId={tenancy.propertyId} />
      ) : null}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-950">
          <AlertCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Related issues
        </h2>
        <DataTable
          columns={[
            {
              header: "Issue",
              render: (row) => (
                <span className="font-medium text-slate-950">{row.title}</span>
              ),
            },
            { header: "Date", render: (row) => row.date },
            {
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
          ]}
          rows={placeholderIssues}
        />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-950">
          <Scale className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Related disputes
        </h2>
        <DataTable
          columns={[
            {
              header: "Dispute",
              render: (row) => (
                <span className="font-medium text-slate-950">{row.title}</span>
              ),
            },
            { header: "Date", render: (row) => row.date },
            {
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
          ]}
          rows={placeholderDisputes}
        />
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border bg-white p-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}

function formatAddress(tenancy: TenancyRecord) {
  if (!tenancy.property) {
    return "Unavailable";
  }

  return `${tenancy.property.address}, ${tenancy.property.city}, ${tenancy.property.postcode}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}
