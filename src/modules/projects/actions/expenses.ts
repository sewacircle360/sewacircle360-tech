"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExpensesByProjectId(projectId: string) {
  try {
    return await db.expense.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("getExpensesByProjectId error:", error);
    return [];
  }
}

export async function addExpense(data: {
  projectId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}) {
  try {
    const expense = await db.expense.create({
      data: {
        projectId: data.projectId,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date,
      },
      include: {
        project: true
      }
    });

    revalidatePath("/admin/projects");
    if (expense.project.slug) {
      revalidatePath(`/admin/projects/${expense.project.slug}`);
    }
    revalidatePath(`/admin/projects/${expense.projectId}`);
    return { success: "Expense logged successfully!", expense };
  } catch (error) {
    console.error("addExpense error:", error);
    return { error: "Failed to log expense." };
  }
}

export async function deleteExpense(expenseId: string, projectId: string) {
  try {
    const expense = await db.expense.delete({
      where: { id: expenseId },
      include: { project: true }
    });

    revalidatePath("/admin/projects");
    if (expense.project.slug) {
      revalidatePath(`/admin/projects/${expense.project.slug}`);
    }
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: "Expense deleted successfully!" };
  } catch (error) {
    console.error("deleteExpense error:", error);
    return { error: "Failed to delete expense." };
  }
}
