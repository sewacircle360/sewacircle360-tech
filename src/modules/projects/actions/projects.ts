"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Generate a URL-friendly slug from a project name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

// Ensure slug is unique by appending a number if needed
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (
    await db.project.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined } })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

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
        invoices: { orderBy: { createdAt: "desc" } },
      }
    });
  } catch (error) {
    console.error("getProjectById error:", error);
    return null;
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await db.project.findUnique({
      where: { slug },
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
        invoices: { orderBy: { createdAt: "desc" } },
      }
    });
  } catch (error) {
    console.error("getProjectBySlug error:", error);
    return null;
  }
}

// Lookup by slug OR by ID (handles legacy projects without slugs)
export async function getProjectBySlugOrId(slugOrId: string) {
  // Try slug first
  let project = await getProjectBySlug(slugOrId);
  // If not found, try by ID (legacy projects without slug)
  if (!project) {
    project = await getProjectById(slugOrId);
  }
  return project;
}

export async function createProject(data: {
  name: string;
  clientId: string;
  managerId?: string;
  startDate?: Date;
  deadline?: Date;
  budget?: number;
  status?: string;
  developerIds?: string[];
  designerIds?: string[];
}) {
  try {
    const baseSlug = generateSlug(data.name);
    const slug = await uniqueSlug(baseSlug);

    const project = await db.project.create({
      data: {
        name: data.name,
        slug,
        clientId: data.clientId,
        managerId: data.managerId || null,
        startDate: data.startDate || null,
        deadline: data.deadline || null,
        budget: data.budget || null,
        developerIds: data.developerIds || [],
        designerIds: data.designerIds || [],
        status: data.status || "PLANNING",
        progress: 0,
      }
    });

    revalidatePath("/admin/projects");
    return { success: "Project created successfully!", projectId: project.id, slug: project.slug };
  } catch (error) {
    console.error("createProject error:", error);
    return { error: "Failed to create project." };
  }
}

export async function updateProject(id: string, data: {
  name?: string;
  status?: string;
  progress?: number;
  budget?: number;
  deadline?: Date;
}) {
  try {
    // If name changed, regenerate slug
    let slug: string | undefined;
    if (data.name) {
      const base = generateSlug(data.name);
      slug = await uniqueSlug(base, id);
    }

    const project = await db.project.update({
      where: { id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
      }
    });
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${project.slug || project.id}`);
    return { success: "Project updated!", project };
  } catch (error) {
    console.error("updateProject error:", error);
    return { error: "Failed to update project." };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    return { success: "Project deleted successfully." };
  } catch (error) {
    console.error("deleteProject error:", error);
    return { error: "Failed to delete project." };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    const project = await db.project.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/admin/projects/${project.slug || project.id}`);
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
    revalidatePath(`/admin/projects/${project.slug || project.id}`);
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
    revalidatePath(`/admin/projects`);
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
    revalidatePath(`/admin/projects`);
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
    revalidatePath(`/admin/projects`);
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
    revalidatePath(`/admin/projects`);
    return { success: "Task status updated!", task };
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    return { error: "Failed to update task." };
  }
}
