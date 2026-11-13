import type { ReactNode } from "react";

export function PortalHeader({ userMenu }: { userMenu: ReactNode }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-[70rem] items-center justify-between gap-4 px-4 md:px-7">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-text">Nós</span>
          <span className="font-mono text-xs text-text-muted">
            Portal do cliente
          </span>
        </div>
        <div className="min-w-0">{userMenu}</div>
      </div>
    </header>
  );
}
