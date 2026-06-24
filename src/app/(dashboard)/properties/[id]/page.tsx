import type { Metadata } from "next";

import { PropertyDetails } from "@/features/properties/components";

export const metadata: Metadata = {
  title: "Property Details",
};

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return <PropertyDetails id={id} />;
}
