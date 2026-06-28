"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPages() {
  try {
    return await db.page.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getPages error:", error);
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    return await db.page.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("getPageBySlug error:", error);
    return null;
  }
}

export async function createPage(title: string, slug: string) {
  try {
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-/]/g, "").trim();
    
    const existing = await db.page.findUnique({ where: { slug: formattedSlug } });
    if (existing) {
      return { error: "A page with this slug already exists." };
    }

    const page = await db.page.create({
      data: {
        title,
        slug: formattedSlug,
        status: "DRAFT",
      },
    });

    revalidatePath("/");
    return { success: "Page created successfully!", page };
  } catch (error) {
    console.error("createPage error:", error);
    return { error: "Failed to create page." };
  }
}

export async function updatePageMetadata(
  id: string,
  data: { metaTitle?: string | null; metaDescription?: string | null; status?: string }
) {
  try {
    const page = await db.page.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath(`/${page.slug}`);
    return { success: "Metadata updated successfully!", page };
  } catch (error) {
    console.error("updatePageMetadata error:", error);
    return { error: "Failed to update page metadata." };
  }
}

export async function savePageSections(
  pageId: string, 
  sections: { type: string; order: number; content: any }[]
) {
  try {
    // Delete existing sections for this page
    await db.section.deleteMany({
      where: { pageId },
    });

    // Create new sections in bulk
    const createdSections = await Promise.all(
      sections.map((sec) =>
        db.section.create({
          data: {
            pageId,
            type: sec.type,
            order: sec.order,
            content: sec.content,
          },
        })
      )
    );

    const page = await db.page.findUnique({ where: { id: pageId } });
    if (page) {
      revalidatePath("/");
      revalidatePath(`/${page.slug}`);
    }

    return { success: "Sections saved successfully!", sections: createdSections };
  } catch (error) {
    console.error("savePageSections error:", error);
    return { error: "Failed to save sections." };
  }
}
