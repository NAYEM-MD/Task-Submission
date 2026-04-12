export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      {children}
    </div>
  );
}
