"use client";

import { useState, useEffect } from "react";
import { getMeetings } from "@/modules/admin/actions/dashboard";
import { Calendar, Video, Clock, User, Mail, MessageSquare } from "lucide-react";

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getMeetings();
      setMeetings(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Meetings Calendar
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review consultation calls, client checkins, and scheduled project review calendars.
        </p>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {meetings.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Meetings Found</span>
            <p className="text-xs text-slate-500 mt-1">Incoming booking calendar from clients is currently empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Name / Details</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Scheduled Date</th>
                  <th className="py-4 px-6">Time / Timezone</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {meetings.map((meet) => (
                  <tr key={meet.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{meet.name}</span>
                        <span className="text-xs text-slate-450">{meet.email}</span>
                        {meet.details && (
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium italic">
                            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                            "{meet.details}"
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-primary" /> {meet.meetingType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                      {new Date(meet.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {meet.preferredTime} <span className="text-slate-450">({meet.timezone})</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        meet.status === "CONFIRMED" ? "bg-green-500/15 text-green-500 border border-green-500/20" :
                        "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                      }`}>
                        {meet.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
