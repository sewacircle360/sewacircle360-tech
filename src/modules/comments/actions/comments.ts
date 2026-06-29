"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getComments(params: { taskId?: string; ticketId?: string; projectId?: string }) {
  try {
    return await db.comment.findMany({
      where: {
        OR: [
          params.taskId ? { taskId: params.taskId } : {},
          params.ticketId ? { ticketId: params.ticketId } : {},
          params.projectId ? { projectId: params.projectId } : {},
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("getComments error:", error);
    return [];
  }
}

export async function createComment(data: {
  content: string;
  userName: string;
  userId: string;
  taskId?: string;
  ticketId?: string;
  projectId?: string;
}) {
  try {
    if (!data.content.trim()) {
      return { error: "Comment content cannot be empty." };
    }

    const comment = await db.comment.create({
      data: {
        content: data.content,
        userName: data.userName,
        userId: data.userId,
        taskId: data.taskId || null,
        ticketId: data.ticketId || null,
        projectId: data.projectId || null,
      }
    });

    revalidatePath("/admin/projects");
    revalidatePath("/admin/tickets");
    revalidatePath("/portal");
    
    if (data.projectId) {
      revalidatePath(`/admin/projects/${data.projectId}`);
      // Find the project's slug to revalidate the slug route as well!
      const project = await db.project.findUnique({ where: { id: data.projectId }, select: { slug: true } });
      if (project?.slug) {
        revalidatePath(`/admin/projects/${project.slug}`);
      }
    }
    if (data.ticketId) {
      revalidatePath(`/admin/tickets/${data.ticketId}`);
      revalidatePath(`/portal/tickets/${data.ticketId}`);
    }

    return { success: "Comment posted!", comment };
  } catch (error) {
    console.error("createComment error:", error);
    return { error: "Failed to post comment." };
  }
}
