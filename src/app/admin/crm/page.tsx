import { getLeads } from "@/modules/crm/actions/leads";
import { KanbanBoard } from "@/modules/crm/components/KanbanBoard";

export const metadata = {
  title: "CRM Pipeline | SewaCircle360 Business OS",
};

export default async function AdminCRMPage() {
  // Query leads from database
  const leads = await getLeads();

  // Convert Date objects to strings for Client Component boundary safely
  const formattedLeads = leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          CRM Pipeline
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review incoming sales requests, change workflow status columns, and qualify leads.
        </p>
      </div>

      {/* Pipeline Kanban Board */}
      <KanbanBoard initialLeads={formattedLeads} />
    </div>
  );
}
