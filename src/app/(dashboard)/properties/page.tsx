import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { PropertiesList } from "@/features/properties/components";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function PropertiesPage() {
  const session = await auth();
  const canCreate =
    session?.user?.role === "landlord" || session?.user?.role === "admin";

  return (
    <>
      <PageHeader
        actions={
          canCreate ? (
            <Link href="/properties/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Property
              </Button>
            </Link>
          ) : null
        }
        description="Manage real property records for the SmartRent portfolio workspace."
        eyebrow="Portfolio"
        title="Properties"
      />
      <PropertiesList />
    </>
  );
}
