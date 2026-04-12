"use server";

import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AuthFormState = {
  error?: string;
};

function safeCallbackUrl(raw: FormDataEntryValue | null): string {
  const s = typeof raw === "string" ? raw : "";
  if (!s.startsWith("/") || s.startsWith("//")) return "/dashboard";
  return s;
}

export async function registerUser(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const passwordHash = await hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "That email is already registered." };
    }
    throw e;
  }

  redirect("/?registered=1");
}

export async function loginUser(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    // With `redirect: false`, server `signIn` returns the redirect URL as a string on success
    // (see next-auth/lib/actions.js). It is NOT `{ ok: boolean }` like the client helper.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: callbackUrl,
    });

    if (typeof result === "string") {
      const failed = result.includes("error=") || /[?&]error\b/i.test(result);
      if (failed) {
        return { error: "Invalid email or password." };
      }
      redirect(callbackUrl);
    }

    return { error: "Invalid email or password." };
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}
