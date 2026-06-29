"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

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
  projectId?: string;
  date: Date;
  dueDate: Date;
  items: { description: string; quantity: number; price: number; tax: number }[];
  discount?: number;
  status?: string;
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
        projectId: data.projectId || null,
        date: data.date,
        dueDate: data.dueDate,
        items: data.items,
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        grandTotal,
        status: data.status || "UNPAID",
      }
    });

    const client = await db.client.findUnique({ where: { id: data.clientId } });
    if (client) {
      await sendEmail({
        to: client.email,
        subject: `New Invoice Generated: ${data.invoiceNumber} | SewaCircle360`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
              <h2 style="color: #2563eb; margin: 0; font-size: 22px;">SewaCircle360 Technology</h2>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">Tax Invoice Notification</p>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">Hello <strong>${client.ownerName}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">A new invoice <strong>${data.invoiceNumber}</strong> has been generated for <strong>${client.companyName}</strong>.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <table style="width: 100%; font-size: 13px; color: #475569;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Invoice ID:</strong></td>
                  <td style="text-align: right;">${data.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Grand Total:</strong></td>
                  <td style="text-align: right; color: #2563eb; font-weight: bold;">₹${grandTotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Due Date:</strong></td>
                  <td style="text-align: right;">${new Date(data.dueDate).toLocaleDateString("en-IN")}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'https://sewacircle360tech.online'}/portal" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(37,99,235,0.1);">View in Client Workspace</a>
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 25px;">
              Please review the invoice and complete payment on or before the due date. For any questions, reply directly to this email.
            </p>
          </div>
        `
      }).catch(err => console.error("Email send warning:", err));
    }

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
      data: { status },
      include: { client: true }
    });

    if (status === "PAID" && invoice.client) {
      await sendEmail({
        to: invoice.client.email,
        subject: `Payment Confirmed & Receipt: ${invoice.invoiceNumber} | SewaCircle360`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
              <h2 style="color: #10b981; margin: 0; font-size: 22px;">Payment Confirmed</h2>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">SewaCircle360 Digital Receipt</p>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">Hello <strong>${invoice.client.ownerName}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">We have successfully received and confirmed your payment for invoice <strong>${invoice.invoiceNumber}</strong>.</p>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <table style="width: 100%; font-size: 13px; color: #1e3a2f;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Receipt ID:</strong></td>
                  <td style="text-align: right;">${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Amount Paid:</strong></td>
                  <td style="text-align: right; color: #10b981; font-weight: bold;">₹${invoice.grandTotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Status:</strong></td>
                  <td style="text-align: right; color: #10b981; font-weight: bold;">PAID &amp; SETTLED</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'https://sewacircle360tech.online'}/portal" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(16,185,129,0.1);">View Workspace Invoice</a>
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 25px;">
              Thank you for your business! Your support is greatly appreciated. If you need any assistance, reach out directly at contact@sewacircle360.online.
            </p>
          </div>
        `
      }).catch(err => console.error("Email send warning:", err));
    }

    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${id}`);
    revalidatePath(`/portal/invoices`);
    return { success: `Invoice status updated to ${status}`, invoice };
  } catch (error) {
    console.error("updateInvoiceStatus error:", error);
    return { error: "Failed to update invoice status." };
  }
}
