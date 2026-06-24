import { describe, expect, it } from "vitest";

import { getIssuePriority } from "./smartPriority";

describe("getIssuePriority", () => {
  it("assigns high priority to urgent maintenance and safety categories", () => {
    expect(getIssuePriority("Water Leak")).toBe("high");
    expect(getIssuePriority("Electrical Fault")).toBe("high");
    expect(getIssuePriority("Heating Failure")).toBe("high");
    expect(getIssuePriority("Security Issue")).toBe("high");
  });

  it("assigns medium priority to noise and appliance categories", () => {
    expect(getIssuePriority("Noise Complaint")).toBe("medium");
    expect(getIssuePriority("Appliance Fault")).toBe("medium");
  });

  it("assigns low priority to general and cosmetic categories", () => {
    expect(getIssuePriority("General Maintenance")).toBe("low");
    expect(getIssuePriority("Cosmetic Repair")).toBe("low");
  });
});
