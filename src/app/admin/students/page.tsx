"use client";

import { useState, useEffect, useTransition } from "react";
import { getStudents, updateStudentStatus, deleteStudent, verifyStudentDocumentsAction } from "@/modules/auth/actions/students";
import { GraduationCap, Trash2, Eye, RefreshCw, Loader2, AlertCircle, ShieldAlert, Check, Ban, X, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchStudents = async () => {
    const list = await getStudents();
    setStudents(list);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change student status to ${newStatus}?`)) return;

    startTransition(async () => {
      const result = await updateStudentStatus(id, newStatus);
      if (result.error) {
        alert(result.error);
      } else {
        fetchStudents();
        if (selectedStudent && selectedStudent.id === id) {
          setSelectedStudent({ ...selectedStudent, status: newStatus });
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this student account?")) return;
    const result = await deleteStudent(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchStudents();
      setSelectedStudent(null);
    }
  };

  const handleVerify = async (id: string, actionType: "APPROVE" | "REJECT") => {
    let reason = "";
    if (actionType === "REJECT") {
      const input = prompt(
        "Enter the reason for document rejection (this will be emailed to the student):", 
        "Your uploaded college ID card is blurry. Please re-upload a clear copy."
      );
      if (input === null) return; // user cancelled
      reason = input;
    } else {
      if (!confirm("Are you sure you want to approve this student's registration documents?")) return;
    }

    startTransition(async () => {
      const res = await verifyStudentDocumentsAction(id, actionType, reason || undefined);
      if (res.error) {
        alert(res.error);
      } else {
        alert(res.success || "Operation completed!");
        fetchStudents();
        setSelectedStudent(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Students Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Verify student profiles, check uploaded college ID cards, and manage account statuses.
        </p>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {students.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Students Found</span>
            <p className="text-xs text-slate-500 mt-1">Student registration list is currently empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">College</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Verification</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-100 dark:bg-slate-850 rounded-full border border-border overflow-hidden shrink-0 flex items-center justify-center">
                          {student.image ? (
                            <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <GraduationCap className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                          <span className="text-xs text-slate-450 dark:text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{student.collegeName}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        student.status === "ACTIVE" ? "bg-green-500/15 text-green-500 border border-green-500/20" :
                        student.status === "SUSPENDED" ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                        student.status === "BLOCKED" ? "bg-red-500/15 text-red-500 border border-red-500/20" :
                        "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-1 text-xs font-bold text-primary dark:text-accent hover:underline cursor-pointer bg-transparent border-0"
                      >
                        <Eye className="h-3.5 w-3.5" /> View ID Card
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(student.id, "ACTIVE")}
                          title="Activate account"
                          className="p-1.5 text-green-600 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "SUSPENDED")}
                          title="Suspend account"
                          className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "BLOCKED")}
                          title="Block account"
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <span className="w-px h-5 bg-border/80 self-center mx-1" />
                        <button
                          onClick={() => handleDelete(student.id)}
                          title="Delete account"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overlay Modal for ID Verification details */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary dark:text-accent rounded-xl">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">Student Verification Sheet</h3>
                    <span className="text-xs text-slate-450">{selectedStudent.name} ({selectedStudent.collegeName})</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                {/* Profile Photo */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-450">Profile Picture</span>
                  <div className="aspect-square w-full rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                    {selectedStudent.image ? (
                      <img src={selectedStudent.image} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-450">No profile picture uploaded</span>
                    )}
                  </div>
                </div>

                {/* College ID Card */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-450">College ID Card</span>
                  <div className="aspect-square w-full rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                    {selectedStudent.collegeIdCard ? (
                      <img src={selectedStudent.collegeIdCard} alt="College ID Card" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-450">No ID Card uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl"
                >
                  Close Sheet
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(selectedStudent.id, "REJECT")}
                    disabled={isPending}
                    className="px-4 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject Documents
                  </button>
                  <button
                    onClick={() => handleVerify(selectedStudent.id, "APPROVE")}
                    disabled={isPending}
                    className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & Activate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
