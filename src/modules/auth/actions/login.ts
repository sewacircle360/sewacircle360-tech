"use server";

import { signIn } from "@/auth";
import { LoginSchema, LoginInput } from "../schemas";
import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";

export async function loginAction(values: LoginInput) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields entered." };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin",
    });
    
    return { success: "Logged in successfully!" };
  } catch (error) {
    // Auth.js redirects by throwing a NEXT_REDIRECT error. We must let this bubble up!
    unstable_rethrow(error);

    console.error("loginAction error detail:", error);

    let errorDetail = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorDetail = error.message;
      if ((error as any).type) {
        errorDetail += ` (type: ${(error as any).type})`;
      }
    } else {
      errorDetail = String(error);
    }

    return { error: `Authentication Error: ${errorDetail}` };
  }
}
