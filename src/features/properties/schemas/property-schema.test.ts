import { describe, expect, it } from "vitest";

import { propertySchema, updatePropertySchema } from "./index";

const validProperty = {
  propertyName: "Canary Wharf Apartment 8B",
  address: "123 Canary Wharf",
  city: "London",
  postcode: "E14 5AB",
  propertyType: "Apartment",
  status: "active",
  description: "Two-bedroom apartment with concierge access.",
};

describe("propertySchema", () => {
  it("accepts a valid property payload", () => {
    const result = propertySchema.safeParse(validProperty);

    expect(result.success).toBe(true);
  });

  it("rejects missing required fields with field errors", () => {
    const result = propertySchema.safeParse({
      propertyName: "",
      address: "",
      city: "",
      postcode: "",
      propertyType: "Apartment",
      status: "active",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.propertyName).toContain("Property name is required");
      expect(fieldErrors.address).toContain("Address is required");
      expect(fieldErrors.city).toContain("City is required");
      expect(fieldErrors.postcode).toContain("Postcode is required");
    }
  });

  it("rejects unsupported property types and statuses", () => {
    const result = propertySchema.safeParse({
      ...validProperty,
      propertyType: "Castle",
      status: "archived",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.propertyType).toContain("Select a valid property type");
      expect(fieldErrors.status).toContain("Select a valid property status");
    }
  });
});

describe("updatePropertySchema", () => {
  it("accepts partial update payloads", () => {
    const result = updatePropertySchema.safeParse({
      status: "maintenance",
    });

    expect(result.success).toBe(true);
  });
});
