import type { Database } from "@nos/db";

export type Role = Database["public"]["Enums"]["app_role"];
export type Area = "console" | "portal" | "public";

export function homeFor(role: Role): "/console" | "/portal" {
  return role === "client" ? "/portal" : "/console";
}

// The only access rule in the app: layouts call it, nothing else decides who enters an area.
export function resolveAccess({
  area,
  role,
  path,
}: {
  area: Area;
  role: Role | null;
  path: string;
}): "allow" | `/${string}` {
  if (area === "public") return "allow";
  if (role === null) return `/login?next=${encodeURIComponent(path)}`;
  if (area === "console" && role === "client") return "/portal";
  return "allow";
}
