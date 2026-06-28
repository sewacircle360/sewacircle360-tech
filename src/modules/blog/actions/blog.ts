"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBlogPosts() {
  try {
    return await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
  } catch (error) {
    console.error("getBlogPosts error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await db.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });
  } catch (error) {
    console.error("getBlogPostBySlug error:", error);
    return null;
  }
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  category: string;
  tags?: string[];
}) {
  try {
    const formattedSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "").trim();

    const existing = await db.blogPost.findUnique({ where: { slug: formattedSlug } });
    if (existing) {
      return { error: "A post with this slug already exists." };
    }

    const post = await db.blogPost.create({
      data: {
        title: data.title,
        slug: formattedSlug,
        content: data.content,
        featuredImage: data.featuredImage || null,
        authorId: data.authorId,
        category: data.category,
        tags: data.tags || [],
        status: "PUBLISHED",
      }
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${formattedSlug}`);
    return { success: "Blog post published successfully!", post };
  } catch (error) {
    console.error("createBlogPost error:", error);
    return { error: "Failed to publish blog post." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const post = await db.blogPost.delete({
      where: { id },
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: "Blog post deleted successfully!" };
  } catch (error) {
    console.error("deleteBlogPost error:", error);
    return { error: "Failed to delete blog post." };
  }
}
