"use client";

import { useState, useTransition } from "react";
import { addLeadNoteAction } from "../actions/leads";
import { 
  X, Phone, MessageSquare, Mail, Calendar, DollarSign, Clock, MapPin, 
  Flag, HelpCircle, User, Activity, AlertCircle, Loader2, ClipboardCheck
} from "lucide-react";

interface NoteItem {
  id: string;
  text: string;
  date: string;
}

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
  createdAt: Date | string;
  country?: string | null;
  notes?: any; // Json of NoteItem[]
}

interface LeadDetailsDrawerProps {
  lead: Lead;
  onClose: () => void;
  onNoteAdded?: (newNote: NoteItem) => void;
}

export function LeadDetailsDrawer({ lead, onClose, onNoteAdded }: LeadDetailsDrawerProps) {
  const [noteText, setNoteText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [leadNotes, setLeadNotes] = useState<NoteItem[]>(
    Array.isArray(lead.notes) ? lead.notes : []
  );
  const [msg, setMsg] = useState<string | null>(null);

  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9+]/g, "") : "";
  const cleanWhatsapp = lead.whatsapp ? lead.whatsapp.replace(/[^0-9+]/g, "") : cleanPhone;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    startTransition(async () => {
      const result = await addLeadNoteAction(lead.id, noteText);
      if (result.error) {
        alert(result.error);
      } else if (result.note) {
        const added: NoteItem = result.note as NoteItem;
        setLeadNotes(prev => [added, ...prev]);
        setNoteText("");
        setMsg("Note logged successfully!");
        if (onNoteAdded) onNoteAdded(added);
        setTimeout(() => setMsg(null), 2000);
      }
    });
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative bg-white dark:bg-[#070b19] border-l dark:border-slate-800/80 w-full max-w-md h-screen flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300 z-50 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b dark:border-slate-850 pb-4 mb-4 text-left">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Context Profile</h3>
              <span className="text-sm font-black text-slate-800 dark:text-white leading-tight mt-0.5">{lead.name}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          
          {/* Quick Communication Actions */}
          <div className="grid grid-cols-3 gap-3">
            {lead.phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border dark:border-slate-850 bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 gap-1.5 cursor-pointer"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call Client</span>
              </a>
            )}
            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border dark:border-slate-850 bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 gap-1.5 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            )}
            <a
              href={`mailto:${lead.email}`}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border dark:border-slate-850 bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 gap-1.5 cursor-pointer"
            >
              <Mail className="h-4 w-4 text-indigo-500" />
              <span>Email Link</span>
            </a>
          </div>

          {/* Contact Details Fields */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 border dark:border-slate-850 rounded-2xl flex flex-col gap-3.5 text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 border-b dark:border-slate-850 pb-1.5 block">
              Contact Profile details
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Service Requested</span>
                <span className="font-bold text-slate-805 dark:text-slate-200">{lead.service || "General Inquiry"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Est. Budget</span>
                <span className="font-bold text-slate-805 dark:text-slate-200">{lead.budget || "Flexible"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Timeline</span>
                <span className="font-semibold text-slate-800 dark:text-slate-300">{lead.timeline || "Not specified"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Company Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-300">{lead.companyName || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Source</span>
                <span className="font-bold text-primary">{lead.source}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Lead Priority</span>
                <span className={`text-[8px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider w-fit mt-0.5 ${priorityColors[lead.priority] || "bg-slate-500/10 text-slate-500"}`}>
                  {lead.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-450 border-t dark:border-slate-900 pt-2.5 mt-1 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Location: {lead.country || "Unknown"}</span>
              <span className="text-slate-350">|</span>
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Created: {new Date(lead.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>

          {/* CRM Internal Notes activity stream */}
          <div className="flex flex-col gap-3 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-primary shrink-0" /> Internal Notes &amp; Updates
            </span>

            {/* Note text input form */}
            <form onSubmit={handleAddNote} className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="Log a client interaction / call notes..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={isPending}
                className="flex-grow px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground"
              />
              <button
                type="submit"
                disabled={isPending || !noteText.trim()}
                className="h-8 px-3.5 bg-primary hover:bg-primary/95 text-white flex items-center justify-center rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
              </button>
            </form>

            {msg && (
              <span className="text-[9px] text-green-500 font-bold">{msg}</span>
            )}

            {/* Chronological list of logs */}
            <div className="space-y-3 mt-1 max-h-48 overflow-y-auto pr-1">
              {leadNotes.length === 0 ? (
                <div className="py-6 text-center text-slate-400 dark:text-slate-650 text-xs italic">
                  No notes logged yet. Save updates above.
                </div>
              ) : (
                leadNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl text-xs flex flex-col gap-1.5">
                    <p className="leading-relaxed text-slate-700 dark:text-slate-200 font-medium whitespace-pre-wrap">{note.text}</p>
                    <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><ClipboardCheck className="h-3 w-3 text-slate-450" /> Recorded Log</span>
                      <span>{new Date(note.date).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
