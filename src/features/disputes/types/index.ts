import type { DisputeStatus, IssuePriority } from "@/types/database";

export type DisputeRecord = {
  id: string;
  disputeReference: string;
  issueId: string;
  propertyId: string;
  tenancyId: string | null;
  landlordId: string;
  tenantId: string;
  raisedBy: string;
  title: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  priority: IssuePriority;
  resolutionNotes: string;
  issueTitle: string;
  propertyName: string;
  tenantName: string;
  primaryTenantName: string;
  raisedByName: string;
  createdAt: string;
  updatedAt: string;
};
