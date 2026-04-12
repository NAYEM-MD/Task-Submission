import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AUTH_SESSION_MAX_AGE, authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Persist login across browser restarts (Vercel + local). Without cookie maxAge, Auth.js
  // defaults omit Max-Age → session-only cookie → feels like logout when the browser closes.
  cookies: {
    sessionToken: {
      options: {
        maxAge: AUTH_SESSION_MAX_AGE,
      },
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) return null;

        const email = String(emailRaw).trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await compare(String(passwordRaw), user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null | undefined;
      }
      return session;
    },
  },
});
