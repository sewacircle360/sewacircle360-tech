"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const studentRole = await db.role.findUnique({ where: { name: "STUDENT" } });
    if (!studentRole) return [];

    return await db.user.findMany({
      where: { roleId: studentRole.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getStudents error:", error);
    return [];
  }
}

export async function updateStudentStatus(id: string, status: string) {
  try {
    if (!["ACTIVE", "SUSPENDED", "BLOCKED", "INACTIVE"].includes(status)) {
      return { error: "Invalid status value." };
    }

    await db.user.update({
      where: { id },
      data: { status }
    });

    revalidatePath("/admin/students");
    return { success: "Student status updated successfully!" };
  } catch (error) {
    console.error("updateStudentStatus error:", error);
    return { error: "Failed to update student status." };
  }
}

export async function deleteStudent(id: string) {
  try {
    await db.user.delete({
      where: { id }
    });
    revalidatePath("/admin/students");
    return { success: "Student account deleted successfully!" };
  } catch (error) {
    console.error("deleteStudent error:", error);
    return { error: "Failed to delete student account." };
  }
}
