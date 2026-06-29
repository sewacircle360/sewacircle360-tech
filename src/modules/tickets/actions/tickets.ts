"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTicketsForClient(clientId: string) {
  try {
    return await db.supportTicket.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: { assignedEmployee: true },
    });
  } catch (error) {
    console.error("getTicketsForClient error:", error);
    return [];
  }
}

export async function getTicketsForAdmin() {
  try {
    return await db.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true, assignedEmployee: true },
    });
  } catch (error) {
    console.error("getTicketsForAdmin error:", error);
    return [];
  }
}

export async function createTicketAction(data: {
  clientId: string;
  subject: string;
  category: string;
  priority: string;
}) {
  try {
    if (!data.subject.trim()) {
      return { error: "Subject is required." };
    }

    const ticket = await db.supportTicket.create({
      data: {
        clientId: data.clientId,
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        status: "OPEN",
      }
    });

    revalidatePath("/portal/tickets");
    revalidatePath("/admin/tickets");

    return { success: "Support ticket opened successfully!", ticketId: ticket.id };
  } catch (error) {
    console.error("createTicketAction error:", error);
    return { error: "Failed to open support ticket." };
  }
}

export async function updateTicketStatusAction(ticketId: string, status: string) {
  try {
    await db.supportTicket.update({
      where: { id: ticketId },
      data: { status }
    });

    revalidatePath("/portal/tickets");
    revalidatePath(`/portal/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
    revalidatePath(`/admin/tickets/${ticketId}`);

    return { success: "Ticket status updated." };
  } catch (error) {
    console.error("updateTicketStatusAction error:", error);
    return { error: "Failed to update ticket status." };
  }
}

export async function assignTicketAction(ticketId: string, employeeId: string | null) {
  try {
    await db.supportTicket.update({
      where: { id: ticketId },
      data: { assignedEmployeeId: employeeId }
    });

    revalidatePath("/admin/tickets");
    revalidatePath(`/admin/tickets/${ticketId}`);

    return { success: "Ticket assignment updated." };
  } catch (error) {
    console.error("assignTicketAction error:", error);
    return { error: "Failed to assign ticket." };
  }
}
