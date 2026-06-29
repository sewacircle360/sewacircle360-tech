import { getInvoiceById } from "@/modules/invoices/actions/invoices";
import { InvoiceViewer } from "@/modules/invoices/components/InvoiceViewer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Tax Invoice | SewaCircle360 Client Portal",
};

export default async function ClientInvoiceDetailPage({ params }: PageProps) {
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
    <main className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 text-left no-print">
          <Link
            href="/portal"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">
              Client Portal Invoice
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View your project invoice parameters or download/print tax PDFs.
            </p>
          </div>
        </div>

        <InvoiceViewer invoice={formattedInvoice} />
      </div>
    </main>
  );
}
