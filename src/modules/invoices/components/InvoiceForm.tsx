"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "../actions/invoices";
import { Plus, Trash2, Loader2, Save, FileText, DollarSign, Calendar, Calculator } from "lucide-react";

interface Client {
  id: string;
  companyName: string;
}

interface Project {
  id: string;
  name: string;
  clientId: string;
}

interface InvoiceFormProps {
  clients: Client[];
  projects?: Project[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export function InvoiceForm({ clients, projects = [] }: InvoiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-4)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState(0);

  // Filter projects by selected client
  const clientProjects = projects.filter(p => p.clientId === clientId);

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Enterprise Software Design", quantity: 1, price: 1500, tax: 18 }
  ]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { description: "", quantity: 1, price: 0, tax: 18 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === idx) {
        return {
          ...item,
          [field]: field === "description" ? value : Number(value)
        };
      }
      return item;
    }));
  };

  // Calculations
  let subtotal = 0;
  let taxAmount = 0;
  items.forEach(item => {
    const itemCost = item.quantity * item.price;
    subtotal += itemCost;
    taxAmount += itemCost * (item.tax / 100);
  });
  const grandTotal = subtotal + taxAmount - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientId) {
      setError("Please select a client.");
      return;
    }
    if (!dueDate) {
      setError("Please enter a due date.");
      return;
    }
    if (items.some(item => !item.description.trim() || item.price <= 0)) {
      setError("Please enter valid item descriptions and prices.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createInvoice({
          invoiceNumber,
          clientId,
          projectId: projectId || undefined,
          date: new Date(date),
          dueDate: new Date(dueDate),
          items,
          discount,
        });

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/invoices");
        }
      } catch (err) {
        setError("Failed to create invoice.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Items Section */}
      <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-border/80 pb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Invoice Line Items
          </span>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/95 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>

        {/* Item inputs list */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border-b border-dashed border-border/50 pb-4 last:border-b-0 last:pb-0">
              {/* Description */}
              <div className="sm:col-span-6 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Item Description</span>
                <input
                  type="text"
                  placeholder="e.g. Website development phase 1"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Price (₹)</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={item.price || ""}
                  onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Quantity */}
              <div className="sm:col-span-1.5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Qty</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Tax */}
              <div className="sm:col-span-1.5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tax %</span>
                <input
                  type="number"
                  value={item.tax}
                  onChange={(e) => handleItemChange(idx, "tax", e.target.value)}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Delete button */}
              <div className="sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  disabled={items.length === 1 || isPending}
                  className="p-2 bg-red-500/10 text-red-500 border border-red-500/10 rounded-lg hover:bg-red-500/20 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-border/80 pb-3">
          Invoice Settings
        </span>

        {/* Client Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Client Profile</label>
          <select
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setProjectId(""); // Reset project when client changes
            }}
            disabled={isPending}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground cursor-pointer"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        </div>

        {/* Project Selector (filtered by client) */}
        {clientId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Link to Project <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground cursor-pointer"
            >
              <option value="">General Invoice (no project)</option>
              {clientProjects.length === 0 ? (
                <option disabled>No projects found for this client</option>
              ) : (
                clientProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
          </div>
        )}

        {/* Invoice ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Invoice ID</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Issue Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Issue Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground cursor-pointer"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground cursor-pointer"
            />
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Discount (₹)</label>
          <input
            type="number"
            value={discount || ""}
            onChange={(e) => setDiscount(Number(e.target.value))}
            disabled={isPending}
            placeholder="0.00"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border rounded-lg outline-none focus:border-primary text-foreground"
          />
        </div>

        {/* Summary calculation card */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border rounded-xl flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Taxes</span>
            <span>+₹{taxAmount.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-xs font-semibold text-red-500">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white border-t border-dashed border-border/80 pt-2 mt-2">
            <span>Total</span>
            <span className="text-primary dark:text-accent font-extrabold">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-75 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Invoice...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save & Generate Invoice
            </>
          )}
        </button>
      </div>
    </form>
  );
}
