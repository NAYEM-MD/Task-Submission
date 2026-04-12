import Link from "next/link";

const cards = [
  {
    href: "/tasks",
    title: "Start",
    description: "Choose from four tasks and submit your selections.",
  },
  {
    href: "/history",
    title: "History",
    description: "View all submissions, newest first.",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Pick where you want to go next.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-900/50"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {card.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
