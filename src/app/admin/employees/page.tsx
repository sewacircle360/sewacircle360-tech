"use client";

import { useState, useEffect, useTransition } from "react";
import { createEmployee, getEmployees, deleteEmployee } from "@/modules/auth/actions/employees";
import { Users, Mail, Trash2, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchEmployees = async () => {
    const list = await getEmployees();
    setEmployees(list);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    startTransition(async () => {
      const result = await createEmployee(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Employee registered!");
        setFormData({ name: "", email: "" });
        fetchEmployees();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this employee account?")) return;
    const result = await deleteEmployee(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchEmployees();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Employee Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add new staff members. Registered employees are auto-created with the default password 123456789.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Add Form */}
        <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Add New Employee</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Riya Garg"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="riyagargofficial@gmail.com"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Register Employee
            </button>
          </form>
        </div>

        {/* Right Side: Directory List */}
        <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {employees.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="h-8 w-8 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Employees Found</span>
              <p className="text-xs text-slate-500 mt-1">Register employee credentials to give them workspace access.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Password Reset</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">{emp.name}</td>
                      <td className="py-4 px-6 text-slate-555 dark:text-slate-300">{emp.email}</td>
                      <td className="py-4 px-6">
                        {emp.mustChangePassword ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 uppercase">Pending Reset</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-500 uppercase">Updated</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete employee"
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
    </div>
  );
}
