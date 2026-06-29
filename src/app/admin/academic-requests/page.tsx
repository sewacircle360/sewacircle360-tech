"use client";

import { useState, useEffect, useTransition } from "react";
import { getStudentProjectRequests, updateStudentProjectRequestStatus, deleteStudentProjectRequest } from "@/modules/projects/actions/student-requests";
import { GraduationCap, Trash2, CheckCircle, RefreshCw, Loader2, AlertCircle } from "lucide-react";

export default function AdminAcademicRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchRequests = async () => {
    const list = await getStudentProjectRequests();
    setRequests(list);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = prompt("Enter new status (PENDING, APPROVED, IN_PROGRESS, COMPLETED):", currentStatus);
    if (!newStatus) return;

    const formattedStatus = newStatus.toUpperCase().trim();
    if (!["PENDING", "APPROVED", "IN_PROGRESS", "COMPLETED"].includes(formattedStatus)) {
      alert("Invalid status entered. Must be PENDING, APPROVED, IN_PROGRESS, or COMPLETED.");
      return;
    }

    startTransition(async () => {
      const result = await updateStudentProjectRequestStatus(id, formattedStatus);
      if (result.error) {
        alert(result.error);
      } else {
        fetchRequests();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student request?")) return;
    const result = await deleteStudentProjectRequest(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchRequests();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Academic Project Requests
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review project training requests submitted by verified college students.
        </p>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Requests Found</span>
            <p className="text-xs text-slate-500 mt-1">When students submit academic mentoring briefs, they will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">College</th>
                  <th className="py-4 px-6">Project Title</th>
                  <th className="py-4 px-6">Brief Details</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{req.studentName}</span>
                        <span className="text-xs text-slate-450 dark:text-slate-400">{req.studentEmail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{req.collegeName}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">{req.projectTitle}</td>
                    <td className="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{req.description}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusChange(req.id, req.status)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded cursor-pointer transition-all uppercase flex items-center gap-1 ${
                          req.status === "PENDING" ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                          req.status === "APPROVED" ? "bg-blue-500/15 text-blue-500 border border-blue-500/20" :
                          req.status === "IN_PROGRESS" ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/20" :
                          "bg-green-500/15 text-green-500 border border-green-500/20"
                        }`}
                      >
                        {req.status}
                        <RefreshCw className="h-2.5 w-2.5" />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
