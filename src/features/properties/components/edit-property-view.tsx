"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui";
import type { PropertyRecord } from "@/features/properties/types";

import { PropertyForm } from "./property-form";

type EditPropertyViewProps = {
  id: string;
};

export function EditPropertyView({ id }: EditPropertyViewProps) {
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

  return <PropertyForm mode="edit" property={property} />;
}
