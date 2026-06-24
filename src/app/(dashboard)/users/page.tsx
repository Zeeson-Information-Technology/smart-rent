import type { Metadata } from "next";
import { UserPlus, Users } from "lucide-react";

import { DataTable, PageHeader, StatCard } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Users",
};

const users = [
  { name: "Willy Landlord", email: "williamson.knute@forliion.com", role: "Landlord" },
  { name: "Mia Thompson", email: "mia.thompson@example.com", role: "Tenant" },
  { name: "Nadia Patel", email: "nadia.patel@example.com", role: "Admin" },
];

export default function UsersPage() {
  return (
    <>
      <PageHeader
        actions={
          <Button type="button">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Invite user
          </Button>
        }
        description="Static admin user overview. User management workflows are not connected yet."
        eyebrow="Admin workspace"
        title="Users"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Total users" value="1,284" />
        <StatCard icon={Users} label="Landlords" value="342" />
        <StatCard icon={Users} label="Tenants" value="912" />
      </div>
      <DataTable
        columns={[
          { header: "Name", render: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
          { header: "Email", render: (row) => row.email },
          { header: "Role", render: (row) => row.role },
        ]}
        rows={users}
      />
    </>
  );
}
