"use client";

import { useState, useTransition } from "react";
import { submitTasks } from "@/actions/app";
import { PREDEFINED_TASKS } from "@/lib/tasks";

export function TasksForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
    setBanner(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);
    if (selected.length === 0) {
      setBanner({ type: "error", text: "Select at least one task before submitting." });
      return;
    }
    startTransition(async () => {
      const result = await submitTasks(selected);
      if (result.ok) {
        setBanner({ type: "success", text: result.message });
        setSelected([]);
      } else {
        setBanner({ type: "error", text: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {banner && (
        <div
          role="alert"
          className={
            banner.type === "success"
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
          }
        >
          {banner.text}
        </div>
      )}

      <fieldset className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <legend className="sr-only">Selectable tasks</legend>
        <ul className="space-y-3">
          {PREDEFINED_TASKS.map((name) => {
            const id = `task-${name.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <li key={name}>
                <label
                  htmlFor={id}
                  className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-3 transition hover:bg-zinc-50 sm:min-h-0 sm:py-2 dark:hover:bg-zinc-800/80"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={selected.includes(name)}
                    onChange={() => toggle(name)}
                    className="mt-0.5 size-5 shrink-0 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 sm:mt-1 sm:size-4 dark:border-zinc-600"
                  />
                  <span className="text-base font-medium text-zinc-900 sm:text-sm dark:text-zinc-100">
                    {name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full touch-manipulation rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:w-auto sm:text-sm"
      >
        {isPending ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
