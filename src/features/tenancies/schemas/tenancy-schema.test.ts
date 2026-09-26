import { describe, expect, it } from "vitest";

import { tenancySchema } from "./index";

const validTenancy = {
  propertyId: "507f1f77bcf86cd799439011",
  tenantName: "Alex Morgan",
  tenantEmail: "alex@example.com",
  tenantPhone: "+44 7700 900123",
  additionalTenants: [
    { name: "Sam Morgan", email: "sam@example.com", phone: "+44 7700 900124" },
  ],
  startDate: "2026-09-01",
  endDate: "",
  rentAmount: 1800,
  status: "active",
};

describe("tenancySchema", () => {
  it("accepts primary and additional tenant contact details", () => {
    expect(tenancySchema.safeParse(validTenancy).success).toBe(true);
  });

  it("rejects an additional tenant with an invalid email", () => {
    const result = tenancySchema.safeParse({
      ...validTenancy,
      additionalTenants: [
        { name: "Sam Morgan", email: "invalid", phone: "1234567" },
      ],
    });

    expect(result.success).toBe(false);
  });
});
