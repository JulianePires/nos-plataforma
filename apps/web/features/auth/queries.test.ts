import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "./queries";

const supabase = vi.hoisted(() => {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  return {
    query,
    client: {
      auth: { getClaims: vi.fn(), getSession: vi.fn() },
      from: vi.fn(() => query),
    },
  };
});

vi.mock("../../lib/supabase/server", () => ({
  createClient: () => Promise.resolve(supabase.client),
}));

beforeEach(() => {
  vi.clearAllMocks();
  supabase.query.select.mockReturnValue(supabase.query);
  supabase.query.eq.mockReturnValue(supabase.query);
});

describe("getCurrentUser", () => {
  it("returns null without a valid session and skips the profile read", async () => {
    supabase.client.auth.getClaims.mockResolvedValue({
      data: null,
      error: null,
    });

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(supabase.client.from).not.toHaveBeenCalled();
  });

  it("reads the signed-in user's own profile", async () => {
    supabase.client.auth.getClaims.mockResolvedValue({
      data: { claims: { sub: "user-1" } },
      error: null,
    });
    supabase.query.maybeSingle.mockResolvedValue({
      data: { id: "user-1", full_name: "Equipe Nós", role: "team" },
      error: null,
    });

    await expect(getCurrentUser()).resolves.toEqual({
      id: "user-1",
      fullName: "Equipe Nós",
      role: "team",
    });
    expect(supabase.client.from).toHaveBeenCalledWith("profiles");
    expect(supabase.query.select).toHaveBeenCalledWith("id, full_name, role");
    expect(supabase.query.eq).toHaveBeenCalledWith("id", "user-1");
    expect(supabase.client.auth.getSession).not.toHaveBeenCalled();
  });

  it("treats a session without a readable profile as signed out", async () => {
    supabase.client.auth.getClaims.mockResolvedValue({
      data: { claims: { sub: "user-1" } },
      error: null,
    });
    supabase.query.maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(getCurrentUser()).resolves.toBeNull();
  });
});
