import { createClient } from "../../lib/supabase/server";
import type { Role } from "./access";

export type CurrentUser = {
  id: string;
  fullName: string | null;
  role: Role;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  // getClaims verifies the JWT; getSession would trust whatever the cookie says.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return null;

  return { id: profile.id, fullName: profile.full_name, role: profile.role };
}
