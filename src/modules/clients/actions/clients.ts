"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { logAuditEvent } from "@/lib/audit";

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

    // Auto-create User account with CLIENT role for portal logins
    const portalPass = data.portalPassword || "123456789";
    const clientRole = await db.role.findUnique({ where: { name: "CLIENT" } });
    if (!clientRole) {
      return { error: "CLIENT role does not exist. Run seed script first." };
    }

    const hashedPassword = await bcrypt.hash(portalPass, 10);
    const user = await db.user.create({
      data: {
        name: data.ownerName,
        email: data.email,
        passwordHash: hashedPassword,
        roleId: clientRole.id,
        status: "ACTIVE",
        mustChangePassword: true, // Force password update on first login
      }
    });
    userId = user.id;

    // Send email with credentials to client
    await sendEmail({
      to: data.email,
      subject: "Your SewaCircle360 Client Portal Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to SewaCircle360 Client Portal</h2>
          <p>Hello ${data.ownerName},</p>
          <p>A client workspace has been created for your project. You can access your project milestones, invoices, and sign agreements using the login details below:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="https://sewacircle360tech.online/auth/login">https://sewacircle360tech.online/auth/login</a></p>
            <p style="margin: 5px 0;"><strong>Username / Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${portalPass}</p>
          </div>
          <p style="color: #ef4444; font-size: 11px;">Note: You will be prompted to change your password immediately upon your first login for security.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
        </div>
      `
    }).catch(err => console.error("Client email trigger failed:", err));

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

    await logAuditEvent("CREATE_CLIENT", `Created client profile: ${data.companyName} (${data.ownerName})`);

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
