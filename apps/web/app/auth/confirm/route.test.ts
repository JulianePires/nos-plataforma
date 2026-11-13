import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NEXT_COOKIE } from "../../../lib/supabase/proxy";
import { GET } from "./route";

const auth = vi.hoisted(() => ({
  verifyOtp: vi.fn(),
}));

vi.mock("../../../lib/supabase/server", () => ({
  createClient: () => Promise.resolve({ auth }),
}));

function confirm(query: string, cookie?: string) {
  return GET(
    new NextRequest(`https://app.nos.dev/auth/confirm?${query}`, {
      headers: cookie ? { cookie: `${NEXT_COOKIE}=${cookie}` } : {},
    }),
  );
}

beforeEach(() => {
  auth.verifyOtp.mockReset();
  auth.verifyOtp.mockResolvedValue({ data: {}, error: null });
});

describe("GET /auth/confirm", () => {
  it("opens the session and lands on / by default", async () => {
    const response = await confirm("token_hash=abc&type=email");

    expect(auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "abc",
      type: "email",
    });
    expect(response.headers.get("location")).toBe("https://app.nos.dev/");
  });

  it("follows a relative next path", async () => {
    const response = await confirm("token_hash=abc&type=email&next=/portal");

    expect(response.headers.get("location")).toBe("https://app.nos.dev/portal");
  });

  it("blocks an open redirect", async () => {
    const response = await confirm(
      "token_hash=abc&type=email&next=//site-externo.com",
    );

    expect(response.headers.get("location")).toBe("https://app.nos.dev/");
  });

  it("sends an expired or invalid link back to the login", async () => {
    auth.verifyOtp.mockResolvedValue({
      data: {},
      error: { code: "otp_expired", status: 403 },
    });

    const response = await confirm("token_hash=velho&type=email");

    expect(response.headers.get("location")).toBe(
      "https://app.nos.dev/login?error=link",
    );
  });

  it.each(["type=email", "token_hash=abc", "token_hash=abc&type=signup"])(
    "rejects a malformed link (%s) without calling Supabase",
    async (query) => {
      const response = await confirm(query);

      expect(auth.verifyOtp).not.toHaveBeenCalled();
      expect(response.headers.get("location")).toBe(
        "https://app.nos.dev/login?error=link",
      );
    },
  );
});

describe("GET /auth/confirm with the remembered next", () => {
  it("returns to the page the user asked for and clears the cookie", async () => {
    const response = await confirm(
      "token_hash=abc&type=email",
      "/console/seixu",
    );

    expect(response.headers.get("location")).toBe(
      "https://app.nos.dev/console/seixu",
    );
    expect(response.cookies.get(NEXT_COOKIE)).toMatchObject({
      value: "",
      path: "/auth/confirm",
    });
  });

  it("prefers the next in the link over the cookie", async () => {
    const response = await confirm(
      "token_hash=abc&type=email&next=/portal",
      "/console",
    );

    expect(response.headers.get("location")).toBe("https://app.nos.dev/portal");
  });

  it("never follows an unsafe cookie", async () => {
    const response = await confirm(
      "token_hash=abc&type=email",
      "//evil.example",
    );

    expect(response.headers.get("location")).toBe("https://app.nos.dev/");
  });
});
