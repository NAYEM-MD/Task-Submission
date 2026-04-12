import type { NextAuthConfig } from "next-auth";

/** JWT + cookie lifetime (seconds). Same value must be set on the session cookie `maxAge` or the browser treats it as a session cookie (cleared when the browser app closes). */
export const AUTH_SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Edge-safe auth options (no Prisma). Used by `src/proxy.ts`.
 * Full auth with credentials + DB lives in `auth.ts`.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: AUTH_SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
};
