import { DB_VERSION } from "@nos/db";
import { PRICING_VERSION } from "@nos/pricing";
import { SEIXU_VERSION } from "@nos/seixu";
import { describe, expect, it } from "vitest";

describe("internal packages", () => {
  it.each([
    ["@nos/pricing", PRICING_VERSION],
    ["@nos/seixu", SEIXU_VERSION],
    ["@nos/db", DB_VERSION],
  ])("imports the version from %s", (_name, version) => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
