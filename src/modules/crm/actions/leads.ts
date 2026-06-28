"use server";

import { db } from "@/lib/db";
import { LeadSchema, LeadInput } from "../schemas";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

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
    
    console.log(`CRM Alert: New Lead created with ID ${lead.id}. Email: ${lead.email}`);

    // Send confirmation email via Resend
    await sendEmail({
      to: lead.email,
      subject: "Project Inquiry Received | SewaCircle360 Tech",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Inquiry Received</h2>
          <p>Hello <strong>${lead.name}</strong>,</p>
          <p>Thank you for reaching out to SewaCircle360 Tech. We have received your project details and registered them in our CRM pipeline.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Requested Service:</strong> ${lead.service}</p>
            <p style="margin: 5px 0;"><strong>Est. Budget:</strong> ${lead.budget}</p>
            <p style="margin: 5px 0;"><strong>Est. Timeline:</strong> ${lead.timeline}</p>
          </div>
          <p>A solutions architect will review your project scope and contact you shortly.</p>
          <br/>
          <p style="font-size: 12px; color: #64748b;">This is an automated notification from SewaCircle360 Tech.</p>
        </div>
      `
    }).catch(err => console.error("Lead confirmation email failed to send:", err));

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
