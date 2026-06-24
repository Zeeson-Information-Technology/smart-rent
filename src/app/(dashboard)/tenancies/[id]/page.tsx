import type { Metadata } from "next";

import { auth } from "@/auth";
import { TenancyDetails } from "@/features/tenancies/components";

export const metadata: Metadata = {
  title: "Tenancy Details",
};

type TenancyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TenancyDetailsPage({
  params,
}: TenancyDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  return <TenancyDetails id={id} role={session?.user?.role ?? "tenant"} />;
}
