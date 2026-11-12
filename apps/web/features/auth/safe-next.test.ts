import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it.each(["/", "/portal", "/portal/projetos?aba=1#topo"])(
    "keeps the relative path %s",
    (next) => {
      expect(safeNext(next)).toBe(next);
    },
  );

  it.each([
    null,
    "",
    "portal",
    "//site-externo.com",
    "/\\site-externo.com",
    "https://site-externo.com",
    "javascript:alert(1)",
  ])("falls back to / for %j", (next) => {
    expect(safeNext(next)).toBe("/");
  });
});
