import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

const HEX_COLOR = /#[0-9a-f]{3,6}/i;

describe("Input", () => {
  it("requires a label at compile time", () => {
    // @ts-expect-error label is required so every field stays accessible
    render(<Input />);
  });

  it("associates the label with the field", () => {
    render(<Input label="E-mail" type="email" />);

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
  });

  it("styles the field only with tokens and a visible focus ring", () => {
    render(<Input label="Nome" />);
    const { className } = screen.getByLabelText("Nome");

    expect(className).toContain("bg-surface-2");
    expect(className).toContain("focus-visible:outline-2");
    expect(className).not.toMatch(HEX_COLOR);
  });

  it("keeps a caller-provided id", () => {
    render(<Input label="Cliente" id="client" />);

    expect(screen.getByLabelText("Cliente")).toHaveAttribute("id", "client");
  });
});
