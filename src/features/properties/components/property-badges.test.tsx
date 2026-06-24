import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { PropertyStatusBadge } from "./property-status-badge";
import { PropertyTypeBadge } from "./property-type-badge";

describe("PropertyStatusBadge", () => {
  it("renders a readable active status label", () => {
    render(createElement(PropertyStatusBadge, { status: "active" }));

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders a readable maintenance status label", () => {
    render(createElement(PropertyStatusBadge, { status: "maintenance" }));

    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });
});

describe("PropertyTypeBadge", () => {
  it("renders the property type", () => {
    render(
      createElement(PropertyTypeBadge, {
        propertyType: "Shared Accommodation",
      }),
    );

    expect(screen.getByText("Shared Accommodation")).toBeInTheDocument();
  });
});
