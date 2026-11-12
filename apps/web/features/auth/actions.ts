"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { magicLinkSchema } from "./schema";

export type MagicLinkState =
  | { status: "idle" }
  | { status: "invalid"; error: string }
  | { status: "sent" };

export async function requestMagicLink(
  _previous: MagicLinkState,
  form: FormData,
): Promise<MagicLinkState> {
  const parsed = magicLinkSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) {
    return { status: "invalid", error: parsed.error.issues[0]?.message ?? "" };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  // Errors are ignored on purpose: unknown users fail with otp_disabled while only existing
  // users can hit the send-frequency limit, so surfacing either would reveal who has an account.
  // The template links to {{ .RedirectTo }}, so each preview gets its own link; Supabase only
  // honours origins on its redirect allow list and falls back to the site URL otherwise.
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      ...(origin && { emailRedirectTo: origin }),
    },
  });

  return { status: "sent" };
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
