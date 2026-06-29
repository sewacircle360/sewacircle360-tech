"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createJobPosition(data: {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}) {
  try {
    if (!data.title || !data.department || !data.location || !data.type || !data.description) {
      return { error: "Please provide all required fields." };
    }

    const job = await db.jobPosition.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
      }
    });

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    return { success: "Job position published successfully!", job };
  } catch (error) {
    console.error("createJobPosition error:", error);
    return { error: "Failed to publish job position." };
  }
}

export async function getJobPositions() {
  try {
    return await db.jobPosition.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getJobPositions error:", error);
    return [];
  }
}

export async function deleteJobPosition(id: string) {
  try {
    await db.jobPosition.delete({
      where: { id }
    });
    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    return { success: "Job position removed successfully!" };
  } catch (error) {
    console.error("deleteJobPosition error:", error);
    return { error: "Failed to remove job position." };
  }
}
