"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Project Query and Mutation Actions
export async function getProjects() {
  try {
    return await db.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        manager: true,
      }
    });
  } catch (error) {
    console.error("getProjects error:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    return await db.project.findUnique({
      where: { id },
      include: {
        client: true,
        manager: true,
        developers: true,
        designers: true,
        milestones: { orderBy: { dueDate: "asc" } },
        tasks: { 
          orderBy: { dueDate: "asc" },
          include: { assignedTo: true }
        },
      }
    });
  } catch (error) {
    console.error("getProjectById error:", error);
    return null;
  }
}

export async function createProject(data: {
  name: string;
  clientId: string;
  managerId?: string;
  startDate?: Date;
  deadline?: Date;
  budget?: number;
  developerIds?: string[];
  designerIds?: string[];
}) {
  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        managerId: data.managerId || null,
        startDate: data.startDate || null,
        deadline: data.deadline || null,
        budget: data.budget || null,
        developerIds: data.developerIds || [],
        designerIds: data.designerIds || [],
        status: "PLANNING",
        progress: 0,
      }
    });

    revalidatePath("/admin/projects");
    return { success: "Project created successfully!", projectId: project.id };
  } catch (error) {
    console.error("createProject error:", error);
    return { error: "Failed to create project." };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    const project = await db.project.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/admin/projects");
    return { success: "Project status updated!", project };
  } catch (error) {
    console.error("updateProjectStatus error:", error);
    return { error: "Failed to update project status." };
  }
}

export async function updateProjectProgress(id: string, progress: number) {
  try {
    const project = await db.project.update({
      where: { id },
      data: { progress }
    });
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/admin/projects");
    return { success: "Project progress updated!", project };
  } catch (error) {
    console.error("updateProjectProgress error:", error);
    return { error: "Failed to update project progress." };
  }
}

// Milestone Actions
export async function createMilestone(data: {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: Date;
}) {
  try {
    const milestone = await db.milestone.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate || null,
        status: "PENDING",
      }
    });
    revalidatePath(`/admin/projects/${data.projectId}`);
    return { success: "Milestone created successfully!", milestone };
  } catch (error) {
    console.error("createMilestone error:", error);
    return { error: "Failed to create milestone." };
  }
}

export async function updateMilestoneStatus(id: string, projectId: string, status: string) {
  try {
    const milestone = await db.milestone.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: "Milestone status updated!", milestone };
  } catch (error) {
    console.error("updateMilestoneStatus error:", error);
    return { error: "Failed to update milestone." };
  }
}

// Task Actions
export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  assignedToId?: string;
  priority?: string;
  dueDate?: Date;
}) {
  try {
    const task = await db.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        assignedToId: data.assignedToId || null,
        priority: data.priority || "LOW",
        status: "TODO",
        dueDate: data.dueDate || null,
      }
    });
    revalidatePath(`/admin/projects/${data.projectId}`);
    return { success: "Task created successfully!", task };
  } catch (error) {
    console.error("createTask error:", error);
    return { error: "Failed to create task." };
  }
}

export async function updateTaskStatus(id: string, projectId: string, status: string) {
  try {
    const task = await db.task.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: "Task status updated!", task };
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    return { error: "Failed to update task." };
  }
}
