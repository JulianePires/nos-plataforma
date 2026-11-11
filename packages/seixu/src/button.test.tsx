import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

const HEX_COLOR = /#[0-9a-f]{3,6}/i;

describe("Button", () => {
  it("uses the action token as primary background", () => {
    render(<Button variant="primary">Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });

    expect(button).toHaveClass("bg-action-primary");
    expect(button.className).not.toMatch(HEX_COLOR);
  });

  it.each([
    ["primary", "bg-action-primary"],
    ["secondary", "bg-surface-3"],
    ["ghost", "bg-transparent"],
    ["danger", "bg-danger"],
  ] as const)("renders the %s variant with %s", (variant, expected) => {
    render(<Button variant={variant}>Ação</Button>);
    const element = screen.getByRole("button");

    expect(element).toHaveClass(expected);
    expect(element.className).not.toMatch(HEX_COLOR);
  });

  it.each([
    ["sm", "h-8"],
    ["md", "h-10"],
  ] as const)("renders the %s size with %s", (size, expected) => {
    render(<Button size={size}>Ação</Button>);

    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it("defaults to primary, md and type button", () => {
    render(<Button>Ação</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-action-primary");
    expect(button).toHaveClass("h-10");
    expect(button).toHaveAttribute("type", "button");
  });

  it("shows a visible focus ring for keyboard users", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button")).toHaveClass("focus-visible:outline-2");
  });
});
