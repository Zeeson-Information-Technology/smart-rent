import { describe, expect, it } from "vitest";

import { getTenancyMemberRole } from "./tenancy-membership";

const tenancy = {
  tenantId: "primary-user",
  tenantEmail: "primary@example.com",
  additionalTenants: [
    {
      tenantId: "joint-user",
      email: "joint@example.com",
    },
    {
      tenantId: null,
      email: "pending@example.com",
    },
  ],
};

describe("getTenancyMemberRole", () => {
  it("identifies the primary tenant by account id", () => {
    expect(
      getTenancyMemberRole(tenancy, {
        id: "primary-user",
        email: "different@example.com",
      }),
    ).toBe("primary");
  });

  it("identifies a joint tenant by linked id or registered email", () => {
    expect(
      getTenancyMemberRole(tenancy, {
        id: "joint-user",
        email: "joint@example.com",
      }),
    ).toBe("joint");
    expect(
      getTenancyMemberRole(tenancy, {
        id: "new-user",
        email: "PENDING@EXAMPLE.COM",
      }),
    ).toBe("joint");
  });

  it("rejects users who are not members of the tenancy", () => {
    expect(
      getTenancyMemberRole(tenancy, {
        id: "unrelated-user",
        email: "unrelated@example.com",
      }),
    ).toBeNull();
  });
});
