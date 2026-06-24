"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const callbackUrl =
      new URLSearchParams(window.location.search).get("callbackUrl") ??
      "/dashboard";

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result.url ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border bg-white px-3 pl-10 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              id="password"
              name="password"
              placeholder="Enter your password"
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
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
