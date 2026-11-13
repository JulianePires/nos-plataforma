import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveAccess } from "../../features/auth/access";
import { getCurrentUser } from "../../features/auth/queries";
import { PATHNAME_HEADER } from "../../lib/supabase/proxy";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, requestHeaders] = await Promise.all([
    getCurrentUser(),
    headers(),
  ]);
  const access = resolveAccess({
    area: "portal",
    role: user?.role ?? null,
    path: requestHeaders.get(PATHNAME_HEADER) ?? "/portal",
  });
  if (access !== "allow") redirect(access);

  return children;
}
