"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
