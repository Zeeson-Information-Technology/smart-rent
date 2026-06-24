"use client";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";
import type { UserRole } from "@/types/database";

type RegisterResponse = {
  error?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email,
        password: formData.get("password"),
        role: formData.get("role") as UserRole,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as RegisterResponse;
      setError(data.error ?? "Unable to create account.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.push("/login?registered=1");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="relative min-w-0">
          <User
            className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
          <Input
            autoComplete="given-name"
            className="pl-10"
            label="First name"
            name="firstName"
            placeholder="Alex"
            required
            type="text"
          />
        </div>
        <div className="min-w-0">
          <Input
            autoComplete="family-name"
            label="Last name"
            name="lastName"
            placeholder="Morgan"
            required
            type="text"
          />
        </div>
      </div>
      <div className="relative">
        <Mail
          className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
        <Input
          autoComplete="email"
          className="pl-10"
          label="Email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="relative">
        <label
          className="grid gap-2 text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
          <span className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              autoComplete="new-password"
              className="h-11 w-full rounded-lg border bg-white px-3 pl-10 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              id="password"
              minLength={8}
              name="password"
              placeholder="Create a password"
              required
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </span>
        </label>
      </div>
      <label
        className="grid gap-2 text-sm font-medium text-slate-700"
        htmlFor="role"
      >
        Role
        <select
          className="h-11 rounded-lg border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-blue-100"
          defaultValue="landlord"
          id="role"
          name="role"
        >
          <option value="landlord">Landlord</option>
          <option value="tenant">Tenant</option>
        </select>
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
