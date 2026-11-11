import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

const HEX_COLOR = /#[0-9a-f]{3,6}/i;

describe("Badge", () => {
  it.each([
    ["neutral", "text-text-muted"],
    ["blue", "text-accent-blue"],
    ["purple", "text-accent-purple"],
    ["brown", "text-accent-brown"],
    ["green", "text-success"],
    ["red", "text-danger"],
  ] as const)("renders the %s tone with %s", (tone, expected) => {
    render(<Badge tone={tone}>Status</Badge>);
    const element = screen.getByText("Status");

    expect(element).toHaveClass(expected);
    expect(element.className).not.toMatch(HEX_COLOR);
  });

  it("defaults to the neutral tone", () => {
    render(<Badge>Rascunho</Badge>);

    expect(screen.getByText("Rascunho")).toHaveClass("text-text-muted");
  });
});
