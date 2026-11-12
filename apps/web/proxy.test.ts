import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import { config } from "./proxy";

describe("proxy matcher", () => {
  it.each([
    "/_next/static/x.js",
    "/_next/image",
    "/favicon.ico",
    "/logo.svg",
    "/photos/a.webp",
  ])("skips static asset %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  });

  it.each(["/", "/projects/42", "/api/health"])("runs on %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });
});
