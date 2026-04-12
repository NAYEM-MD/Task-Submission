/** Exactly four selectable tasks for the Start page (`/tasks`). */
export const PREDEFINED_TASKS = [
  "kitchen",
  "Bathroom",
  "Toilet",
  "Dustbin",
] as const;

export type PredefinedTaskName = (typeof PREDEFINED_TASKS)[number];
