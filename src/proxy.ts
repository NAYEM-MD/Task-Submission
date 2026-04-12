import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

/**
 * Next.js 16+ network boundary (replaces deprecated `middleware.ts`).
 * Same auth logic; default export is supported for proxy.
 * @see https://nextjs.org/docs/app/building-your-application/routing/proxy
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

  const isProtected =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/tasks") ||
    nextUrl.pathname.startsWith("/history");

  if (isProtected && !isLoggedIn) {
    const login = new URL("/login", nextUrl.origin);
    login.searchParams.set("callbackUrl", `${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
