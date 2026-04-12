import type { Metadata } from "next";
import { TasksForm } from "./tasks-form";

export const metadata: Metadata = {
  title: "Start",
};

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Start
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Select one or more tasks, then submit. Each selection is saved with your account and a
          timestamp.
        </p>
      </div>
      <TasksForm />
    </div>
  );
}
