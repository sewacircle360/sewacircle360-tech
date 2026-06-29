"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function completeTaskAction(taskId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const task = await db.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return { error: "Task not found" };
    }

    // Verify employee is assigned to the task
    if ((session.user as any).role === "EMPLOYEE" && task.assignedToId !== session.user.id) {
      return { error: "Access denied" };
    }

    await db.task.update({
      where: { id: taskId },
      data: { status: "DONE" }
    });

    revalidatePath("/admin");
    revalidatePath("/employee");
    return { success: true };
  } catch (error: any) {
    console.error("Complete task action error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
