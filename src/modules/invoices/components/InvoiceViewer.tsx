"use client";

import { Printer, Receipt, Calendar, User, ShieldCheck } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date | string;
  dueDate: Date | string;
  items: any; // Json containing InvoiceItem[]
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  status: string;
  client: {
    companyName: string;
    ownerName: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    gst?: string | null;
  };
}

interface InvoiceViewerProps {
  invoice: Invoice;
}

export function InvoiceViewer({ invoice }: InvoiceViewerProps) {
  const lineItems: InvoiceItem[] = Array.isArray(invoice.items) 
    ? invoice.items 
    : JSON.parse(invoice.items || "[]");

  return (
    <div className="flex flex-col gap-4 text-left max-w-4xl mx-auto">
      {/* Print media overrides styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, button, aside, nav, header, [role="navigation"] {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .invoice-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}} />

      {/* Action Row */}
      <div className="flex justify-end gap-2 no-print">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
        >
          <Printer className="h-4 w-4" /> Print / Download PDF
        </button>
      </div>

      {/* Invoice Sheet */}
      <div className="invoice-sheet bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Invoice Header block */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b dark:border-slate-800 pb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-primary inline-block" />
              <span className="text-slate-900 dark:text-white font-extrabold font-display tracking-wider text-sm sm:text-base">
                SewaCircle360 TECHNOLOGY
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>Phase 7, Mohali, Punjab</p>
              <p>Email: contact@sewacircle360.online</p>
              <p>GSTIN: 03SEWAC360T1Z2</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 sm:text-right">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              TAX INVOICE
            </span>
            <h1 className="text-2xl font-black font-mono text-slate-800 dark:text-white leading-none">
              {invoice.invoiceNumber}
            </h1>
            <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase w-fit mt-1 ${
              invoice.status === "PAID" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
              invoice.status === "OVERDUE" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Client details & meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b dark:border-slate-800 text-xs">
          {/* Bill To */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-450 uppercase tracking-widest text-[10px]">
              Bill To:
            </span>
            <div className="space-y-1 text-slate-700 dark:text-slate-350">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{invoice.client.companyName}</p>
              <p className="font-medium">{invoice.client.ownerName}</p>
              {invoice.client.address && <p>{invoice.client.address}</p>}
              <p>Email: {invoice.client.email}</p>
              {invoice.client.gst && <p>GSTIN: {invoice.client.gst}</p>}
            </div>
          </div>

          {/* Dates & Terms */}
          <div className="flex flex-col gap-3 sm:items-end sm:text-right text-slate-700 dark:text-slate-350">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-450 uppercase tracking-widest text-[10px]">Issue Date:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(invoice.date).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-450 uppercase tracking-widest text-[10px]">Due Date:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Tax (GST %)</th>
                  <th className="py-3 px-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                {lineItems.map((item, idx) => {
                  const lineTotal = item.quantity * item.price;
                  return (
                    <tr key={idx}>
                      <td className="py-4 px-2 font-medium text-slate-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="py-4 px-2 text-center">{item.quantity}</td>
                      <td className="py-4 px-2 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="py-4 px-2 text-right">{item.tax}%</td>
                      <td className="py-4 px-2 text-right font-semibold text-slate-900 dark:text-white">
                        ₹{(lineTotal + lineTotal * (item.tax / 100)).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations Block */}
        <div className="border-t dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-6">
          {/* Payment Terms Info */}
          <div className="max-w-xs text-[10px] text-slate-450 space-y-1">
            <span className="font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Payment Terms & Instructions
            </span>
            <p>Please clear payments within the specified due date.</p>
            <p><strong>Bank details:</strong> HDFC Bank, Mohali, SCA: 50200012345678, IFSC: HDFC0001234</p>
          </div>

          {/* Pricing Totals */}
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-650 dark:text-slate-350">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-650 dark:text-slate-350">
              <span>Tax (GST sum):</span>
              <span>₹{invoice.tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount applied:</span>
                <span>- ₹{invoice.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-slate-900 dark:text-white border-t dark:border-slate-800 pt-2 text-sm">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
