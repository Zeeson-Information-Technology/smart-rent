import type { Metadata } from "next";

import { auth } from "@/auth";
import { IssueDetails } from "@/features/issues/components";

export const metadata: Metadata = {
  title: "Issue Details",
};

type IssueDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  return (
    <IssueDetails
      currentUserId={session?.user?.id ?? ""}
      id={id}
      role={session?.user?.role ?? "tenant"}
    />
  );
}
