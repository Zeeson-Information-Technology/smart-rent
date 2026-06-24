import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { TenanciesList } from "@/features/tenancies/components";

export const metadata: Metadata = {
  title: "Tenancies",
};

export default async function TenanciesPage() {
  const session = await auth();

  if (session?.user?.role === "tenant") {
    redirect("/my-tenancy");
  }

  const role = session?.user?.role ?? "landlord";
  const canCreate = role === "landlord" || role === "admin";

  return (
    <>
      <PageHeader
        actions={
          canCreate ? (
            <Link href="/tenancies/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Tenancy
              </Button>
            </Link>
          ) : null
        }
        description="Manage tenancy records linked to SmartRent properties."
        eyebrow="Tenants"
        title="Tenancies"
      />
      <TenanciesList role={role} />
    </>
  );
}
