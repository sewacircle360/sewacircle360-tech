"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { logAuditEvent } from "@/lib/audit";

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

    // Send email with credentials to employee
    await sendEmail({
      to: data.email,
      subject: "Your SewaCircle360 Employee Portal Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to SewaCircle360 Team</h2>
          <p>Hello ${data.name},</p>
          <p>An employee portal account has been created for you. You can log in using the details below to view assigned tasks, client project boards, and consultations:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="https://sewacircle360tech.online/auth/login">https://sewacircle360tech.online/auth/login</a></p>
            <p style="margin: 5px 0;"><strong>Username / Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> 123456789</p>
          </div>
          <p style="color: #ef4444; font-size: 11px;">Note: You will be prompted to change your password immediately upon your first login for security.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
        </div>
      `
    }).catch(err => console.error("Employee email trigger failed:", err));

    await logAuditEvent("REGISTER_EMPLOYEE", `Registered employee account: ${data.name} (${data.email})`);

    revalidatePath("/admin/employees");
    return { success: "Employee registered successfully! Default login password is: 123456789", employee };
  } catch (error) {
    console.error("createEmployee error:", error);
    return { error: "Failed to register employee." };
  }
}

export async function getEmployees() {
  try {
    const roles = await db.role.findMany({
      where: {
        name: { in: ["EMPLOYEE", "ADMIN", "SUPER_ADMIN"] }
      }
    });
    const roleIds = roles.map(r => r.id);

    return await db.user.findMany({
      where: { roleId: { in: roleIds } },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getEmployees error:", error);
    return [];
  }
}

export async function updateEmployeeIdCard(
  id: string,
  data: {
    employeeId: string;
    designation: string;
    bloodGroup: string;
    joiningDate: string;
    emergencyContact: string;
    phone: string;
    image?: string;
  }
) {
  try {
    if (data.employeeId) {
      const existing = await db.user.findFirst({
        where: {
          employeeId: data.employeeId,
          id: { not: id }
        }
      });
      if (existing) {
        return { error: "This Employee ID is already assigned to another user." };
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        employeeId: data.employeeId || null,
        designation: data.designation || null,
        bloodGroup: data.bloodGroup || null,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
        emergencyContact: data.emergencyContact || null,
        phone: data.phone || null,
        image: data.image || undefined,
      }
    });

    revalidatePath("/admin/employees");
    return { success: "ID Card details updated successfully!", employee: updated };
  } catch (error) {
    console.error("updateEmployeeIdCard error:", error);
    return { error: "Failed to update ID Card details." };
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
