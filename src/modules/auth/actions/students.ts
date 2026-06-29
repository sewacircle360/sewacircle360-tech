"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";
import { logAuditEvent } from "@/lib/audit";

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

export async function verifyStudentDocumentsAction(id: string, actionType: "APPROVE" | "REJECT", reason?: string) {
  try {
    const student = await db.user.findUnique({
      where: { id }
    });

    if (!student) {
      return { error: "Student not found." };
    }

    if (actionType === "APPROVE") {
      await db.user.update({
        where: { id },
        data: { status: "ACTIVE" }
      });

      await sendEmail({
        to: student.email,
        subject: "Documents Approved: Your SewaCircle360 Account is Active!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #22c55e; text-align: center;">Registration Approved!</h2>
            <p>Hello ${student.name},</p>
            <p>Great news! Your uploaded profile credentials and college ID card have been successfully reviewed and verified by our academic board.</p>
            <p>Your student portal account is now **ACTIVE**. You can log in using the button below to start tracking your project training modules:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://sewacircle360tech.online/auth/login" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Login to Student Portal</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
          </div>
        `
      }).catch(err => console.error("Student approve email trigger failed:", err));

      await logAuditEvent("VERIFY_STUDENT_APPROVE", `Approved credentials and college ID for student: ${student.name} (${student.email})`);

      revalidatePath("/admin/students");
      return { success: "Student documents approved and activated!" };
    } else {
      // Rejection status: reset to INACTIVE
      await db.user.update({
        where: { id },
        data: { status: "INACTIVE" }
      });

      const rejectionReason = reason || "The uploaded ID card image is blurry or matches invalid credentials.";

      await sendEmail({
        to: student.email,
        subject: "Action Required: Registration Document Issue",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #ef4444; text-align: center;">Document Verification Issue</h2>
            <p>Hello ${student.name},</p>
            <p>Your uploaded profile picture or college ID card could not be verified by our administrative team.</p>
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: bold;">Reason for Rejection:</p>
              <p style="margin: 5px 0 0 0; color: #7f1d1d;">${rejectionReason}</p>
            </div>
            <p>Please log back into your registration workspace to re-upload your correct, high-quality college ID card scan and profile photo:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://sewacircle360tech.online/auth/login" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Re-upload Documents</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
          </div>
        `
      }).catch(err => console.error("Student reject email trigger failed:", err));

      await logAuditEvent("VERIFY_STUDENT_REJECT", `Rejected credentials and college ID for student: ${student.name} (${student.email}). Reason: ${rejectionReason}`);

      revalidatePath("/admin/students");
      return { success: "Student documents rejected. Alert email dispatched." };
    }
  } catch (error) {
    console.error("verifyStudentDocumentsAction error:", error);
    return { error: "Failed to verify student documents." };
  }
}
