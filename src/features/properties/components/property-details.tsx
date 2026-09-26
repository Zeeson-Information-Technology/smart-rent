"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Building2,
  MapPin,
  Pencil,
  Scale,
  User,
} from "lucide-react";
import Link from "next/link";

import {
  DataTable,
  EmptyState,
  PageHeader,
  PriorityBadge,
  StatCard,
  StatusBadge,
} from "@/components/dashboard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import type { PropertyRecord } from "@/features/properties/types";

import { DeletePropertyButton } from "./delete-property-button";
import { InventoryManager } from "./inventory-manager";
import { PropertyStatusBadge } from "./property-status-badge";
import { PropertyTypeBadge } from "./property-type-badge";

type PropertyDetailsProps = {
  id: string;
};

const placeholderIssues = [
  {
    title: "Related issues will appear here",
    priority: "Medium" as const,
    status: "Pending" as const,
    reported: "Not connected yet",
  },
];

const placeholderDisputes = [
  {
    caseName: "Related disputes will appear here",
    status: "Draft" as const,
    owner: "Not connected yet",
  },
];

export function PropertyDetails({ id }: PropertyDetailsProps) {
  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProperty() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/properties/${id}`, {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load property.");
        setIsLoading(false);
        return;
      }

      setProperty(result.property);
      setIsLoading(false);
    }

    void loadProperty();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          Loading property...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <EmptyState
        action={
          <Link href="/properties">
            <Button variant="outline">Back to properties</Button>
          </Link>
        }
        description={error ?? "The requested property could not be found."}
        icon={Building2}
        title="Property unavailable"
      />
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={`/properties/${property.id}/edit`}>
              <Button variant="outline">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit
              </Button>
            </Link>
            <DeletePropertyButton
              id={property.id}
              label="Delete property"
              redirectTo="/properties"
            />
          </div>
        }
        description="Property profile with future tenancy, issue, and dispute context."
        eyebrow="Property details"
        title={property.propertyName}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Property type"
          value={property.propertyType}
        />
        <StatCard
          icon={Building2}
          label="Bedrooms"
          value={property.bedroomCount.toString()}
        />
        <StatCard icon={User} label="Assigned tenant" value="Not connected" />
        <StatCard icon={AlertCircle} label="Open issues" value="0" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Property information
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <InfoRow label="Name" value={property.propertyName} />
            <InfoRow label="Address" value={formatAddress(property)} />
            <InfoRow
              label="Type"
              value={<PropertyTypeBadge propertyType={property.propertyType} />}
            />
            <InfoRow
              label="Status"
              value={<PropertyStatusBadge status={property.status} />}
            />
            <InfoRow label="Created" value={formatDate(property.createdAt)} />
            <div className="flex gap-2 rounded-xl border bg-slate-50 p-4 text-slate-600">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
                aria-hidden="true"
              />
              {property.description ||
                "No property description has been added yet."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">
              Related tenancies
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <InfoRow label="Current tenant" value="Not connected yet" />
            <InfoRow label="Tenancy status" value="Tenancy module pending" />
            <InfoRow label="Monthly rent" value="Not connected yet" />
            <InfoRow
              label="Last updated"
              value={formatDate(property.updatedAt)}
            />
          </CardContent>
        </Card>
      </div>
      <InventoryManager propertyId={property.id} />
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-950">
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
            { header: "Reported", render: (row) => row.reported },
            {
              header: "Priority",
              render: (row) => <PriorityBadge priority={row.priority} />,
            },
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
                <span className="font-medium text-slate-950">
                  {row.caseName}
                </span>
              ),
            },
            { header: "Owner", render: (row) => row.owner },
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

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border bg-white p-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}

function formatAddress(property: PropertyRecord) {
  return `${property.address}, ${property.city}, ${property.postcode}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
