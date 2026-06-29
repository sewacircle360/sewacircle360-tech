"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

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
        expenses: { orderBy: { date: "desc" } },
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
        expenses: { orderBy: { date: "desc" } },
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
      data: { status },
      include: { client: true }
    });

    if (project.client) {
      await sendEmail({
        to: project.client.email,
        subject: `Project Stage Update: ${project.name} is now in ${status} | SewaCircle360`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
              <h2 style="color: #3b82f6; margin: 0; font-size: 22px;">Project Progress Update</h2>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">SewaCircle360 Active Timeline</p>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">Hello <strong>${project.client.ownerName}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">We have updated the phase for your project: <strong>${project.name}</strong>.</p>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <table style="width: 100%; font-size: 13px; color: #1e3a5f;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Project Name:</strong></td>
                  <td style="text-align: right; font-weight: bold;">${project.name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>New Stage:</strong></td>
                  <td style="text-align: right; color: #2563eb; font-weight: bold; text-transform: uppercase;">${status}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Current Progress:</strong></td>
                  <td style="text-align: right; color: #2563eb; font-weight: bold;">${project.progress}%</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'https://sewacircle360tech.online'}/portal" style="background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(59,130,246,0.1);">Track in Client Portal</a>
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 25px;">
              Your project dashboard timeline has been updated dynamically. If you have any feedback or questions, feel free to get in touch.
            </p>
          </div>
        `
      }).catch(err => console.error("Email send warning:", err));
    }

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
