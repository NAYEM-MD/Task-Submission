"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PREDEFINED_TASKS } from "@/lib/tasks";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export type SubmitTasksResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitTasks(taskNames: string[]): Promise<SubmitTasksResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, error: "You must be signed in to submit tasks." };
  }

  const submitterDisplayName =
    session.user?.name?.trim() || session.user?.email?.trim() || "User";

  const allowed = new Set<string>([...PREDEFINED_TASKS]);
  const valid = taskNames.filter((n) => allowed.has(n));

  if (valid.length === 0) {
    return { ok: false, error: "Select one or more tasks from the list." };
  }

  await prisma.taskSubmission.create({
    data: {
      taskNames: valid,
      userId,
      submitterDisplayName,
    },
  });

  revalidatePath("/history");
  revalidatePath("/tasks");

  return {
    ok: true,
    message:
      valid.length === 1
        ? "1 task submitted successfully."
        : `${valid.length} tasks submitted successfully.`,
  };
}
