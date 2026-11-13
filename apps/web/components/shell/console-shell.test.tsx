// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConsoleShell } from "./console-shell";

const navigation = vi.hoisted(() => ({ pathname: "/console" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function renderShell() {
  return render(
    <ConsoleShell userMenu={<p>Equipe Nós</p>}>
      <h1>Conteúdo</h1>
    </ConsoleShell>,
  );
}

beforeEach(() => {
  navigation.pathname = "/console";
});

describe("ConsoleShell navigation", () => {
  it("lists only existing routes under the Sistema group", () => {
    renderShell();

    const nav = screen.getByRole("navigation", { name: "Console" });
    expect(within(nav).getByText("Sistema")).toBeInTheDocument();
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["Início", "/console"],
      ["Seixu", "/console/seixu"],
    ]);
    expect(screen.getByText("Equipe Nós")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Conteúdo");
  });

  it.each([
    ["/console/seixu", "Seixu", "Início"],
    ["/console", "Início", "Seixu"],
  ])("on %s marks %s as the current page", (pathname, current, other) => {
    navigation.pathname = pathname;
    renderShell();

    expect(screen.getByRole("link", { name: current })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: other })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

describe("ConsoleShell drawer", () => {
  it("opens from the menu button and closes on Escape, returning focus", async () => {
    const user = userEvent.setup();
    renderShell();
    const button = screen.getByRole("button", { name: "Abrir menu" });
    const drawer = document.getElementById(
      button.getAttribute("aria-controls") ?? "",
    );

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(drawer).toContainElement(
      screen.getByRole("navigation", { name: "Console" }),
    );

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(drawer).toHaveAttribute("data-open", "true");

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(drawer).toHaveAttribute("data-open", "false");
    expect(button).toHaveFocus();
  });

  it("closes on a click outside and returns focus to the button", async () => {
    const user = userEvent.setup();
    renderShell();
    const button = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(button);
    await user.click(screen.getByTestId("drawer-scrim"));

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("closes after navigating", async () => {
    const user = userEvent.setup();
    const { rerender } = renderShell();
    const button = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(button);
    navigation.pathname = "/console/seixu";
    rerender(
      <ConsoleShell userMenu={<p>Equipe Nós</p>}>
        <h1>Conteúdo</h1>
      </ConsoleShell>,
    );

    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

describe("ConsoleShell drawer, review fixes", () => {
  function shell() {
    return (
      <ConsoleShell userMenu={<p>Equipe Nós</p>}>
        <h1>Conteúdo</h1>
      </ConsoleShell>
    );
  }

  it("does not reopen when coming back to the route where it was opened", async () => {
    const user = userEvent.setup();
    const { rerender } = render(shell());
    const button = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(button);
    navigation.pathname = "/console/seixu";
    rerender(shell());
    navigation.pathname = "/console";
    rerender(shell());

    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the link to the current page is clicked", async () => {
    const user = userEvent.setup();
    render(shell());
    const button = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(button);
    await user.click(screen.getByRole("link", { name: "Início" }));

    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("moves focus into the drawer, on the current page link, when it opens", async () => {
    const user = userEvent.setup();
    navigation.pathname = "/console/seixu";
    render(shell());

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    expect(screen.getByRole("link", { name: "Seixu" })).toHaveFocus();
  });
});
