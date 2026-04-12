import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "History",
};

export const dynamic = "force-dynamic";

function displayUsername(name: string | null, email: string) {
  return name?.trim() || email;
}

type HistoryItem = {
  id: string;
  taskNames: string[];
  username: string;
  dateStr: string;
  timeStr: string;
};

export default async function HistoryPage() {
  const rows = await prisma.taskSubmission.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const items: HistoryItem[] = rows.map((row) => {
    const d = row.submittedAt;
    const dateStr = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeStr = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const username =
      row.submitterDisplayName || displayUsername(row.user.name, row.user.email);
    return {
      id: row.id,
      taskNames: row.taskNames,
      username,
      dateStr,
      timeStr,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          History
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          All submitted tasks, newest first.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No submissions yet. Go to Start to submit your first one.
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards — no horizontal scroll */}
          <ul className="space-y-3 md:hidden">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {item.taskNames.length > 1 ? "Tasks" : "Task"}
                    </dt>
                    <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                      <ul className="list-inside list-disc space-y-1 break-words">
                        {item.taskNames.map((name) => (
                          <li key={`${item.id}-${name}`}>{name}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Name
                    </dt>
                    <dd className="mt-0.5 break-words text-zinc-800 dark:text-zinc-200">{item.username}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Date
                      </dt>
                      <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">{item.dateStr}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Time
                      </dt>
                      <dd className="mt-0.5 tabular-nums text-zinc-700 dark:text-zinc-300">{item.timeStr}</dd>
                    </div>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          {/* md+: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-0 text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Tasks</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                      <td className="max-w-[20rem] px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        <span className="break-words">{item.taskNames.join(", ")}</span>
                      </td>
                      <td className="max-w-[12rem] break-words px-4 py-3 text-zinc-700 dark:text-zinc-300">
                        {item.username}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {item.dateStr}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                        {item.timeStr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
