import NextAuth from "next-auth";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        
        try {
          const user = await db.user.findUnique({
            where: { email },
            include: { role: true },
          });

          if (!user || !user.passwordHash) return null;
          if (user.status !== "ACTIVE") return null;

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
          if (!passwordsMatch) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            mustChangePassword: user.mustChangePassword,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          if (error instanceof Error) {
            throw new Error(`Authorize failed: ${error.message}`);
          }
          throw new Error(`Authorize failed: ${String(error)}`);
        }
      },
    }),
  ],
});
