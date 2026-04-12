import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/actions/app";
import { NavLinks } from "@/components/nav-links";

export async function AppNavbar() {
  const session = await auth();
  const label = session?.user?.name || session?.user?.email || "Account";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/95 pt-[max(0px,env(safe-area-inset-top))] shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
      <div className="mx-auto flex min-h-14 max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/dashboard"
            className="shrink-0 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Task submission
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 sm:border-t-0 sm:pt-0">
          <span className="min-w-0 flex-1 truncate text-xs text-zinc-500 dark:text-zinc-400 sm:max-w-[12rem] sm:text-right">
            {label}
          </span>
          <form action={logout} className="shrink-0">
            <button
              type="submit"
              className="min-h-11 min-w-[4.75rem] touch-manipulation rounded-full border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
