import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { EditTenancyView } from "@/features/tenancies/components";

export const metadata: Metadata = {
  title: "Edit Tenancy",
};

type EditTenancyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTenancyPage({ params }: EditTenancyPageProps) {
  const session = await auth();

  if (session?.user?.role === "tenant") {
    redirect("/my-tenancy");
  }

  const { id } = await params;

  return (
    <>
      <PageHeader
        description="Update tenant, property, lease, and tenancy status details."
        eyebrow="Tenants"
        title="Edit tenancy"
      />
      <EditTenancyView id={id} />
    </>
  );
}
