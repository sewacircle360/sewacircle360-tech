import { getClients } from "@/modules/clients/actions/clients";
import { InvoiceForm } from "@/modules/invoices/components/InvoiceForm";
import { Receipt } from "lucide-react";

export const metadata = {
  title: "Generate Invoice | SewaCircle360 Business OS",
};

export default async function NewInvoicePage() {
  // Query clients database to link the invoice
  const clients = await getClients();

  const formattedClients = clients.map((c) => ({
    id: c.id,
    companyName: c.companyName,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Generate New Invoice
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create an itemized tax invoice, set billing terms, and dispatch it to the client portal.
        </p>
      </div>

      {/* Invoice Generator Form */}
      <InvoiceForm clients={formattedClients} />
    </div>
  );
}
