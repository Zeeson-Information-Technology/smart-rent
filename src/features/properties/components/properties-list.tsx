"use client";

import { useEffect, useState } from "react";
import { Building2, Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { DataTable, EmptyState, LoadingState, StatCard } from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { PropertyRecord } from "@/features/properties/types";

import { DeletePropertyButton } from "./delete-property-button";
import { PropertyStatusBadge } from "./property-status-badge";
import { PropertyTypeBadge } from "./property-type-badge";

export function PropertiesList() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProperties() {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/properties", {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setError(result?.error ?? "Unable to load properties.");
        setIsLoading(false);
        return;
      }

      setProperties(result?.properties ?? []);
      setIsLoading(false);
    }

    void loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState title="Loading properties" />;
  }

  if (error) {
    return (
      <EmptyState
        description={error}
        icon={Building2}
        title="Unable to load properties"
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        action={
          <Link href="/properties/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Property
            </Button>
          </Link>
        }
        description="Create your first property record to start building the portfolio workspace."
        icon={Building2}
        title="No properties yet"
      />
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Building2} label="Managed properties" value={properties.length.toString()} />
        <StatCard
          icon={Building2}
          label="Active properties"
          value={properties.filter((property) => property.status === "active").length.toString()}
        />
        <StatCard
          icon={Building2}
          label="In maintenance"
          value={properties
            .filter((property) => property.status === "maintenance")
            .length.toString()}
        />
      </div>
      <DataTable
        columns={[
          {
            header: "Property Name",
            render: (row) => (
              <Link
                className="font-medium text-blue-700 hover:text-blue-800"
                href={`/properties/${row.id}`}
              >
                {row.propertyName}
              </Link>
            ),
          },
          { header: "Address", render: (row) => formatAddress(row) },
          { header: "Type", render: (row) => <PropertyTypeBadge propertyType={row.propertyType} /> },
          { header: "Status", render: (row) => <PropertyStatusBadge status={row.status} /> },
          { header: "Created Date", render: (row) => formatDate(row.createdAt) },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/properties/${row.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Button>
                </Link>
                <Link href={`/properties/${row.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Button>
                </Link>
                <DeletePropertyButton id={row.id} />
              </div>
            ),
          },
        ]}
        rows={properties}
      />
    </>
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
