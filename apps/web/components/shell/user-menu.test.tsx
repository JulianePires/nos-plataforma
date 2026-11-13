// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "./user-menu";

vi.mock("../../features/auth/actions", () => ({ signOut: vi.fn() }));

describe("UserMenu", () => {
  it("shows who is signed in and a sign-out button", () => {
    render(<UserMenu name="Equipe Nós" userRole="team" />);

    expect(screen.getByText("Equipe Nós")).toBeInTheDocument();
    expect(screen.getByText("Equipe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("falls back to the role when the profile has no name", () => {
    render(<UserMenu name={null} userRole="client" />);

    expect(screen.getAllByText("Cliente")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });
});
