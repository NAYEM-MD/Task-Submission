"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser, type AuthFormState } from "@/actions/auth";

const initial: AuthFormState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/dashboard";

  const [state, formAction, pending] = useActionState(loginUser, initial);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Log in
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Use the email and password you registered with.
        </p>
      </div>

      {registered === "1" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
        >
          Account created. You can sign in below.
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base text-zinc-900 shadow-sm outline-none ring-violet-500 focus:border-violet-500 focus:ring-2 sm:min-h-0 sm:py-2 sm:text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base text-zinc-900 shadow-sm outline-none ring-violet-500 focus:border-violet-500 focus:ring-2 sm:min-h-0 sm:py-2 sm:text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 w-full touch-manipulation rounded-full bg-violet-600 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:py-2.5 sm:text-sm"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link href="/signup" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
