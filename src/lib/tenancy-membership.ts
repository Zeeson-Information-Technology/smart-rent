export type TenantIdentity = { email: string; id: string };

type TenancyMembership = {
  additionalTenants: Array<{ email: string; tenantId?: string | null }>;
  tenantEmail: string;
  tenantId?: string | null;
};

export type TenancyMemberRole = "joint" | "primary";

export function getTenancyMemberRole(
  tenancy: TenancyMembership,
  user: TenantIdentity,
): TenancyMemberRole | null {
  const email = user.email.toLowerCase();

  if (
    tenancy.tenantId === user.id ||
    tenancy.tenantEmail.toLowerCase() === email
  ) {
    return "primary";
  }

  return tenancy.additionalTenants.some(
    (tenant) =>
      tenant.tenantId === user.id || tenant.email.toLowerCase() === email,
  )
    ? "joint"
    : null;
}
