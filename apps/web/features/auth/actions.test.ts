import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestMagicLink, signOut } from "./actions";

const auth = vi.hoisted(() => ({
  signInWithOtp: vi.fn(),
  signOut: vi.fn(),
}));

const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
);

vi.mock("next/navigation", () => ({ redirect }));

vi.mock("../../lib/supabase/server", () => ({
  createClient: () => Promise.resolve({ auth }),
}));

const requestHeaders = vi.hoisted(() => ({ current: new Headers() }));

vi.mock("next/headers", () => ({
  headers: () => Promise.resolve(requestHeaders.current),
}));

function formWith(email: string) {
  const form = new FormData();
  form.set("email", email);
  return form;
}

beforeEach(() => {
  requestHeaders.current = new Headers({ origin: "https://preview.nos.dev" });
  auth.signInWithOtp.mockReset();
  auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
});

describe("requestMagicLink", () => {
  it("sends the link to an existing user without creating accounts", async () => {
    const state = await requestMagicLink(
      { status: "idle" },
      formWith("cliente@nos.local"),
    );

    expect(state).toEqual({ status: "sent" });
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "cliente@nos.local",
      options: {
        shouldCreateUser: false,
        emailRedirectTo: "https://preview.nos.dev",
      },
    });
  });

  it("lets Supabase fall back to the site URL when the origin is missing", async () => {
    requestHeaders.current = new Headers();

    await requestMagicLink({ status: "idle" }, formWith("cliente@nos.local"));

    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "cliente@nos.local",
      options: { shouldCreateUser: false },
    });
  });

  it.each([
    ["an unknown e-mail", "otp_disabled", 422],
    ["the send-frequency limit", "over_email_send_rate_limit", 429],
    ["the per-IP limit", "over_request_rate_limit", 429],
  ])(
    "answers %s exactly like a successful send",
    async (_case, code, status) => {
      auth.signInWithOtp.mockResolvedValue({
        data: {},
        error: { code, status },
      });

      const state = await requestMagicLink(
        { status: "idle" },
        formWith("ninguem@exemplo.com"),
      );

      expect(state).toEqual({ status: "sent" });
    },
  );

  it("returns the field error and sends nothing for an invalid e-mail", async () => {
    const state = await requestMagicLink(
      { status: "idle" },
      formWith("nao-e-email"),
    );

    expect(state).toEqual({
      status: "invalid",
      error: "Informe um e-mail válido.",
    });
    expect(auth.signInWithOtp).not.toHaveBeenCalled();
  });
});

describe("signOut", () => {
  it("ends the session and sends the user to /login", async () => {
    auth.signOut.mockResolvedValue({ error: null });

    await expect(signOut()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(auth.signOut).toHaveBeenCalledOnce();
  });
});
