import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { DashboardCard, EmptyState, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        description="Manage account and workspace preferences as they become available."
        eyebrow="Workspace"
        title="Settings"
      />
      <DashboardCard>
        <div className="p-5">
          <EmptyState
            action={
              <Link href="/profile">
                <Button variant="outline">View account profile</Button>
              </Link>
            }
            description="There are no configurable workspace settings yet. Your account details and role remain available from your profile."
            icon={SlidersHorizontal}
            title="No configurable settings"
          />
        </div>
      </DashboardCard>
    </>
  );
}
