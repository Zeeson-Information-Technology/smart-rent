import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { PropertyForm } from "@/features/properties/components";

export const metadata: Metadata = {
  title: "Create Property",
};

export default async function NewPropertyPage() {
  const session = await auth();

  if (session?.user?.role === "tenant") {
    redirect("/dashboard");
  }

  return (
    <>
      <PageHeader
        description="Create a real property record for your SmartRent portfolio."
        eyebrow="Portfolio"
        title="Create property"
      />
      <PropertyForm mode="create" />
    </>
  );
}
