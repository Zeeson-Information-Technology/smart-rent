import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { MyTenancyView } from "@/features/tenancies/components";

export const metadata: Metadata = {
  title: "My Tenancy",
};

export default async function MyTenancyPage() {
  const session = await auth();

  if (session?.user?.role !== "tenant") {
    redirect("/tenancies");
  }

  return (
    <>
      <PageHeader
        description="Your assigned SmartRent tenancy, property, and lease details."
        eyebrow="Tenant workspace"
        title="My tenancy"
      />
      <MyTenancyView />
    </>
  );
}
