"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/constants";
import type { PropertyFormValues, PropertyRecord } from "@/features/properties/types";
import type { PropertyStatus, PropertyType } from "@/types/database";

type FieldErrors = Partial<Record<keyof PropertyFormValues, string[]>>;

type PropertyFormProps = {
  mode: "create" | "edit";
  property?: PropertyRecord;
};

const defaultValues: PropertyFormValues = {
  propertyName: "",
  address: "",
  city: "",
  postcode: "",
  propertyType: "Apartment",
  status: "active",
  description: "",
};

export function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(
    property
      ? {
          landlordId: property.landlordId,
          propertyName: property.propertyName,
          address: property.address,
          city: property.city,
          postcode: property.postcode,
          propertyType: property.propertyType,
          status: property.status,
          description: property.description,
        }
      : defaultValues,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage(null);

    const endpoint = mode === "create" ? "/api/properties" : `/api/properties/${property?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setFieldErrors(result?.fieldErrors ?? {});
      setMessage(result?.error ?? "Unable to save property.");
      setIsSubmitting(false);
      return;
    }

    const nextId = result?.property?.id as string | undefined;
    router.push(mode === "create" ? "/properties" : `/properties/${nextId ?? property?.id}`);
    router.refresh();
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">
          Property information
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Add the core portfolio details used across SmartRent records.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {message ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </div>
          ) : null}

          <FieldError errors={fieldErrors.propertyName}>
            <Input
              label="Property name"
              name="propertyName"
              onChange={(event) => updateValue("propertyName", event.target.value)}
              placeholder="Canary Wharf Apartment 8B"
              type="text"
              value={values.propertyName}
            />
          </FieldError>

          <FieldError errors={fieldErrors.address}>
            <Input
              label="Address"
              name="address"
              onChange={(event) => updateValue("address", event.target.value)}
              placeholder="123 Canary Wharf"
              type="text"
              value={values.address}
            />
          </FieldError>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldError errors={fieldErrors.city}>
              <Input
                label="City"
                name="city"
                onChange={(event) => updateValue("city", event.target.value)}
                placeholder="London"
                type="text"
                value={values.city}
              />
            </FieldError>
            <FieldError errors={fieldErrors.postcode}>
              <Input
                label="Postcode"
                name="postcode"
                onChange={(event) => updateValue("postcode", event.target.value)}
                placeholder="E14 5AB"
                type="text"
                value={values.postcode}
              />
            </FieldError>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldError errors={fieldErrors.propertyType}>
              <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="propertyType">
                Property type
                <select
                  className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                  id="propertyType"
                  name="propertyType"
                  onChange={(event) =>
                    updateValue("propertyType", event.target.value as PropertyType)
                  }
                  value={values.propertyType}
                >
                  {PROPERTY_TYPES.map((propertyType) => (
                    <option key={propertyType} value={propertyType}>
                      {propertyType}
                    </option>
                  ))}
                </select>
              </label>
            </FieldError>
            <FieldError errors={fieldErrors.status}>
              <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="status">
                Status
                <select
                  className="h-11 rounded-lg border bg-white px-3 text-sm capitalize shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                  id="status"
                  name="status"
                  onChange={(event) =>
                    updateValue("status", event.target.value as PropertyStatus)
                  }
                  value={values.status}
                >
                  {PROPERTY_STATUSES.map((status) => (
                    <option className="capitalize" key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </FieldError>
          </div>

          <FieldError errors={fieldErrors.description}>
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="description">
              Description
              <textarea
                className="min-h-32 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
                id="description"
                name="description"
                onChange={(event) => updateValue("description", event.target.value)}
                placeholder="Add layout notes, management details, or inspection context."
                value={values.description}
              />
            </label>
          </FieldError>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create property"
                  : "Save changes"}
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  function updateValue<Key extends keyof PropertyFormValues>(
    key: Key,
    value: PropertyFormValues[Key],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }
}

function FieldError({
  children,
  errors,
}: {
  children: ReactNode;
  errors?: string[];
}) {
  return (
    <div className="grid gap-2">
      {children}
      {errors?.[0] ? (
        <p className="text-sm font-medium text-red-600">{errors[0]}</p>
      ) : null}
    </div>
  );
}
