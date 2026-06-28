"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await db.product.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

export async function createProduct(data: {
  name: string;
  slug: string;
  category: string;
  description: string;
  version?: string;
  logoUrl?: string;
  demoUrl?: string;
  liveUrl?: string;
  features: any[];
  pricingPlans: any[];
  changelog?: any[];
}) {
  try {
    const formattedSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "").trim();

    const existing = await db.product.findUnique({ where: { slug: formattedSlug } });
    if (existing) {
      return { error: "A product with this slug already exists." };
    }

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: formattedSlug,
        category: data.category,
        description: data.description,
        version: data.version || "1.0.0",
        status: "LIVE",
        logoUrl: data.logoUrl || null,
        demoUrl: data.demoUrl || null,
        liveUrl: data.liveUrl || null,
        features: data.features,
        pricingPlans: data.pricingPlans,
        changelog: data.changelog || [],
      }
    });

    revalidatePath("/products");
    revalidatePath(`/products/${formattedSlug}`);
    return { success: "Product registered successfully!", product };
  } catch (error) {
    console.error("createProduct error:", error);
    return { error: "Failed to create product." };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
    version?: string;
    status?: string;
    logoUrl?: string;
    demoUrl?: string;
    liveUrl?: string;
    features?: any[];
    pricingPlans?: any[];
    changelog?: any[];
  }
) {
  try {
    const product = await db.product.update({
      where: { id },
      data,
    });

    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return { success: "Product updated successfully!", product };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { error: "Failed to update product." };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.delete({
      where: { id },
    });
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return { success: "Product deleted successfully!" };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { error: "Failed to delete product." };
  }
}
