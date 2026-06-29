"use client";

import { useState, useEffect, useTransition } from "react";
import { Printer, Receipt, Calendar, User, ShieldCheck, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { updateInvoiceStatus } from "../actions/invoices";

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
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(invoice.status);
  const [branding, setBranding] = useState({
    brandColor: "#2563eb",
    brandName: "SewaCircle360 TECHNOLOGY",
    executiveLeadership: "Deepak Bawa (Founder) & Riya Garg (Co-Founder)",
    companyAddress: "Phase 7, Mohali, Punjab",
    companyEmail: "contact@sewacircle360.online",
    gstNumber: "03SEWAC360T1Z2",
    digitalSeal: "CIRCULAR_BLUE",
  });

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await updateInvoiceStatus(invoice.id, newStatus);
    });
  };

  useEffect(() => {
    function load() {
      const saved = localStorage.getItem("brandingSettings");
      if (saved) {
        try {
          setBranding((prev) => ({ ...prev, ...JSON.parse(saved) }));
        } catch (err) {
          console.error("Failed to parse branding config:", err);
        }
      }
    }
    load();
    window.addEventListener("brandingChanged", load);
    return () => window.removeEventListener("brandingChanged", load);
  }, []);

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
        
        .brand-bg-color {
          background-color: ${branding.brandColor} !important;
        }
        .brand-text-color {
          color: ${branding.brandColor} !important;
        }
        .brand-border-color {
          border-color: ${branding.brandColor} !important;
        }
      `}} />

      {/* Action Row */}
      <div className="flex justify-between items-center gap-4 no-print border-b dark:border-slate-800/80 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Control:</span>
          {isPending ? (
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating...
            </div>
          ) : (
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground cursor-pointer"
            >
              <option value="UNPAID">UNPAID</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
        >
          <Printer className="h-4 w-4" /> Print / Download PDF
        </button>
      </div>

      {/* Invoice Sheet */}
      <div className="invoice-sheet bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
        {/* Paid Watermark/Stamp */}
        {currentStatus === "PAID" && (
          <div className="absolute right-8 top-28 border-4 border-dashed border-emerald-500/40 text-emerald-500/40 font-black text-2xl px-6 py-2.5 uppercase rounded-2xl tracking-widest rotate-12 select-none font-mono flex flex-col items-center justify-center pointer-events-none z-10">
            <span>PAID</span>
            <span className="text-[8px] font-bold tracking-normal mt-0.5">RECEIPT</span>
          </div>
        )}

        {/* Invoice Header block */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b dark:border-slate-800 pb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 brand-bg-color inline-block" />
              <span className="text-slate-900 dark:text-white font-extrabold font-display tracking-wider text-sm sm:text-base">
                {branding.brandName}
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5 font-semibold">
              <p>{branding.companyAddress}</p>
              <p>Email: {branding.companyEmail}</p>
              <p>GSTIN: {branding.gstNumber}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 sm:text-right">
            <span className="text-xs font-bold brand-text-color uppercase tracking-widest">
              TAX INVOICE
            </span>
            <h1 className="text-2xl font-black font-mono text-slate-800 dark:text-white leading-none">
              {invoice.invoiceNumber}
            </h1>
            <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase w-fit mt-1 ${
              currentStatus === "PAID" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
              currentStatus === "OVERDUE" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}>
              {currentStatus}
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
            
            {/* Digital Seal displays */}
            <div className="pt-4 flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-widest text-[8px] text-slate-400 block">
                Authorized Corporate Seal
              </span>
              <div className="h-16 w-16 shrink-0 flex items-center justify-start text-slate-700 dark:text-slate-200">
                {branding.digitalSeal === "CIRCULAR_BLUE" && (
                  <svg width="56" height="56" viewBox="0 0 100 100" style={{ color: branding.brandColor }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
                    <polygon points="50,28 53,38 63,38 55,44 58,54 50,48 42,54 45,44 37,38 47,38" fill="currentColor" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                )}
                {branding.digitalSeal === "VERIFIED_BADGE" && (
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 w-fit">
                    <ShieldCheck className="h-5 w-5" style={{ color: branding.brandColor }} />
                    <span className="text-[6px] font-black uppercase tracking-wider text-slate-500">VERIFIED AUTH</span>
                  </div>
                )}
                {branding.digitalSeal === "RED_STAMP" && (
                  <div className="border-2 border-red-500 text-red-500 font-black text-[9px] px-2.5 py-1 uppercase rounded tracking-widest rotate-6 select-none font-mono">
                    APPROVED
                  </div>
                )}
                {branding.digitalSeal === "NONE" && (
                  <span className="text-[9px] text-slate-400 italic">No Seal</span>
                )}
              </div>
            </div>
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
              <span className="brand-text-color">₹{invoice.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
