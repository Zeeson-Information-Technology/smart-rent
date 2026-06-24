import type { Metadata } from "next";
import { Bell, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { DashboardCard, EmptyState, PageHeader, StatCard } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        description="Static workspace settings preview. Settings are not connected to persistence yet."
        eyebrow="Workspace"
        title="Settings"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={SlidersHorizontal} label="Preferences" value="8" />
        <StatCard icon={Bell} label="Notifications" value="3" />
        <StatCard icon={ShieldCheck} label="Security checks" value="Ready" />
      </div>
      <DashboardCard>
        <div className="p-5">
          <EmptyState
            description="Workspace preferences, notification rules, and security options will appear here when settings are connected."
            icon={SlidersHorizontal}
            title="Settings are ready for backend wiring"
          />
        </div>
      </DashboardCard>
    </>
  );
}
