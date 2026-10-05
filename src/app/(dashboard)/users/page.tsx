import type { Metadata } from "next";
import { Users } from "lucide-react";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <>
      <PageHeader
        description="Review platform user activity and account totals from the admin dashboard."
        eyebrow="Admin workspace"
        title="Users"
      />
      <EmptyState
        action={
          <Link href="/dashboard">
            <Button variant="outline">Return to admin dashboard</Button>
          </Link>
        }
        description="Full user administration is not currently available. Platform totals and recently registered users are shown on the admin dashboard."
        icon={Users}
        title="User management is read-only"
      />
    </>
  );
}
