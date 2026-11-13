"use client";

import { Button } from "@nos/seixu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useState } from "react";

// Only routes that exist; new modules add their item together with the route.
const groups = [
  {
    label: "Sistema",
    items: [
      { href: "/console", label: "Início", exact: true },
      { href: "/console/seixu", label: "Seixu", exact: false },
    ],
  },
] as const;

function isCurrent(pathname: string, href: string, exact: boolean) {
  return exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function ConsoleShell({
  userMenu,
  children,
}: {
  userMenu: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const drawerId = useId();
  const buttonId = useId();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Any navigation closes the drawer, including the browser's back button.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  function close() {
    setOpen(false);
    document.getElementById(buttonId)?.focus();
  }

  // The drawer sits before the button in the DOM, so focus has to be moved into it on open.
  useEffect(() => {
    if (!open) return;
    const drawer = document.getElementById(drawerId);
    const target =
      drawer?.querySelector<HTMLElement>('a[aria-current="page"]') ??
      drawer?.querySelector<HTMLElement>("a");
    target?.focus();
  }, [open, drawerId]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-text">
      <aside
        id={drawerId}
        data-open={open}
        className={
          "flex w-58 shrink-0 flex-col overflow-y-auto border-r border-border bg-linear-to-b from-surface to-bg " +
          "max-[760px]:invisible max-[760px]:fixed max-[760px]:inset-y-0 max-[760px]:left-0 max-[760px]:z-40 " +
          "max-[760px]:-translate-x-full max-[760px]:transition-[translate,visibility] motion-reduce:transition-none " +
          "max-[760px]:data-[open=true]:visible max-[760px]:data-[open=true]:translate-x-0"
        }
      >
        <div className="flex flex-col border-b border-border px-4.5 py-4 leading-tight">
          <span className="text-sm font-semibold">Nós Console</span>
          <span className="font-mono text-xs text-text-muted">
            Desenvolvimento Criativo
          </span>
        </div>

        <nav aria-label="Console" className="flex-1 px-2.5 pt-2.5 pb-4">
          {groups.map((group) => (
            <div key={group.label} className="mt-3.5">
              <p className="px-2.5 pb-1.5 text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setOpen(false);
                      }}
                      aria-current={
                        isCurrent(pathname, item.href, item.exact)
                          ? "page"
                          : undefined
                      }
                      className={
                        "group flex items-center gap-2.5 rounded-sm px-2.5 py-1.75 text-sm text-text-muted " +
                        "hover:bg-surface-3 hover:text-text " +
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
                        "aria-[current=page]:bg-accent-blue/15 aria-[current=page]:font-medium aria-[current=page]:text-accent-blue"
                      }
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-0.75 rounded-full group-aria-[current=page]:bg-accent-blue"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-4.5 py-3.5">{userMenu}</div>
      </aside>

      {open && (
        <div
          data-testid="drawer-scrim"
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-30 bg-bg/70 min-[760px]:hidden"
        />
      )}

      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center gap-2.5 border-b border-border bg-surface px-4 py-2.5 min-[760px]:hidden">
          <Button
            id={buttonId}
            variant="secondary"
            size="sm"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => {
              setOpen(true);
            }}
          >
            Menu
          </Button>
          <span className="text-sm font-semibold">Nós Console</span>
        </div>
        <main className="mx-auto max-w-[70rem] px-7 py-7 max-[760px]:px-4 max-[760px]:py-5">
          {children}
        </main>
      </div>
    </div>
  );
}
