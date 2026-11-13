import { type NextRequest, NextResponse } from "next/server";
import { safeNext } from "../../../features/auth/safe-next";
import { NEXT_COOKIE, NEXT_COOKIE_PATH } from "../../../lib/supabase/proxy";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");

  // Only the magic-link template points here; other OTP types get their own flow when they exist.
  if (tokenHash && searchParams.get("type") === "email") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (!error) {
      const next = safeNext(
        searchParams.get("next") ??
          request.cookies.get(NEXT_COOKIE)?.value ??
          null,
      );
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.delete({ name: NEXT_COOKIE, path: NEXT_COOKIE_PATH });
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=link", request.url));
}
