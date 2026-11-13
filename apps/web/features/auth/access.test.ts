import { describe, expect, it } from "vitest";
import { type Area, homeFor, type Role, resolveAccess } from "./access";

describe("resolveAccess", () => {
  it.each<[Role | null, Area, string]>([
    [null, "console", "/login?next=%2Fconsole%2Fseixu"],
    [null, "portal", "/login?next=%2Fconsole%2Fseixu"],
    [null, "public", "allow"],
    ["client", "console", "/portal"],
    ["client", "portal", "allow"],
    ["client", "public", "allow"],
    ["team", "console", "allow"],
    ["team", "portal", "allow"],
    ["admin", "console", "allow"],
    ["admin", "portal", "allow"],
  ])("gives role %s in area %s the result %s", (role, area, expected) => {
    expect(resolveAccess({ area, role, path: "/console/seixu" })).toBe(
      expected,
    );
  });
});

describe("homeFor", () => {
  it.each<[Role, string]>([
    ["admin", "/console"],
    ["team", "/console"],
    ["client", "/portal"],
  ])("sends %s to %s", (role, home) => {
    expect(homeFor(role)).toBe(home);
  });
});
