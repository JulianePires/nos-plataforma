import { Button } from "@nos/seixu";
import type { Role } from "../../features/auth/access";
import { signOut } from "../../features/auth/actions";

const roleLabel: Record<Role, string> = {
  admin: "Admin",
  team: "Equipe",
  client: "Cliente",
};

export function UserMenu({
  name,
  userRole,
}: {
  name: string | null;
  userRole: Role;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-text">
          {name ?? roleLabel[userRole]}
        </span>
        {name && (
          <span className="text-xs text-text-muted">{roleLabel[userRole]}</span>
        )}
      </div>
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm">
          Sair
        </Button>
      </form>
    </div>
  );
}
