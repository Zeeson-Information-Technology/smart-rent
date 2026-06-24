import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard";
import { DisputeForm } from "@/features/disputes/components";

export const metadata: Metadata = { title: "Create Dispute" };

export default function NewDisputePage() {
  return (
    <>
      <PageHeader
        description="Raise a formal dispute linked to an existing issue."
        eyebrow="Documentation"
        title="Create dispute"
      />
      <DisputeForm />
    </>
  );
}
