import type { CookieMethodsServer } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSession } from "./proxy";

type SetAll = NonNullable<CookieMethodsServer["setAll"]>;
type Refresh = {
  cookies: Parameters<SetAll>[0];
  headers: Parameters<SetAll>[1];
};

const refresh = vi.hoisted((): Refresh => ({ cookies: [], headers: {} }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (
    _url: string,
    _key: string,
    { cookies }: { cookies: CookieMethodsServer },
  ) => ({
    auth: {
      getClaims: vi.fn(async () => {
        if (refresh.cookies.length > 0) {
          await cookies.setAll?.(refresh.cookies, refresh.headers);
        }
        return { data: null, error: null };
      }),
    },
  }),
}));

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  refresh.cookies = [];
  refresh.headers = {};
});

describe("updateSession", () => {
  it("carries the refreshed session cookies and cache headers on the response", async () => {
    refresh.cookies = [
      {
        name: "sb-local-auth-token",
        value: "new-token",
        options: { path: "/" },
      },
    ];
    refresh.headers = { "Cache-Control": "private, no-store" };
    const request = new NextRequest("http://localhost:3000/", {
      headers: { cookie: "sb-local-auth-token=old-token" },
    });

    const response = await updateSession(request);

    expect(response.cookies.get("sb-local-auth-token")?.value).toBe(
      "new-token",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("lets a request without a session through without redirecting", async () => {
    const response = await updateSession(
      new NextRequest("http://localhost:3000/"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
