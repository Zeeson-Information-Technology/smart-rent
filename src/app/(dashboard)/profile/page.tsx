import type { Metadata } from "next";
import { Bell, Building2, ShieldCheck, User } from "lucide-react";

import { PageHeader, StatCard } from "@/components/dashboard";
import { Badge, Card, CardContent, CardHeader, Input } from "@/components/ui";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        description="Static account profile and workspace settings preview."
        eyebrow="Account"
        title="Profile"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={User} label="Role" value="Landlord" />
        <StatCard icon={Building2} label="Workspace" value="1" />
        <StatCard icon={ShieldCheck} label="Security status" value="Ready" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-950">Profile information</h2>
            <p className="mt-1 text-sm text-slate-600">
              Static fields only. Account updates are not connected yet.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input label="Full name" name="name" placeholder="Alex Morgan" type="text" />
            <Input label="Email" name="email" placeholder="alex@smartrent.example" type="email" />
            <Input label="Company" name="company" placeholder="Canary Wharf Homes" type="text" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-950">Preferences</h2>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              "Issue priority alerts",
              "Weekly portfolio summary",
              "Dispute package updates",
            ].map((preference) => (
              <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4" key={preference}>
                <span className="text-sm font-medium text-slate-700">{preference}</span>
                <Badge variant="blue">Enabled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
