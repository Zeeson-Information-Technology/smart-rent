import type { Metadata } from "next";
import { FileArchive, FileText } from "lucide-react";

import { EmptyState, PageHeader, StatCard } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        description="Static tenant document center for future tenancy documents and evidence files."
        eyebrow="Tenant workspace"
        title="Documents"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Tenancy documents" value="4" />
        <StatCard icon={FileArchive} label="Evidence files" value="7" />
        <StatCard icon={FileText} label="Reports shared" value="2" />
      </div>
      <EmptyState
        action={<Button type="button">Upload placeholder</Button>}
        description="Documents shared with the tenant will appear here when document workflows are connected."
        icon={FileArchive}
        title="No new documents"
      />
    </>
  );
}
