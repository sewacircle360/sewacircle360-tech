"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
  try {
    return await db.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    return await db.invoice.findUnique({
      where: { id },
      include: { client: true },
    });
  } catch (error) {
    console.error("getInvoiceById error:", error);
    return null;
  }
}

export async function getInvoicesByClientId(clientId: string) {
  try {
    return await db.invoice.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getInvoicesByClientId error:", error);
    return [];
  }
}

export async function createInvoice(data: {
  invoiceNumber: string;
  clientId: string;
  date: Date;
  dueDate: Date;
  items: { description: string; quantity: number; price: number; tax: number }[];
  discount?: number;
}) {
  try {
    const existing = await db.invoice.findUnique({ where: { invoiceNumber: data.invoiceNumber } });
    if (existing) {
      return { error: "An invoice with this invoice number already exists." };
    }

    // Subtotal calculation
    let subtotal = 0;
    let taxAmount = 0;

    data.items.forEach((item) => {
      const lineCost = item.quantity * item.price;
      subtotal += lineCost;
      taxAmount += lineCost * (item.tax / 100);
    });

    const discountAmount = data.discount || 0;
    const grandTotal = subtotal + taxAmount - discountAmount;

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        clientId: data.clientId,
        date: data.date,
        dueDate: data.dueDate,
        items: data.items,
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        grandTotal,
        status: "UNPAID",
      }
    });

    revalidatePath("/admin/invoices");
    revalidatePath(`/portal/invoices`);
    return { success: "Invoice generated successfully!", invoice };
  } catch (error) {
    console.error("createInvoice error:", error);
    return { error: "Failed to generate invoice." };
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    const invoice = await db.invoice.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${id}`);
    revalidatePath(`/portal/invoices`);
    return { success: `Invoice status updated to ${status}`, invoice };
  } catch (error) {
    console.error("updateInvoiceStatus error:", error);
    return { error: "Failed to update invoice status." };
  }
}
