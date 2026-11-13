import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PortalHeader } from "../../components/shell/portal-header";
import { UserMenu } from "../../components/shell/user-menu";
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
  // resolveAccess only lets a signed-in user into the portal; this narrows the type.
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-bg text-text">
      <PortalHeader
        userMenu={<UserMenu name={user.fullName} userRole={user.role} />}
      />
      <main className="mx-auto max-w-[70rem] px-4 py-5 md:px-7 md:py-7">
        {children}
      </main>
    </div>
  );
}
