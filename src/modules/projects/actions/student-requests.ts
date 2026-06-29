"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createStudentProjectRequest(data: {
  studentName: string;
  studentEmail: string;
  collegeName: string;
  projectTitle: string;
  description: string;
}) {
  try {
    if (!data.studentName || !data.studentEmail || !data.collegeName || !data.projectTitle || !data.description) {
      return { error: "Please fill out all required fields." };
    }

    const request = await db.studentProjectRequest.create({
      data: {
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        collegeName: data.collegeName,
        projectTitle: data.projectTitle,
        description: data.description,
        status: "PENDING",
      }
    });

    revalidatePath("/admin/academic-requests");
    return { success: "Your project training request has been submitted successfully! We will get in touch with you shortly.", request };
  } catch (error) {
    console.error("createStudentProjectRequest error:", error);
    return { error: "Failed to submit request. Please try again." };
  }
}

export async function getStudentProjectRequests() {
  try {
    return await db.studentProjectRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getStudentProjectRequests error:", error);
    return [];
  }
}

export async function updateStudentProjectRequestStatus(id: string, status: string) {
  try {
    await db.studentProjectRequest.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/academic-requests");
    return { success: "Request status updated successfully!" };
  } catch (error) {
    console.error("updateStudentProjectRequestStatus error:", error);
    return { error: "Failed to update status." };
  }
}

export async function deleteStudentProjectRequest(id: string) {
  try {
    await db.studentProjectRequest.delete({
      where: { id },
    });
    revalidatePath("/admin/academic-requests");
    return { success: "Request deleted successfully!" };
  } catch (error) {
    console.error("deleteStudentProjectRequest error:", error);
    return { error: "Failed to delete request." };
  }
}
