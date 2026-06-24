import type { Metadata } from "next";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { DisputeDetails } from "@/features/disputes/components";

export const metadata: Metadata = { title: "Dispute Details" };

type DisputeDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DisputeDetailsPage({ params }: DisputeDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  return (
    <>
      <PageHeader
        description="Formal dispute case file with evidence, communication, status, and timeline."
        eyebrow="Dispute details"
        title="Dispute case"
      />
      <DisputeDetails id={id} role={session?.user?.role ?? "tenant"} />
    </>
  );
}
