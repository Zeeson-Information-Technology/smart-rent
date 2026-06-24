import type { Metadata } from "next";

import { auth } from "@/auth";

import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return <DashboardClient name={session?.user?.name ?? "there"} />;
}
