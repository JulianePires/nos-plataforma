const BASE = "https://nos.invalid";

// Resolves next the way the browser will (it drops tabs and newlines, and reads "\" as "/"),
// so "/\t/evil.example" cannot slip through as "//evil.example". /auth/ is refused too, in any
// case or encoding: a planted /auth/confirm link would sign the victim in to the attacker's account.
export function safeNext(next: string | null): string {
  if (!next?.startsWith("/")) return "/";

  const url = new URL(next, BASE);
  if (url.origin !== BASE || isAuthPath(url.pathname)) return "/";

  return url.pathname + url.search + url.hash;
}

function isAuthPath(pathname: string): boolean {
  try {
    return decodeURIComponent(pathname).toLowerCase().startsWith("/auth/");
  } catch {
    return true; // Malformed percent-encoding: refuse rather than guess what the router sees.
  }
}
