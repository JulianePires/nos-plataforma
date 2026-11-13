// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortalHeader } from "./portal-header";

describe("PortalHeader", () => {
  it("shows the brand and the user menu without the console navigation", () => {
    render(<PortalHeader userMenu={<p>Cliente Teste</p>} />);

    expect(screen.getByRole("banner")).toHaveTextContent("Nós");
    expect(screen.getByText("Cliente Teste")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Seixu" }),
    ).not.toBeInTheDocument();
  });
});
