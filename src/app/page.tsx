import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HomeLoginForm } from "@/components/home-login-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  // Logged-in users go straight to the dashboard (no landing + "Go to dashboard" step).
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:gap-10 sm:py-24">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Task workflow</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Task submission
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Submit tasks, track history, and manage your work from one simple dashboard—built with Next.js,
          Prisma, and PostgreSQL.
        </p>
      </div>

      <HomeLoginForm />
    </div>
  );
}
