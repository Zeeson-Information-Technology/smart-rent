import { TenancyModel, type TenancyDocument } from "@/database/models";

export type TenantIdentity = { email: string; id: string };

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
  const email = user.email.toLowerCase();

  return (
    tenancy.tenantId === user.id ||
    tenancy.tenantEmail === email ||
    tenancy.additionalTenants.some(
      (tenant) => tenant.tenantId === user.id || tenant.email === email,
    )
  );
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
