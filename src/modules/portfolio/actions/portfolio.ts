"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPortfolioProjects() {
  try {
    return await db.portfolioProject.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getPortfolioProjects error:", error);
    return [];
  }
}

export async function createPortfolioProject(data: {
  name: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  coverUrl: string;
}) {
  try {
    const formattedSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "").trim();

    const existing = await db.portfolioProject.findUnique({ where: { slug: formattedSlug } });
    if (existing) {
      return { error: "A portfolio project with this slug already exists." };
    }

    const project = await db.portfolioProject.create({
      data: {
        name: data.name,
        slug: formattedSlug,
        description: data.description,
        category: data.category,
        technologies: data.technologies,
        liveUrl: data.liveUrl || null,
        coverUrl: data.coverUrl,
      }
    });

    revalidatePath("/portfolio");
    return { success: "Portfolio project registered successfully!", project };
  } catch (error) {
    console.error("createPortfolioProject error:", error);
    return { error: "Failed to create portfolio project." };
  }
}

export async function deletePortfolioProject(id: string) {
  try {
    await db.portfolioProject.delete({
      where: { id },
    });
    revalidatePath("/portfolio");
    return { success: "Portfolio project deleted successfully!" };
  } catch (error) {
    console.error("deletePortfolioProject error:", error);
    return { error: "Failed to delete portfolio project." };
  }
}
