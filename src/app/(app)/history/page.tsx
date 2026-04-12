import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "History",
};

export const dynamic = "force-dynamic";

function displayUsername(name: string | null, email: string) {
  return name?.trim() || email;
}

export default async function HistoryPage() {
  const rows = await prisma.taskSubmission.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
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
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="min-w-[36rem] text-left text-xs sm:text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-600 sm:text-xs dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3">Task</th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3">Date</th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3">Time</th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3">Username</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rows.map((row) => {
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
                    row.submitterDisplayName ||
                    displayUsername(row.user.name, row.user.email);
                  return (
                    <tr key={row.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium text-zinc-900 sm:px-4 sm:py-3 dark:text-zinc-100">
                        {row.taskName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-zinc-600 sm:px-4 sm:py-3 dark:text-zinc-400">
                        {dateStr}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-zinc-600 sm:px-4 sm:py-3 dark:text-zinc-400">
                        {timeStr}
                      </td>
                      <td className="max-w-[10rem] truncate whitespace-nowrap px-3 py-2.5 text-zinc-600 sm:max-w-none sm:px-4 sm:py-3 dark:text-zinc-400">
                        {username}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
