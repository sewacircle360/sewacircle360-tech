"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Clients
export async function getClients() {
  try {
    return await db.client.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getClients error:", error);
    return [];
  }
}

// Projects
export async function createProjectAction(data: {
  name: string;
  clientId: string;
  startDate?: string;
  deadline?: string;
  budget?: number;
  status?: string;
}) {
  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        budget: data.budget || 0,
        status: data.status || "PLANNING",
        progress: 0
      }
    });

    revalidatePath("/admin/projects");
    return { success: "Project created successfully!", project };
  } catch (error) {
    console.error("createProjectAction error:", error);
    return { error: "Failed to create project." };
  }
}

// Invoices
export async function getInvoices() {
  try {
    return await db.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    return [];
  }
}

// Quotations
export async function getQuotations() {
  try {
    return await db.quotation.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getQuotations error:", error);
    return [];
  }
}

// Agreements
export async function getAgreements() {
  try {
    return await db.agreement.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getAgreements error:", error);
    return [];
  }
}

// Meetings
export async function getMeetings() {
  try {
    return await db.meeting.findMany({
      orderBy: { preferredDate: "desc" }
    });
  } catch (error) {
    console.error("getMeetings error:", error);
    return [];
  }
}

// Audit Logs
export async function getAuditLogs() {
  try {
    return await db.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getAuditLogs error:", error);
    return [];
  }
}
