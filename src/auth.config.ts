import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/employee");
      const isOnClientPortal = nextUrl.pathname.startsWith("/portal");
      const isOnStudentPortal = nextUrl.pathname.startsWith("/student");
      
      if (isLoggedIn) {
        const user = auth.user as any;
        if (user.mustChangePassword && nextUrl.pathname !== "/auth/change-password" && !nextUrl.pathname.startsWith("/api/auth")) {
          if (isOnDashboard || isOnClientPortal || isOnStudentPortal) {
            return Response.redirect(new URL("/auth/change-password", nextUrl));
          }
        }
      }

      if (isOnDashboard || isOnClientPortal || isOnStudentPortal) {
        if (isLoggedIn) {
          const role = (auth.user as any).role;
          if (isOnDashboard && (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "EMPLOYEE")) {
            if (role === "CLIENT") return Response.redirect(new URL("/portal", nextUrl));
            if (role === "STUDENT") return Response.redirect(new URL("/student", nextUrl));
            return Response.redirect(new URL(`/auth/login?middleware_error=DashboardRoleMismatch&role=${role}`, nextUrl));
          }
          if (isOnClientPortal && role !== "CLIENT" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
            return Response.redirect(new URL(`/auth/login?middleware_error=ClientRoleMismatch&role=${role}`, nextUrl));
          }
          if (isOnStudentPortal && role !== "STUDENT" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
            return Response.redirect(new URL(`/auth/login?middleware_error=StudentRoleMismatch&role=${role}`, nextUrl));
          }
          return true;
        }
        return Response.redirect(new URL("/auth/login?middleware_error=NotLoggedIn", nextUrl));
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
  providers: [], // Overwritten in auth.ts
} satisfies NextAuthConfig;
