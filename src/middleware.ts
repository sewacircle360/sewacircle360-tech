import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  // 1. If logged in as an Employee and tries to access /admin (and NOT internally rewritten), redirect to /employee
  if (
    isLoggedIn && 
    role === "EMPLOYEE" && 
    nextUrl.pathname.startsWith("/admin") &&
    nextUrl.searchParams.get("internal_masked") !== "true"
  ) {
    const newPath = nextUrl.pathname.replace("/admin", "/employee");
    return NextResponse.redirect(new URL(newPath, nextUrl));
  }

  // 2. If logged in as an Admin/Client/Student and tries to access /employee, redirect to /admin
  if (isLoggedIn && role !== "EMPLOYEE" && nextUrl.pathname.startsWith("/employee")) {
    const newPath = nextUrl.pathname.replace("/employee", "/admin");
    return NextResponse.redirect(new URL(newPath, nextUrl));
  }

  // 3. Rewrite /employee to /admin internally for Next.js to render /admin routes (mark as internal_masked)
  if (nextUrl.pathname.startsWith("/employee")) {
    const targetPath = nextUrl.pathname.replace("/employee", "/admin");
    const targetUrl = new URL(targetPath, nextUrl);
    targetUrl.searchParams.set("internal_masked", "true");
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Match all paths except API routes, static asserts, images, favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|assets|logo.svg).*)"],
};
