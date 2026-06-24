import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { DisputesList } from "@/features/disputes/components";

export const metadata: Metadata = { title: "Disputes" };

export default function DisputesPage() {
  return (
    <>
      <PageHeader
        actions={
          <Link href="/disputes/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Dispute
            </Button>
          </Link>
        }
        description="Track formal dispute documentation linked to issue records."
        eyebrow="Documentation"
        title="Disputes"
      />
      <DisputesList />
    </>
  );
}
