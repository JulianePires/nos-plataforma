import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it.each([
    "/",
    "/portal",
    "/portal/projetos?aba=1#topo",
    "/console/seixu",
    "/portal?q=50%25",
  ])("keeps the relative path %s", (next) => {
    expect(safeNext(next)).toBe(next);
  });

  it.each([
    null,
    "",
    "portal",
    "//site-externo.com",
    "/\\site-externo.com",
    "https://site-externo.com",
    "javascript:alert(1)",
    "/\t/site-externo.com",
    "/\n/site-externo.com",
    "/\r/site-externo.com",
    "/\t\\site-externo.com",
    "/auth/confirm?token_hash=do-atacante&type=email",
    "/AUTH/confirm",
    "/%61uth/confirm",
    "/auth%2Fconfirm",
    "/%E0%A4%A",
  ])("falls back to / for %j", (next) => {
    expect(safeNext(next)).toBe("/");
  });
});
