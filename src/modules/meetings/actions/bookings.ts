"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

export async function getMeetings() {
  try {
    return await db.meeting.findMany({
      orderBy: { preferredDate: "asc" },
      include: { assignedEmployee: true },
    });
  } catch (error) {
    console.error("getMeetings error:", error);
    return [];
  }
}

export async function bookMeetingAction(data: {
  name: string;
  email: string;
  meetingType: string;
  preferredDate: Date;
  preferredTime: string;
  timezone: string;
  details?: string;
  budget?: string;
}) {
  try {
    // 1. Create a Meeting record in MongoDB Atlas
    const meeting = await db.meeting.create({
      data: {
        name: data.name,
        email: data.email,
        meetingType: data.meetingType,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        timezone: data.timezone,
        details: data.details || null,
        status: "PENDING",
      }
    });

    // 2. Automatically sync this interaction by creating a CRM Lead
    await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        service: `Consultation: ${data.meetingType}`,
        budget: data.budget || "Flexible",
        timeline: "Flexible",
        source: "WEBSITE",
        status: "NEW",
        priority: "MEDIUM",
      }
    });

    revalidatePath("/admin/meetings");
    revalidatePath("/admin/crm");
    
    console.log(`Meetings Alert: Consultation scheduled for ${data.email}. Sync'd into CRM pipeline.`);

    // 3. Send booking confirmation email via Resend
    await sendEmail({
      to: data.email,
      subject: "Consultation Scheduled | SewaCircle360 Tech",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Consultation Confirmed</h2>
          <p>Hello <strong>${data.name}</strong>,</p>
          <p>We have successfully scheduled your consultation. Our solutions engineering team will contact you shortly.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Type:</strong> ${data.meetingType}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${data.preferredTime} (${data.timezone})</p>
          </div>
          <p style="font-size: 12px; color: #64748b;">This email was automatically sent from the SewaCircle360 Tech business operating system.</p>
        </div>
      `
    }).catch(err => console.error("Consultation confirmation email failed to send:", err));

    return { success: "Consultation booked successfully! We will contact you soon.", meetingId: meeting.id };
  } catch (error) {
    console.error("bookMeetingAction error:", error);
    return { error: "Failed to schedule consultation. Please try again." };
  }
}

export async function updateMeetingStatus(id: string, status: string) {
  try {
    const meeting = await db.meeting.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/meetings");
    return { success: `Meeting status updated to ${status}`, meeting };
  } catch (error) {
    console.error("updateMeetingStatus error:", error);
    return { error: "Failed to update meeting status." };
  }
}
