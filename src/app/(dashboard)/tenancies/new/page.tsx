import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { TenancyForm } from "@/features/tenancies/components";

export const metadata: Metadata = {
  title: "Create Tenancy",
};

export default async function NewTenancyPage() {
  const session = await auth();

  if (session?.user?.role === "tenant") {
    redirect("/my-tenancy");
  }

  return (
    <>
      <PageHeader
        description="Create a tenancy linked to one of your SmartRent properties."
        eyebrow="Tenants"
        title="Create tenancy"
      />
      <TenancyForm mode="create" />
    </>
  );
}
