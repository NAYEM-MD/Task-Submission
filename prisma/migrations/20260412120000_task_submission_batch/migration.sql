-- One row per submit: store all selected task labels in a Postgres text array.

ALTER TABLE "TaskSubmission" ADD COLUMN "taskNames" TEXT[];

UPDATE "TaskSubmission" SET "taskNames" = ARRAY["taskName"] WHERE "taskNames" IS NULL;

ALTER TABLE "TaskSubmission" ALTER COLUMN "taskNames" SET NOT NULL;

ALTER TABLE "TaskSubmission" DROP COLUMN "taskName";
