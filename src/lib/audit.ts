import { db } from "@/lib/db";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function logAuditEvent(action: string, details: string) {
  try {
    const session = await auth();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    let userId = session?.user?.id;

    if (!userId) {
      // Fallback: link to the first active super admin if a guest/system action occurs
      const systemUser = await db.user.findFirst({
        where: { role: { name: "SUPER_ADMIN" } }
      });
      if (systemUser) {
        userId = systemUser.id;
      }
    }

    if (userId) {
      await db.auditLog.create({
        data: {
          userId,
          action,
          details,
          ipAddress: ip
        }
      });
    }
  } catch (error) {
    console.error("logAuditEvent error:", error);
  }
}
