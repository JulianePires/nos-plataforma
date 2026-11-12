// Browsers read "//host" and "/\host" as another origin, so only a single leading slash is safe.
export function safeNext(next: string | null): string {
  if (
    !next?.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/";
  }
  return next;
}
