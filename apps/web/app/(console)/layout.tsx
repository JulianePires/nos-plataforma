import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ConsoleShell } from "../../components/shell/console-shell";
import { UserMenu } from "../../components/shell/user-menu";
import { resolveAccess } from "../../features/auth/access";
import { getCurrentUser } from "../../features/auth/queries";
import { PATHNAME_HEADER } from "../../lib/supabase/proxy";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, requestHeaders] = await Promise.all([
    getCurrentUser(),
    headers(),
  ]);
  const access = resolveAccess({
    area: "console",
    role: user?.role ?? null,
    path: requestHeaders.get(PATHNAME_HEADER) ?? "/console",
  });
  if (access !== "allow") redirect(access);
  // resolveAccess only lets a signed-in user into the console; this narrows the type.
  if (!user) redirect("/login");

  return (
    <ConsoleShell
      userMenu={<UserMenu name={user.fullName} userRole={user.role} />}
    >
      {children}
    </ConsoleShell>
  );
}
