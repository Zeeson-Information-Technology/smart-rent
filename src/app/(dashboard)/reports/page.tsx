import type { Metadata } from "next";
import { AlertCircle, FileText, Scale } from "lucide-react";
import Link from "next/link";

import { DashboardCard, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        description="Review the structured records currently available for reporting and case preparation."
        eyebrow="Reporting"
        title="Reports"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <ReportSource
          description="Review issue priority, status, evidence, and communication history."
          href="/issues"
          icon={AlertCircle}
          title="Issue records"
        />
        <ReportSource
          description="Review dispute references, evidence, timelines, and resolution notes."
          href="/disputes"
          icon={Scale}
          title="Dispute records"
        />
      </div>
      <DashboardCard className="mt-4">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-950">Report exports</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Downloadable report generation is not currently available. All
              source records remain accessible through their respective modules.
            </p>
          </div>
        </div>
      </DashboardCard>
    </>
  );
}

function ReportSource({
  description,
  href,
  icon: Icon,
  title,
}: {
  description: string;
  href: string;
  icon: typeof AlertCircle;
  title: string;
}) {
  return (
    <DashboardCard>
      <div className="p-4 sm:p-5">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="mt-3 font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        <Link href={href}>
          <Button className="mt-4" variant="outline">
            View records
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
