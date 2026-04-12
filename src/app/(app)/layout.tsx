import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNavbar } from "@/components/app-navbar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
      <AppNavbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
