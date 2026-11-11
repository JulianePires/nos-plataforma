import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const tokens = readFileSync(join(import.meta.dirname, "tokens.css"), "utf8");

function fontStack(name: string): string {
  const match = new RegExp(`--font-${name}:\\s*([^;]+);`).exec(tokens);
  if (!match?.[1]) throw new Error(`--font-${name} not found`);
  return match[1];
}

const darkTheme =
  /:root,\s*\[data-theme="dark"\]\s*\{([^}]+)\}/.exec(tokens)?.[1] ?? "";

function darkHex(name: string): string {
  const match = new RegExp(`--seixu-${name}:\\s*(#[0-9a-f]{6});`, "i").exec(
    darkTheme,
  );
  if (!match?.[1]) throw new Error(`--seixu-${name} not found in dark theme`);
  return match[1];
}

// WCAG 2.x relative luminance: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (light + 0.05) / (dark + 0.05);
}

describe("dark theme contrast (WCAG AA ≥ 4.5)", () => {
  it.each([
    ["text on bg", "text", "bg"],
    ["text on surface", "text", "surface"],
    ["muted text on surface", "text-2", "surface"],
    ["primary button label", "on-action", "blue"],
  ])("%s", (_, foreground, background) => {
    expect(
      contrast(darkHex(foreground), darkHex(background)),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe("font tokens", () => {
  it.each(["sans", "mono"])(
    "keeps the %s stack free of serif fonts",
    (name) => {
      const stack = fontStack(name).replaceAll("sans-serif", "");

      expect(stack).not.toMatch(/serif/i);
    },
  );

  it("uses Commissioner for UI and JetBrains Mono for data", () => {
    expect(fontStack("sans")).toMatch(/^var\(--font-commissioner\)/);
    expect(fontStack("mono")).toMatch(/^var\(--font-jetbrains-mono\)/);
  });

  it("disables the serif font utility", () => {
    expect(fontStack("serif")).toBe("initial");
  });
});
