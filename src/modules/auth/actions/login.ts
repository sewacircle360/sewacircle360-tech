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

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password. Please check your credentials." };
        default:
          return { error: "Authentication failed. Please try again." };
      }
    }
    
    console.error("Login Server Action Error:", error);
    return { error: "An unexpected system error occurred. Please try again." };
  }
}
