"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { TENANCY_STATUSES } from "@/constants";
import type {
  TenancyFormValues,
  TenancyPropertySummary,
  TenancyRecord,
} from "@/features/tenancies/types";
import type { TenancyStatus } from "@/types/database";

type FieldErrors = Partial<Record<keyof TenancyFormValues, string[]>>;

type TenancyFormProps = {
  mode: "create" | "edit";
  tenancy?: TenancyRecord;
};

const defaultValues: TenancyFormValues = {
  propertyId: "",
  tenantName: "",
  tenantEmail: "",
  tenantPhone: "",
  additionalTenants: [],
  startDate: "",
  endDate: "",
  rentAmount: "",
  depositAmount: "",
  status: "pending",
};

export function TenancyForm({ mode, tenancy }: TenancyFormProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<TenancyPropertySummary[]>([]);
  const [values, setValues] = useState<TenancyFormValues>(
    tenancy
      ? {
          propertyId: tenancy.propertyId,
          tenantName: tenancy.tenantName,
          tenantEmail: tenancy.tenantEmail,
          tenantPhone: tenancy.tenantPhone,
          additionalTenants: tenancy.additionalTenants.map(
            ({ name, email, phone }) => ({ name, email, phone }),
          ),
          startDate: toDateInputValue(tenancy.startDate),
          endDate: tenancy.endDate ? toDateInputValue(tenancy.endDate) : "",
          rentAmount: String(tenancy.rentAmount),
          depositAmount: String(tenancy.depositAmount),
          status: tenancy.status,
        }
      : defaultValues,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProperties() {
      setIsLoadingProperties(true);
      const response = await fetch("/api/properties", { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setMessage(result?.error ?? "Unable to load properties.");
        setIsLoadingProperties(false);
        return;
      }

      const nextProperties = result?.properties ?? [];
      setProperties(nextProperties);
      setValues((currentValues) => ({
        ...currentValues,
        propertyId: currentValues.propertyId || nextProperties[0]?.id || "",
      }));
      setIsLoadingProperties(false);
    }

    void loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage(null);

    const endpoint =
      mode === "create" ? "/api/tenancies" : `/api/tenancies/${tenancy?.id}`;
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
      setMessage(result?.error ?? "Unable to save tenancy.");
      setIsSubmitting(false);
      return;
    }

    const nextId = result?.tenancy?.id as string | undefined;
    router.push(
      mode === "create" ? "/tenancies" : `/tenancies/${nextId ?? tenancy?.id}`,
    );
    router.refresh();
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">
          Tenancy details
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Link a tenant to one of your managed properties.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {message ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </div>
          ) : null}

          <FieldError errors={fieldErrors.propertyId}>
            <label
              className="grid gap-2 text-sm font-medium text-slate-700"
              htmlFor="propertyId"
            >
              Property
              <select
                className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                disabled={isLoadingProperties || properties.length === 0}
                id="propertyId"
                name="propertyId"
                onChange={(event) =>
                  updateValue("propertyId", event.target.value)
                }
                value={values.propertyId}
              >
                {properties.length === 0 ? (
                  <option value="">
                    {isLoadingProperties
                      ? "Loading properties..."
                      : "No properties available"}
                  </option>
                ) : null}
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.propertyName} - {property.city}
                  </option>
                ))}
              </select>
            </label>
          </FieldError>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldError errors={fieldErrors.tenantName}>
              <Input
                label="Tenant name"
                name="tenantName"
                onChange={(event) =>
                  updateValue("tenantName", event.target.value)
                }
                placeholder="Mia Thompson"
                type="text"
                value={values.tenantName}
              />
            </FieldError>
            <FieldError errors={fieldErrors.tenantEmail}>
              <Input
                label="Tenant email"
                name="tenantEmail"
                onChange={(event) =>
                  updateValue("tenantEmail", event.target.value)
                }
                placeholder="tenant@example.com"
                type="email"
                value={values.tenantEmail}
              />
            </FieldError>
          </div>

          <FieldError errors={fieldErrors.tenantPhone}>
            <Input
              label="Primary tenant contact number"
              name="tenantPhone"
              onChange={(event) =>
                updateValue("tenantPhone", event.target.value)
              }
              placeholder="+44 7700 900123"
              type="tel"
              value={values.tenantPhone}
            />
          </FieldError>

          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-950">
                  Additional tenants
                </h3>
                <p className="text-sm text-slate-600">
                  Add joint tenants and their contact information.
                </p>
              </div>
              <Button
                onClick={() =>
                  updateValue("additionalTenants", [
                    ...values.additionalTenants,
                    { name: "", email: "", phone: "" },
                  ])
                }
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Add tenant
              </Button>
            </div>
            {values.additionalTenants.map((tenant, index) => (
              <div
                className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
                key={index}
              >
                <Input
                  label="Name"
                  onChange={(event) =>
                    updateAdditionalTenant(index, "name", event.target.value)
                  }
                  value={tenant.name}
                />
                <Input
                  label="Email"
                  onChange={(event) =>
                    updateAdditionalTenant(index, "email", event.target.value)
                  }
                  type="email"
                  value={tenant.email}
                />
                <Input
                  label="Contact number"
                  onChange={(event) =>
                    updateAdditionalTenant(index, "phone", event.target.value)
                  }
                  type="tel"
                  value={tenant.phone}
                />
                <Button
                  aria-label="Remove tenant"
                  className="h-9 w-9 self-end px-0"
                  onClick={() =>
                    updateValue(
                      "additionalTenants",
                      values.additionalTenants.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    )
                  }
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldError errors={fieldErrors.startDate}>
              <Input
                label="Start date"
                name="startDate"
                onChange={(event) =>
                  updateValue("startDate", event.target.value)
                }
                type="date"
                value={values.startDate}
              />
            </FieldError>
            <FieldError errors={fieldErrors.endDate}>
              <Input
                label="End date"
                name="endDate"
                onChange={(event) => updateValue("endDate", event.target.value)}
                type="date"
                value={values.endDate}
              />
            </FieldError>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FieldError errors={fieldErrors.rentAmount}>
              <Input
                label="Rent amount"
                min="1"
                name="rentAmount"
                onChange={(event) =>
                  updateValue("rentAmount", event.target.value)
                }
                placeholder="2450"
                type="number"
                value={values.rentAmount}
              />
            </FieldError>
            <FieldError errors={fieldErrors.depositAmount}>
              <Input
                label="Refundable tenancy deposit"
                min="0"
                name="depositAmount"
                onChange={(event) =>
                  updateValue("depositAmount", event.target.value)
                }
                placeholder="1250"
                step="0.01"
                type="number"
                value={values.depositAmount}
              />
            </FieldError>
            <FieldError errors={fieldErrors.status}>
              <label
                className="grid gap-2 text-sm font-medium text-slate-700"
                htmlFor="status"
              >
                Status
                <select
                  className="h-11 rounded-lg border bg-white px-3 text-sm capitalize shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                  id="status"
                  name="status"
                  onChange={(event) =>
                    updateValue("status", event.target.value as TenancyStatus)
                  }
                  value={values.status}
                >
                  {TENANCY_STATUSES.map((status) => (
                    <option className="capitalize" key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </FieldError>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={
                isSubmitting || isLoadingProperties || properties.length === 0
              }
              type="submit"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create tenancy"
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

  function updateValue<Key extends keyof TenancyFormValues>(
    key: Key,
    value: TenancyFormValues[Key],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function updateAdditionalTenant(
    index: number,
    key: "name" | "email" | "phone",
    value: string,
  ) {
    updateValue(
      "additionalTenants",
      values.additionalTenants.map((tenant, itemIndex) =>
        itemIndex === index ? { ...tenant, [key]: value } : tenant,
      ),
    );
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

function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}
