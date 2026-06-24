"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { ISSUE_CATEGORIES } from "@/constants";
import { UploadProgress } from "@/features/evidence/components";
import { uploadEvidenceFile } from "@/features/evidence/upload-client";
import type { IssueFormValues } from "@/features/issues/types";
import type { TenancyRecord } from "@/features/tenancies/types";
import type { IssueCategory } from "@/types/database";

type FieldErrors = Partial<Record<keyof IssueFormValues, string[]>>;

const defaultValues: IssueFormValues = {
  propertyId: "",
  tenancyId: "",
  category: "General Maintenance",
  title: "",
  description: "",
};

export function IssueForm() {
  const router = useRouter();
  const [tenancies, setTenancies] = useState<TenancyRecord[]>([]);
  const [values, setValues] = useState<IssueFormValues>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isLoadingTenancies, setIsLoadingTenancies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTenancies() {
      setIsLoadingTenancies(true);
      const response = await fetch("/api/tenancies", { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok) {
        setMessage(result?.error ?? "Unable to load your tenancy.");
        setIsLoadingTenancies(false);
        return;
      }

      const nextTenancies = result?.tenancies ?? [];
      setTenancies(nextTenancies);
      setValues((currentValues) => ({
        ...currentValues,
        propertyId: currentValues.propertyId || nextTenancies[0]?.propertyId || "",
        tenancyId: currentValues.tenancyId || nextTenancies[0]?.id || "",
      }));
      setIsLoadingTenancies(false);
    }

    void loadTenancies();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage(null);

    const response = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setFieldErrors(result?.fieldErrors ?? {});
      setMessage(result?.error ?? "Unable to create issue.");
      setIsSubmitting(false);
      return;
    }

    const issueId = result.issue.id as string;

    try {
      for (const file of files) {
        setUploadProgress((currentProgress) => ({
          ...currentProgress,
          [file.name]: 0,
        }));
        await uploadEvidenceFile({
          file,
          issueId,
          onProgress: (progress) => {
            setUploadProgress((currentProgress) => ({
              ...currentProgress,
              [file.name]: progress,
            }));
          },
        });
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Issue created, but evidence upload failed: ${error.message}`
          : "Issue created, but evidence upload failed.",
      );
      setIsSubmitting(false);
      return;
    }

    router.push(`/issues/${issueId}`);
    router.refresh();
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">Issue details</h2>
        <p className="mt-1 text-sm text-slate-600">
          Priority will be assigned automatically based on the issue category.
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
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="tenancy">
              Property
              <select
                className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                disabled={isLoadingTenancies || tenancies.length === 0}
                id="tenancy"
                name="tenancy"
                onChange={(event) => {
                  const tenancy = tenancies.find((item) => item.id === event.target.value);
                  setValues((currentValues) => ({
                    ...currentValues,
                    tenancyId: tenancy?.id ?? "",
                    propertyId: tenancy?.propertyId ?? "",
                  }));
                }}
                value={values.tenancyId}
              >
                {tenancies.length === 0 ? (
                  <option value="">
                    {isLoadingTenancies ? "Loading tenancy..." : "No tenancy assigned"}
                  </option>
                ) : null}
                {tenancies.map((tenancy) => (
                  <option key={tenancy.id} value={tenancy.id}>
                    {tenancy.property?.propertyName ?? "Assigned property"}
                  </option>
                ))}
              </select>
            </label>
          </FieldError>

          <FieldError errors={fieldErrors.category}>
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="category">
              Category
              <select
                className="h-11 rounded-lg border bg-white px-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
                id="category"
                name="category"
                onChange={(event) =>
                  updateValue("category", event.target.value as IssueCategory)
                }
                value={values.category}
              >
                {ISSUE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </FieldError>

          <FieldError errors={fieldErrors.title}>
            <Input
              label="Issue title"
              name="title"
              onChange={(event) => updateValue("title", event.target.value)}
              placeholder="Boiler pressure drop"
              type="text"
              value={values.title}
            />
          </FieldError>

          <FieldError errors={fieldErrors.description}>
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="description">
              Description
              <textarea
                className="min-h-32 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
                id="description"
                name="description"
                onChange={(event) => updateValue("description", event.target.value)}
                placeholder="Describe what happened, where it happened, and any immediate impact."
                value={values.description}
              />
            </label>
          </FieldError>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            Priority will be assigned automatically.
          </div>

          <div className="grid gap-3 rounded-xl border border-dashed bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <UploadCloud className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Optional evidence upload
                </p>
                <p className="text-sm text-slate-500">
                  JPG, PNG, WEBP, or PDF up to 10 MB.
                </p>
              </div>
            </div>
            <input
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              className="block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              type="file"
            />
            {files.length > 0 ? (
              <p className="text-sm font-medium text-slate-600">
                {files.length} file{files.length === 1 ? "" : "s"} selected.
              </p>
            ) : null}
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <UploadProgress fileName={fileName} key={fileName} progress={progress} />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={isSubmitting || isLoadingTenancies || tenancies.length === 0}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit issue"}
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

  function updateValue<Key extends keyof IssueFormValues>(
    key: Key,
    value: IssueFormValues[Key],
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
