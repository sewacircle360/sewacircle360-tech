"use server";

import { db } from "@/lib/db";
import { LeadSchema, LeadInput } from "../schemas";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    return await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getLeads error:", error);
    return [];
  }
}

export async function createLeadAction(values: LeadInput) {
  const validatedFields = LeadSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid form values submitted." };
  }

  const data = validatedFields.data;

  try {
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        companyName: data.companyName || null,
        whatsapp: data.whatsapp || null,
        country: data.country || null,
        service: data.service,
        budget: data.budget,
        timeline: data.timeline,
        source: "WEBSITE",
        status: "NEW",
        priority: "LOW",
      },
    });

    // Revalidate CRM views
    revalidatePath("/admin/crm");
    
    // In production, trigger Render SMTP email automation here
    console.log(`CRM Alert: New Lead created with ID ${lead.id}. Email: ${lead.email}`);

    return { success: "Thank you! Your project request has been submitted.", leadId: lead.id };
  } catch (error) {
    console.error("createLeadAction error:", error);
    return { error: "System encountered an error creating your lead. Please try again." };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const lead = await db.lead.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/crm");
    return { success: `Lead status updated to ${status}`, lead };
  } catch (error) {
    console.error("updateLeadStatus error:", error);
    return { error: "Failed to update lead status." };
  }
}

export async function updateLeadPriority(id: string, priority: string) {
  try {
    const lead = await db.lead.update({
      where: { id },
      data: { priority },
    });
    revalidatePath("/admin/crm");
    return { success: `Lead priority updated to ${priority}`, lead };
  } catch (error) {
    console.error("updateLeadPriority error:", error);
    return { error: "Failed to update lead priority." };
  }
}

export async function deleteLead(id: string) {
  try {
    await db.lead.delete({
      where: { id },
    });
    revalidatePath("/admin/crm");
    return { success: "Lead deleted successfully!" };
  } catch (error) {
    console.error("deleteLead error:", error);
    return { error: "Failed to delete lead." };
  }
}
