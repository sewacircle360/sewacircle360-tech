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

export async function convertLeadToProjectAction(leadId: string) {
  try {
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return { error: "Lead not found." };
    }

    // 1. Check or Create Client
    let client = await db.client.findFirst({ where: { email: lead.email } });
    if (!client) {
      client = await db.client.create({
        data: {
          companyName: lead.companyName || `${lead.name} Company`,
          ownerName: lead.name,
          email: lead.email,
          phone: lead.phone || null,
        }
      });
    }

    // 2. Parse Budget
    let cleanBudget = 0;
    if (lead.budget) {
      // Remove symbols and commas and convert to float
      const numString = lead.budget.replace(/[^0-9.]/g, "");
      cleanBudget = parseFloat(numString) || 0;
    }

    // 3. Generate Project Slug
    const baseSlug = (lead.service || `${lead.name} Project`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

    let slug = baseSlug;
    let counter = 1;
    while (await db.project.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 4. Create Project
    const project = await db.project.create({
      data: {
        name: lead.service || `${lead.name} Project`,
        slug,
        clientId: client.id,
        budget: cleanBudget > 0 ? cleanBudget : null,
        status: "PLANNING",
        progress: 0,
      }
    });

    // 5. Create Draft SLA Agreement
    const agreementNumber = `SLA-${Date.now().toString().slice(-4)}`;
    await db.agreement.create({
      data: {
        agreementNumber,
        clientId: client.id,
        title: `SLA Agreement for ${project.name}`,
        status: "DRAFT",
        content: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h1 style="color: #2563eb; text-align: center;">Service Level Agreement (SLA)</h1>
            <p style="text-align: center; font-size: 12px; color: #64748b;">Agreement Number: <strong>${agreementNumber}</strong></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
            <p>This Agreement is entered into by and between <strong>SewaCircle360 Technology</strong> (Service Provider) and <strong>${client.companyName}</strong> (Client).</p>
            
            <h3 style="color: #0f172a; margin-top: 20px;">1. Project Scope</h3>
            <p>The Service Provider agrees to deliver the following engineering services: <strong>${project.name}</strong> as outlined in the initial proposal. The estimated project budget is <strong>₹${(cleanBudget || 0).toLocaleString("en-IN")}</strong>.</p>
            
            <h3 style="color: #0f172a; margin-top: 20px;">2. Development & Milestones</h3>
            <p>Work phases will progress dynamically from Planning, Design, Engineering, QA Testing, and Deployment Launch. Deliverables will be verified inside the Client Portal Workspace.</p>
            
            <h3 style="color: #0f172a; margin-top: 20px;">3. Service Support & Standards</h3>
            <p>The Service Provider guarantees a 99.9% uptime standard for client staging builds. General support requests and issue tickets can be logged dynamically in the workspace.</p>
            
            <h3 style="color: #0f172a; margin-top: 20px;">4. Signatures</h3>
            <p>Please review and sign this SLA digitally inside your client workspace dashboard to initialize development cycles.</p>
          </div>
        `
      }
    });

    // 6. Delete/Archive or leave lead, update status to WON
    await db.lead.update({
      where: { id: leadId },
      data: { status: "WON" }
    });

    revalidatePath("/admin/crm");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/clients");
    revalidatePath("/admin/agreements");

    return { success: "Lead successfully converted to Client & Project!", projectId: project.id, slug: project.slug };
  } catch (error) {
    console.error("convertLeadToProjectAction error:", error);
    return { error: "Failed to convert lead to project." };
  }
}

export async function addLeadNoteAction(leadId: string, text: string) {
  try {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      select: { notes: true }
    });

    if (!lead) {
      return { error: "Lead not found." };
    }

    const currentNotes = Array.isArray(lead.notes) ? lead.notes : [];
    const newNote = {
      id: Math.random().toString(36).substring(2, 11),
      text,
      date: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...currentNotes];

    const updatedLead = await db.lead.update({
      where: { id: leadId },
      data: { notes: updatedNotes }
    });

    revalidatePath("/admin/crm");
    return { success: "Note added successfully!", note: newNote, lead: updatedLead };
  } catch (error) {
    console.error("addLeadNoteAction error:", error);
    return { error: "Failed to add lead note." };
  }
}
