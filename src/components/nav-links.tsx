"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Start" },
  { href: "/history", label: "History" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm sm:gap-x-2">
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "rounded-lg bg-violet-100 px-3 py-2 font-medium text-violet-900 touch-manipulation sm:px-2.5 sm:py-1 dark:bg-violet-950/60 dark:text-violet-100"
                : "rounded-lg px-3 py-2 text-zinc-600 touch-manipulation transition hover:bg-zinc-100 hover:text-zinc-900 sm:px-2.5 sm:py-1 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
