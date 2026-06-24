import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { IssuesList } from "@/features/issues/components";

export const metadata: Metadata = {
  title: "Issues",
};

export default async function IssuesPage() {
  const session = await auth();
  const role = session?.user?.role ?? "tenant";

  return (
    <>
      <PageHeader
        actions={
          role === "tenant" ? (
            <Link href="/issues/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Report Issue
              </Button>
            </Link>
          ) : null
        }
        description="Track maintenance reports with automatic SmartRent priority assignment."
        eyebrow="Maintenance"
        title="Issues"
      />
      <IssuesList role={role} />
    </>
  );
}
