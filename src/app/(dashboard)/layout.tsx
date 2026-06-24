import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard";
import { auth } from "@/auth";

export default async function ProtectedStyleLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}
