import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ScrollLock } from "@/components/dashboard/ScrollLock";
import { AdminDashboardShell } from "@/components/dashboard/AdminDashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double layer route protection in Server Component
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const role = (session.user as any).role || "Super Admin";
  const name = session.user.name;

  return (
    <>
      <ScrollLock />
      <AdminDashboardShell role={role} name={name}>
        {children}
      </AdminDashboardShell>
    </>
  );
}
