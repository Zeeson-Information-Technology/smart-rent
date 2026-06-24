import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { IssueForm } from "@/features/issues/components";

export const metadata: Metadata = {
  title: "Report Issue",
};

export default async function NewIssuePage() {
  const session = await auth();

  if (session?.user?.role !== "tenant") {
    redirect("/issues");
  }

  return (
    <>
      <PageHeader
        description="Report a maintenance issue. SmartRent will assign priority automatically."
        eyebrow="Maintenance"
        title="Report an issue"
      />
      <IssueForm />
    </>
  );
}
