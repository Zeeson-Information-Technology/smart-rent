import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { EditPropertyView } from "@/features/properties/components";

export const metadata: Metadata = {
  title: "Edit Property",
};

type EditPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const session = await auth();

  if (session?.user?.role === "tenant") {
    redirect("/dashboard");
  }

  const { id } = await params;

  return (
    <>
      <PageHeader
        description="Update property details and operating status."
        eyebrow="Portfolio"
        title="Edit property"
      />
      <EditPropertyView id={id} />
    </>
  );
}
