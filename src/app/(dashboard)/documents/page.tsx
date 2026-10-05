import type { Metadata } from "next";
import { FileArchive } from "lucide-react";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        description="Access evidence and documents associated with your tenancy records."
        eyebrow="Tenant workspace"
        title="Documents"
      />
      <EmptyState
        action={
          <Link href="/issues">
            <Button type="button">View issue evidence</Button>
          </Link>
        }
        description="Evidence files are currently managed from their related issue or dispute. A consolidated document library is not yet available."
        icon={FileArchive}
        title="Documents are organized by record"
      />
    </>
  );
}
