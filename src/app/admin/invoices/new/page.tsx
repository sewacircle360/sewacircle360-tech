import { getClients } from "@/modules/clients/actions/clients";
import { getProjects } from "@/modules/projects/actions/projects";
import { InvoiceForm } from "@/modules/invoices/components/InvoiceForm";

export const metadata = {
  title: "Generate Invoice | SewaCircle360 Business OS",
};

export default async function NewInvoicePage() {
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects(),
  ]);

  const formattedClients = clients.map((c) => ({
    id: c.id,
    companyName: c.companyName,
  }));

  const formattedProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    clientId: p.clientId,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Generate New Invoice
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create an itemized tax invoice, link it to a project, and dispatch it to the client portal.
        </p>
      </div>

      <InvoiceForm clients={formattedClients} projects={formattedProjects} />
    </div>
  );
}
