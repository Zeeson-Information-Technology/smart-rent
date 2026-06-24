import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageShell } from "@/components/layout";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui";

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
};

const accountBenefits = [
  "Property and tenancy workspace",
  "Issue and evidence documentation",
  "Reports foundation for future workflows",
];

export default function RegisterPage() {
  return (
    <PageShell className="flex items-center py-10">
      <Container className="grid min-h-[calc(100vh-5rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="order-2 rounded-xl border bg-white p-6 shadow-sm lg:order-1">
          <Link className="flex items-center gap-2 font-semibold text-slate-950" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>SmartRent</span>
          </Link>
          <Badge className="mt-10" variant="green">Secure onboarding</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal text-slate-950">
            Build a reliable operating record from day one.
          </h1>
          <div className="mt-6 grid gap-3">
            {accountBenefits.map((benefit) => (
              <div className="rounded-lg border bg-slate-50 p-4 text-sm font-medium text-slate-700" key={benefit}>
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <Card className="order-1 mx-auto w-full max-w-lg lg:order-2">
          <CardHeader>
            <h2 className="text-2xl font-semibold tracking-normal text-slate-950">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create your SmartRent workspace account.</p>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link className="font-medium text-blue-700 hover:text-blue-800" href="/login">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </PageShell>
  );
}
