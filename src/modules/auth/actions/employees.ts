"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createEmployee(data: { name: string; email: string }) {
  try {
    if (!data.name || !data.email) {
      return { error: "Name and email address are required." };
    }

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: "A user account with this email already exists." };
    }

    const employeeRole = await db.role.findUnique({ where: { name: "EMPLOYEE" } });
    if (!employeeRole) {
      return { error: "EMPLOYEE role does not exist in the database. Run seed first." };
    }

    // Default password as requested: 123456789
    const hashedPassword = await bcrypt.hash("123456789", 10);

    const employee = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        roleId: employeeRole.id,
        status: "ACTIVE",
        mustChangePassword: true, // Forces password update on first login
      }
    });

    revalidatePath("/admin/employees");
    return { success: "Employee registered successfully! Default login password is: 123456789", employee };
  } catch (error) {
    console.error("createEmployee error:", error);
    return { error: "Failed to register employee." };
  }
}

export async function getEmployees() {
  try {
    const employeeRole = await db.role.findUnique({ where: { name: "EMPLOYEE" } });
    if (!employeeRole) return [];

    return await db.user.findMany({
      where: { roleId: employeeRole.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getEmployees error:", error);
    return [];
  }
}

export async function deleteEmployee(id: string) {
  try {
    await db.user.delete({
      where: { id }
    });
    revalidatePath("/admin/employees");
    return { success: "Employee account removed successfully!" };
  } catch (error) {
    console.error("deleteEmployee error:", error);
    return { error: "Failed to delete employee account." };
  }
}
