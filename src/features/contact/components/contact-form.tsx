"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Button, Input } from "@/components/ui";

type ContactFormFields = {
  email: string;
  message: string;
  name: string;
};

type ContactFieldErrors = Partial<Record<keyof ContactFormFields, string[]>>;

type ContactResponse = {
  error?: string;
  fieldErrors?: ContactFieldErrors;
};

const initialValues: ContactFormFields = {
  email: "",
  message: "",
  name: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormFields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response
      .json()
      .catch(() => null)) as ContactResponse | null;

    if (!response.ok) {
      setFieldErrors(result?.fieldErrors ?? {});
      setMessage(result?.error ?? "Unable to send your message.");
      setIsSubmitting(false);
      return;
    }

    setValues(initialValues);
    setMessage("Thanks. Your message has been sent to the SmartRent team.");
    setIsSubmitting(false);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FieldError errors={fieldErrors.name}>
        <Input
          label="Name"
          name="name"
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Alex Morgan"
          required
          type="text"
          value={values.name}
        />
      </FieldError>
      <FieldError errors={fieldErrors.email}>
        <Input
          label="Email"
          name="email"
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="you@example.com"
          required
          type="email"
          value={values.email}
        />
      </FieldError>
      <FieldError errors={fieldErrors.message}>
        <label
          className="grid gap-2 text-sm font-medium text-slate-700"
          htmlFor="message"
        >
          Message
          <textarea
            className="min-h-32 rounded-lg border bg-white px-3 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
            id="message"
            name="message"
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Tell us what you would like to discuss"
            required
            value={values.message}
          />
        </label>
      </FieldError>
      {message ? (
        <p className="text-sm font-medium text-slate-600">{message}</p>
      ) : null}
      <Button className="w-full sm:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
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
