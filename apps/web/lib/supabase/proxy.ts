import type { Database } from "@nos/db";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { safeNext } from "../../features/auth/safe-next";
import { getPublicEnv } from "../env";

export const PATHNAME_HEADER = "x-pathname";
export const NEXT_COOKIE = "nos-next";
export const NEXT_COOKIE_PATH = "/auth/confirm";

// Layouts cannot see the URL, so the requested path rides along as a request header.
// It is always overwritten here, so a client-sent value never reaches the server.
function forward(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(
    PATHNAME_HEADER,
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.next({ request: { headers } });
}

export async function updateSession(request: NextRequest) {
  const env = getPublicEnv();
  let response = forward(request);

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = forward(request);
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          // Keeps CDNs from caching a response that carries a session cookie.
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // getClaims validates the JWT signature; getSession would trust a spoofed cookie.
  await supabase.auth.getClaims();

  rememberNext(request, response);
  return response;
}

// The e-mail link only carries the origin ({{ .RedirectTo }}), so the destination waits in a
// cookie scoped to /auth/confirm. It lives as long as the OTP (otp_expiry) and only works on
// the browser that asked for the link; other devices land on the role's home.
function rememberNext(request: NextRequest, response: NextResponse) {
  if (request.nextUrl.pathname !== "/login") return;

  const next = safeNext(request.nextUrl.searchParams.get("next"));
  if (next !== "/") {
    response.cookies.set(NEXT_COOKIE, next, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: NEXT_COOKIE_PATH,
      maxAge: 3600,
    });
  } else if (request.cookies.has(NEXT_COOKIE)) {
    response.cookies.delete({ name: NEXT_COOKIE, path: NEXT_COOKIE_PATH });
  }
}
