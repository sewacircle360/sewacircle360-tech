import { getInvoiceById } from "@/modules/invoices/actions/invoices";
import { InvoiceViewer } from "@/modules/invoices/components/InvoiceViewer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Invoice Details | SewaCircle360 Business OS",
};

export default async function AdminInvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  // Parse items safely
  const formattedInvoice = {
    ...invoice,
    date: invoice.date.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    client: {
      ...invoice.client,
      phone: invoice.client.phone || null,
      address: invoice.client.address || null,
      gst: invoice.client.gst || null,
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      <div className="flex items-center gap-3 no-print">
        <Link
          href="/admin/invoices"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Invoice Review Sheet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review detailed invoice data or download billing PDF files.
          </p>
        </div>
      </div>

      <InvoiceViewer invoice={formattedInvoice} />
    </div>
  );
}
