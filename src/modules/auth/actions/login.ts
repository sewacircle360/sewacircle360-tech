"use server";

import { signIn } from "@/auth";
import { LoginSchema, LoginInput } from "../schemas";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";

export async function loginAction(values: LoginInput) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields entered." };
  }

  const { email, password } = validatedFields.data;

  try {
    // NextAuth signIn with redirect: false returns result without throwing NEXT_REDIRECT
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const user = await db.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      return { error: "Account not found." };
    }

    if (user.mustChangePassword) {
      return { success: "Redirecting...", redirectTo: "/auth/change-password" };
    }

    if (user.role.name === "CLIENT") {
      return { success: "Redirecting...", redirectTo: "/portal" };
    } else if (user.role.name === "STUDENT") {
      return { success: "Redirecting...", redirectTo: "/student" };
    } else {
      return { success: "Redirecting...", redirectTo: "/admin" };
    }
  } catch (error) {
    console.error("loginAction error detail:", error);

    let errorDetail = "Invalid email or password.";
    if (error instanceof Error) {
      errorDetail = error.message;
    }

    return { error: `Sign in failed: ${errorDetail}` };
  }
}
