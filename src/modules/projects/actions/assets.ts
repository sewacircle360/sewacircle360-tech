"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addProjectAsset(
  projectId: string,
  name: string,
  url: string,
  category: string
) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { assets: true, slug: true }
    });

    if (!project) {
      return { error: "Project not found." };
    }

    const currentAssets = Array.isArray(project.assets) ? project.assets : [];
    const newAsset = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      url,
      category,
      date: new Date().toISOString(),
    };

    const updatedAssets = [newAsset, ...currentAssets];

    await db.project.update({
      where: { id: projectId },
      data: { assets: updatedAssets }
    });

    revalidatePath("/admin/projects");
    if (project.slug) {
      revalidatePath(`/admin/projects/${project.slug}`);
    }
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/portal");

    return { success: "Asset link added successfully!", asset: newAsset };
  } catch (error) {
    console.error("addProjectAsset error:", error);
    return { error: "Failed to add asset." };
  }
}

export async function deleteProjectAsset(projectId: string, assetId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { assets: true, slug: true }
    });

    if (!project) {
      return { error: "Project not found." };
    }

    const currentAssets = Array.isArray(project.assets) ? project.assets : [];
    const updatedAssets = currentAssets.filter((asset: any) => asset.id !== assetId);

    await db.project.update({
      where: { id: projectId },
      data: { assets: updatedAssets }
    });

    revalidatePath("/admin/projects");
    if (project.slug) {
      revalidatePath(`/admin/projects/${project.slug}`);
    }
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/portal");

    return { success: "Asset link deleted." };
  } catch (error) {
    console.error("deleteProjectAsset error:", error);
    return { error: "Failed to delete asset." };
  }
}
