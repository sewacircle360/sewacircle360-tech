"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getClients() {
  try {
    return await db.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: {
          select: { projects: true, invoices: true }
        }
      }
    });
  } catch (error) {
    console.error("getClients error:", error);
    return [];
  }
}

export async function getClientById(id: string) {
  try {
    return await db.client.findUnique({
      where: { id },
      include: {
        user: true,
        projects: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
        agreements: { orderBy: { createdAt: "desc" } },
        tickets: { orderBy: { createdAt: "desc" } },
      }
    });
  } catch (error) {
    console.error("getClientById error:", error);
    return null;
  }
}

export async function getClientByUserId(userId: string) {
  try {
    return await db.client.findUnique({
      where: { userId },
      include: {
        projects: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
        agreements: { orderBy: { createdAt: "desc" } },
        tickets: { orderBy: { createdAt: "desc" } },
      }
    });
  } catch (error) {
    console.error("getClientByUserId error:", error);
    return null;
  }
}

export async function createClient(data: {
  companyName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  gst?: string;
  country?: string;
  createPortalAccess?: boolean;
  portalPassword?: string;
}) {
  try {
    const existing = await db.client.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: "A client with this email already exists." };
    }

    let userId: string | undefined;

    // Optional: Auto-create User account with CLIENT role for portal logins
    if (data.createPortalAccess && data.portalPassword) {
      const clientRole = await db.role.findUnique({ where: { name: "CLIENT" } });
      if (!clientRole) {
        return { error: "CLIENT role does not exist. Run seed script first." };
      }

      const hashedPassword = await bcrypt.hash(data.portalPassword, 10);
      const user = await db.user.create({
        data: {
          name: data.ownerName,
          email: data.email,
          passwordHash: hashedPassword,
          roleId: clientRole.id,
          status: "ACTIVE",
        }
      });
      userId = user.id;
    }

    const client = await db.client.create({
      data: {
        companyName: data.companyName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        gst: data.gst || null,
        country: data.country || null,
        userId: userId || null,
      }
    });

    revalidatePath("/admin/clients");
    return { success: "Client created successfully!", client };
  } catch (error) {
    console.error("createClient error:", error);
    return { error: "Failed to create client." };
  }
}

export async function deleteClient(id: string) {
  try {
    const client = await db.client.findUnique({ where: { id } });
    if (client && client.userId) {
      // Clean up portal user too
      await db.user.delete({ where: { id: client.userId } });
    }

    await db.client.delete({ where: { id } });
    revalidatePath("/admin/clients");
    return { success: "Client profile deleted successfully!" };
  } catch (error) {
    console.error("deleteClient error:", error);
    return { error: "Failed to delete client." };
  }
}
