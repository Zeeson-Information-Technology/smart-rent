import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageShell } from "@/components/layout";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
};

type LoginPageProps = {
  searchParams?: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const accountCreated = resolvedSearchParams?.registered === "1";

  return (
    <PageShell className="flex items-center py-10">
      <Container className="grid min-h-[calc(100vh-5rem)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block">
          <Link
            className="flex items-center gap-2 font-semibold text-slate-950"
            href="/"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>SmartRent</span>
          </Link>
          <Badge className="mt-10">Welcome back</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal text-slate-950">
            Continue managing property records with confidence.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Sign in securely to access your SmartRent property and tenancy
            workspace.
          </p>
        </section>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <Link
              className="mb-6 flex items-center gap-2 font-semibold text-slate-950 lg:hidden"
              href="/"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>SmartRent</span>
            </Link>
            <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
              Log in
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Access your SmartRent workspace.
            </p>
          </CardHeader>
          <CardContent>
            {accountCreated ? (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                Account created successfully. Please log in.
              </div>
            ) : null}
            <LoginForm />
            <p className="mt-6 text-center text-sm text-slate-600">
              New to SmartRent?{" "}
              <Link
                className="font-medium text-blue-700 hover:text-blue-800"
                href="/register"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </PageShell>
  );
}
