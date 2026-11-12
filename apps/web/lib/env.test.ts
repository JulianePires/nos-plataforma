import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicEnv, parsePublicEnv } from "./env";

afterEach(() => {
  vi.unstubAllEnvs();
});

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_abc123",
};

describe("parsePublicEnv", () => {
  it("fails naming NEXT_PUBLIC_SUPABASE_URL when it is missing", () => {
    expect(() =>
      parsePublicEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: undefined }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("fails naming NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY when it holds a legacy JWT", () => {
    expect(() =>
      parsePublicEnv({
        ...valid,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.signature",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  });

  it("fails when NEXT_PUBLIC_SUPABASE_URL is not a URL", () => {
    expect(() =>
      parsePublicEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("fails when NEXT_PUBLIC_SUPABASE_URL is not http(s)", () => {
    expect(() =>
      parsePublicEnv({
        ...valid,
        NEXT_PUBLIC_SUPABASE_URL: "ftp://example.supabase.co",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("returns the typed values when both are valid", () => {
    expect(parsePublicEnv(valid)).toEqual(valid);
  });
});

describe("getPublicEnv", () => {
  it("fails naming NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY when only the legacy anon key is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", valid.NEXT_PUBLIC_SUPABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiJ9.e30.sig");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);

    expect(() => getPublicEnv()).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
  });
});
