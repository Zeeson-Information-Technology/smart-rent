import "server-only";

import { TenancyModel, type TenancyDocument } from "@/database/models";
import {
  getTenancyMemberRole,
  type TenantIdentity,
} from "@/lib/tenancy-membership";

export function tenantMembershipConditions(user: TenantIdentity) {
  return [
    { tenantId: user.id },
    { tenantEmail: user.email.toLowerCase() },
    { "additionalTenants.tenantId": user.id },
    { "additionalTenants.email": user.email.toLowerCase() },
  ];
}

export function tenantBelongsToTenancy(
  tenancy: TenancyDocument,
  user: TenantIdentity,
) {
  return getTenancyMemberRole(tenancy, user) !== null;
}

export async function findTenantTenancyForProperty(
  propertyId: string,
  user: TenantIdentity,
) {
  return TenancyModel.findOne({
    propertyId,
    $or: tenantMembershipConditions(user),
  }).sort({ createdAt: -1 });
}
