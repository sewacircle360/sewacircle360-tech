"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus, deleteLead, updateLeadPriority, convertLeadToProjectAction } from "../actions/leads";
import { Trash2, Calendar, DollarSign, User, ArrowRightLeft, Flag, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { LeadDetailsDrawer } from "./LeadDetailsDrawer";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  companyName?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  status: string;
  priority: string;
  source: string;
  country?: string | null;
  createdAt: Date | string;
  notes?: any;
}

interface KanbanProps {
  initialLeads: Lead[];
}

const COLUMNS = [
  { id: "NEW", name: "New Inquiries", color: "border-t-blue-500" },
  { id: "CONTACTED", name: "Contacted", color: "border-t-yellow-500" },
  { id: "QUALIFIED", name: "Qualified", color: "border-t-cyan-500" },
  { id: "PROPOSAL_SENT", name: "Proposal Sent", color: "border-t-indigo-500" },
  { id: "NEGOTIATION", name: "Negotiation", color: "border-t-purple-500" },
  { id: "WON", name: "Won / Projects", color: "border-t-emerald-500" },
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function KanbanBoard({ initialLeads }: KanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (leadId: string, nextStatus: string) => {
    // Optimistic UI update
    const previousLeads = [...leads];
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead));

    startTransition(async () => {
      const result = await updateLeadStatus(leadId, nextStatus);
      if (result.error) {
        // Rollback
        setLeads(previousLeads);
        alert("Failed to update lead status: " + result.error);
      }
    });
  };

  const handlePriorityChange = (leadId: string, nextPriority: string) => {
    const previousLeads = [...leads];
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, priority: nextPriority } : lead));

    startTransition(async () => {
      const result = await updateLeadPriority(leadId, nextPriority);
      if (result.error) {
        setLeads(previousLeads);
        alert("Failed to update priority: " + result.error);
      }
    });
  };

  const handleDelete = (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    const previousLeads = [...leads];
    setLeads(prev => prev.filter(lead => lead.id !== leadId));

    startTransition(async () => {
      const result = await deleteLead(leadId);
      if (result.error) {
        setLeads(previousLeads);
        alert("Failed to delete lead: " + result.error);
      }
    });
  };

  const [isConvertPending, startConvertTransition] = useTransition();

  const handleConvertLead = (leadId: string) => {
    if (!confirm("Convert this Lead into an active Project? This creates a Client Profile, a Project pipeline card, and a draft SLA Agreement automatically.")) return;
    
    startConvertTransition(async () => {
      const result = await convertLeadToProjectAction(leadId);
      if (result.error) {
        alert(result.error);
      } else {
        setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: "WON" } : lead));
        alert(result.success);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 items-start overflow-x-auto pb-4 scrollbar-thin">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter(lead => lead.status === col.id);
        
        return (
          <div 
            key={col.id}
            className={`bg-slate-100/50 dark:bg-slate-900/40 border-t-4 ${col.color} border border-x-border border-b-border rounded-xl p-4 min-w-[200px] flex flex-col gap-4 shadow-sm`}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center pb-2 border-b border-border/80">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                {col.name}
              </span>
              <span className="text-[10px] font-extrabold bg-slate-200 dark:bg-ccslate-850 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                {colLeads.length}
              </span>
            </div>

            {/* Lead Cards List */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              {colLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  className="bg-white dark:bg-slate-950 p-4 rounded-xl border dark:border-ccslate-850 shadow-sm relative group cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 text-left"
                  onClick={() => setSelectedLead(lead)}
                >
                  {/* Lead Info */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {lead.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block">
                      {lead.email}
                    </span>
                    {lead.service && (
                      <span className="text-[10px] font-semibold text-primary dark:text-accent truncate block mt-0.5">
                        {lead.service}
                      </span>
                    )}
                  </div>

                  {/* Icon details */}
                  <div className="flex flex-col gap-1.5 border-t border-border/60 dark:border-slate-900/80 pt-3 mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{lead.budget || "Flexible"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Convert Lead to Project Shortcut (only for WON leads) */}
                  {lead.status === "WON" && (
                    <button
                      onClick={() => handleConvertLead(lead.id)}
                      disabled={isConvertPending}
                      className="w-full flex items-center justify-center gap-1 mt-3 px-2 py-1.5 text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isConvertPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      Convert to Project
                    </button>
                  )}

                  {/* Actions / Dropdowns */}
                  <div className="flex items-center justify-between border-t border-border/60 dark:border-slate-900/80 pt-3 mt-3" onClick={(e) => e.stopPropagation()}>
                    {/* Status Changer dropdown */}
                    <div className="relative inline-block">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 border-0 outline-none rounded px-2 py-1 text-slate-605 dark:text-ccslate-350 cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>{c.id.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                      className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                      aria-label="Delete lead"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {colLeads.length === 0 && (
                <div className="flex-grow flex items-center justify-center py-10 border border-dashed rounded-xl">
                  <span className="text-[10px] font-semibold text-ccslate-450 dark:text-slate-500 uppercase tracking-wider">
                    Empty Bin
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedLead && (
        <LeadDetailsDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onNoteAdded={(newNote) => {
            setLeads(prev => prev.map(l => l.id === selectedLead.id ? {
              ...l,
              notes: [newNote, ...(Array.isArray(l.notes) ? l.notes : [])]
            } : l));
            setSelectedLead(prev => prev ? {
              ...prev,
              notes: [newNote, ...(Array.isArray(prev.notes) ? prev.notes : [])]
            } : null);
          }}
        />
      )}
    </div>
  );
}
