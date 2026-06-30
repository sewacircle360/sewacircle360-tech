"use client";

import { useState, useEffect, useTransition } from "react";
import { createEmployee, getEmployees, deleteEmployee, updateEmployeeIdCard } from "@/modules/auth/actions/employees";
import { Users, Mail, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, CreditCard, X, Printer, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ID Card State
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [cardForm, setCardForm] = useState({
    employeeId: "",
    designation: "",
    bloodGroup: "",
    joiningDate: "",
    emergencyContact: "",
    phone: "",
    image: "",
  });
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardSuccess, setCardSuccess] = useState<string | null>(null);
  const [isCardPending, startCardTransition] = useTransition();
  const [isFlipped, setIsFlipped] = useState(false);

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

  // ID Card Actions
  const handleOpenIdCardModal = (emp: any) => {
    setSelectedEmp(emp);
    setCardForm({
      employeeId: emp.employeeId || "",
      designation: emp.designation || "",
      bloodGroup: emp.bloodGroup || "",
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : "",
      emergencyContact: emp.emergencyContact || "",
      phone: emp.phone || "",
      image: emp.image || "",
    });
    setCardError(null);
    setCardSuccess(null);
    setIsFlipped(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCardForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);
    setCardSuccess(null);

    startCardTransition(async () => {
      const result = await updateEmployeeIdCard(selectedEmp.id, cardForm);
      if (result.error) {
        setCardError(result.error);
      } else {
        setCardSuccess("ID Card details updated successfully!");
        fetchEmployees();
        setSelectedEmp(result.employee);
      }
    });
  };

  const verificationUrl = selectedEmp
    ? typeof window !== "undefined"
      ? `${window.location.origin}/verify/${selectedEmp.id}`
      : `https://sewacircle360tech.online/verify/${selectedEmp.id}`
    : "";

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* Google fonts link and print style overrides */}
      <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        @media print {
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          .printable-card-area, .printable-card-area * {
            visibility: visible;
          }
          .printable-card-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 40px;
            padding: 20px 0;
          }
          /* Ensure both card sides print together on one page */
          .print-card-box {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            transform: none !important;
          }
        }
      ` }} />

      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Employee & Staff Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add new staff members, update directory, and generate premium SewaCircle360Tech ID cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
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
                    <th className="py-4 px-6">ID / Designation</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          {emp.image ? (
                            <img src={emp.image} alt={emp.name} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xs text-slate-500 font-bold uppercase">
                              {emp.name?.slice(0,2) || "EM"}
                            </div>
                          )}
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-550 dark:text-slate-300">{emp.email}</td>
                      <td className="py-4 px-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {emp.employeeId ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-800 dark:text-slate-250">{emp.employeeId}</span>
                            <span className="text-[10px] text-indigo-500 font-bold uppercase">{emp.designation || "Staff"}</span>
                          </div>
                        ) : (
                          <span className="italic text-slate-400">Not Generated</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {emp.mustChangePassword ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 uppercase">Pending Reset</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-500 uppercase">Active</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => handleOpenIdCardModal(emp)}
                            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Generate/Edit ID Card"
                          >
                            <CreditCard className="h-4.5 w-4.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-1.5 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Delete employee"
                            title="Remove Account"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
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
      </div>

      {/* ID Card Modal */}
      <AnimatePresence>
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative text-left my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">ID Card Generator</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Edit details and live preview cards for {selectedEmp.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmp(null)}
                  className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-h-[72vh] overflow-y-auto">
                
                {/* Form Section (5 Columns) */}
                <form onSubmit={handleSaveCard} className="md:col-span-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1.5 mb-2">
                    Card Credentials
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Employee ID</label>
                      <input 
                        type="text"
                        required
                        placeholder="SCT-2026-01"
                        value={cardForm.employeeId}
                        onChange={(e) => setCardForm({ ...cardForm, employeeId: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Designation</label>
                      <input 
                        type="text"
                        required
                        placeholder="Founder / Web Developer"
                        value={cardForm.designation}
                        onChange={(e) => setCardForm({ ...cardForm, designation: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Blood Group</label>
                      <select 
                        required
                        value={cardForm.bloodGroup}
                        onChange={(e) => setCardForm({ ...cardForm, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="">Select Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Joining Date</label>
                      <input 
                        type="date"
                        required
                        value={cardForm.joiningDate}
                        onChange={(e) => setCardForm({ ...cardForm, joiningDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone No</label>
                      <input 
                        type="text"
                        required
                        placeholder="+91 9876543210"
                        value={cardForm.phone}
                        onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Emergency Phone</label>
                      <input 
                        type="text"
                        required
                        placeholder="Emergency Contact"
                        value={cardForm.emergencyContact}
                        onChange={(e) => setCardForm({ ...cardForm, emergencyContact: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Profile Photo Uploader */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Profile Photo</label>
                    <div className="flex items-center gap-3 mt-1">
                      {cardForm.image ? (
                        <div className="relative group h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                          <img src={cardForm.image} alt="Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, image: "" })}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3.5 w-3.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-250 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                      <label className="flex-1 flex flex-col justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 cursor-pointer transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {cardError && (
                    <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{cardError}</span>
                    </div>
                  )}

                  {cardSuccess && (
                    <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{cardSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCardPending}
                    className="w-full py-2.5 px-4 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isCardPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Card Details"}
                  </button>
                </form>

                {/* ID Card 3D Live Preview & Print Section (7 Columns) */}
                <div className="md:col-span-7 flex flex-col items-center justify-center gap-6">
                  
                  {/* Flip Action Button */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-800/50 cursor-pointer"
                    >
                      Flip to {isFlipped ? "Front Side" : "Back Side"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      <Printer className="h-3 w-3" /> Print / Save PDF
                    </button>
                  </div>

                  {/* ID Card Flip Display Container */}
                  <div className="relative w-[280px] h-[440px] perspective-1000">
                    
                    <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                      
                      {/* FRONT OF THE CARD */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-gradient-to-br from-[#0b0c16] via-[#101430] to-[#04040a] border border-indigo-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-hidden print-card-box">
                        {/* Background glowing rings */}
                        <div className="absolute -top-16 -left-16 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Top Header Branding */}
                        <div className="text-center relative z-10">
                          <div className="flex items-center justify-center gap-1.5">
                            <img src="/logo.png" alt="SewaCircle360Tech" className="h-6 w-auto object-contain" />
                            <span className="text-sm font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent font-display">
                              SewaCircle360Tech
                            </span>
                          </div>
                          <div className="mt-1 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent w-full"></div>
                          <span className="text-[7.5px] font-extrabold text-indigo-400 tracking-[0.2em] uppercase block mt-1">
                            Employee ID Card
                          </span>
                        </div>

                        {/* Photo Display */}
                        <div className="flex flex-col items-center justify-center relative z-10 my-4">
                          <div className="h-[120px] w-[120px] rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 shadow-lg relative flex items-center justify-center">
                            {cardForm.image ? (
                              <img src={cardForm.image} alt={selectedEmp.name} className="h-full w-full rounded-full object-cover border-2 border-slate-950" />
                            ) : (
                              <div className="h-full w-full rounded-full bg-slate-900 border-2 border-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 font-bold uppercase">
                                <ImageIcon className="h-6 w-6 text-slate-650 mb-1" />
                                No Photo
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Profile Info */}
                        <div className="text-center relative z-10 flex flex-col gap-0.5">
                          <h4 className="text-base font-extrabold text-white tracking-wide font-display truncate">
                            {selectedEmp.name}
                          </h4>
                          <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase truncate">
                            {cardForm.designation || "Staff Member"}
                          </span>
                          <span className="text-[9px] font-bold tracking-widest text-slate-450 mt-1 font-mono">
                            ID: {cardForm.employeeId || "PENDING"}
                          </span>
                        </div>

                        {/* Card Bottom Signature */}
                        <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between mt-2 relative z-10">
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[7px] uppercase font-bold text-slate-500">Holder Sign</span>
                            <div className="h-5 w-16 border-b border-dashed border-slate-800/80"></div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[7px] uppercase font-bold text-slate-500">Authorized Sign</span>
                            <div className="h-5 w-20 flex items-center justify-end relative">
                              <span className="text-[8px] italic font-semibold text-indigo-400/90 font-display">SewaCircle360</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* BACK OF THE CARD */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-gradient-to-br from-[#07070e] via-[#090b16] to-[#040409] border border-indigo-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-hidden rotate-y-180 print-card-box">
                        
                        {/* Background glowing rings */}
                        <div className="absolute top-10 right-10 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Back Details header */}
                        <div className="text-center border-b border-slate-900 pb-2 relative z-10 flex flex-col gap-0.5">
                          <span className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase block">
                            Terms & Contact
                          </span>
                          <span className="text-[7.5px] font-medium text-slate-500">
                            www.sewacircle360tech.online
                          </span>
                        </div>

                        {/* Middle metadata fields */}
                        <div className="flex flex-col gap-2 relative z-10 text-[9px] font-bold text-slate-300 my-3">
                          <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                            <span className="text-slate-500 font-semibold uppercase text-[8px]">Blood Group:</span>
                            <span className="text-indigo-400 font-bold">{cardForm.bloodGroup || "N/A"}</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                            <span className="text-slate-500 font-semibold uppercase text-[8px]">Joining Date:</span>
                            <span>
                              {cardForm.joiningDate 
                                ? new Date(cardForm.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                : "N/A"
                              }
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                            <span className="text-slate-500 font-semibold uppercase text-[8px]">Contact No:</span>
                            <span>{cardForm.phone || "N/A"}</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                            <span className="text-slate-500 font-semibold uppercase text-[8px]">Emergency Phone:</span>
                            <span>{cardForm.emergencyContact || "N/A"}</span>
                          </div>
                        </div>

                        {/* Verification & Barcode */}
                        <div className="flex items-center gap-4 justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 mt-1 relative z-10">
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <span className="text-[7px] uppercase font-bold text-slate-500">Scan to Verify</span>
                            <img src={qrCodeUrl} alt="Verify QR" className="h-14 w-14 bg-white p-0.5 rounded border border-slate-800" />
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <span className="text-[32px] font-normal leading-none font-mono tracking-widest text-slate-300 select-none block" style={{ fontFamily: "'Libre Barcode 39', sans-serif" }}>
                              {cardForm.employeeId ? `*${cardForm.employeeId}*` : "*SCT-CARD*"}
                            </span>
                            <span className="text-[7.5px] font-bold text-slate-500 tracking-wider mt-1">
                              {cardForm.employeeId || "PENDING"}
                            </span>
                          </div>
                        </div>

                        {/* Address Disclaimer */}
                        <div className="text-[6.5px] text-slate-550 leading-relaxed text-center mt-3 pt-2 border-t border-slate-900 relative z-10">
                          <p>This card is the property of <strong>SewaCircle360Tech</strong>. If found, please return to: Office 14, Phase 8-B, Sector 74, Industrial Area, Mohali, Punjab.</p>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>

              </div>

              {/* Printable Area - Hidden on Screen, visible on Print */}
              <div className="hidden printable-card-area">
                
                {/* Print Front */}
                <div className="w-[280px] h-[440px] rounded-[24px] bg-[#0b0c16] border border-indigo-500 shadow-none p-6 flex flex-col justify-between overflow-hidden relative">
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-extrabold tracking-wide text-white font-display">
                        SewaCircle360Tech
                      </span>
                    </div>
                    <div className="mt-1 h-[1px] bg-indigo-500 w-full"></div>
                    <span className="text-[7.5px] font-extrabold text-indigo-400 tracking-[0.2em] uppercase block mt-1">
                      Employee ID Card
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center relative z-10 my-4">
                    <div className="h-[120px] w-[120px] rounded-full p-[3px] bg-indigo-500 shadow-none relative flex items-center justify-center">
                      {cardForm.image ? (
                        <img src={cardForm.image} alt={selectedEmp.name} className="h-full w-full rounded-full object-cover border-2 border-slate-950" />
                      ) : (
                        <div className="h-full w-full rounded-full bg-slate-900 border-2 border-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 font-bold uppercase">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center relative z-10 flex flex-col gap-0.5">
                    <h4 className="text-base font-extrabold text-white tracking-wide font-display truncate">
                      {selectedEmp.name}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase truncate">
                      {cardForm.designation || "Staff Member"}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-slate-450 mt-1 font-mono">
                      ID: {cardForm.employeeId || "PENDING"}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-center justify-between mt-2 relative z-10">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[7px] uppercase font-bold text-slate-500">Holder Sign</span>
                      <div className="h-5 w-16 border-b border-dashed border-slate-800"></div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[7px] uppercase font-bold text-slate-500">Authorized Sign</span>
                      <div className="h-5 w-20 flex items-center justify-end relative">
                        <span className="text-[8px] italic font-semibold text-indigo-400 font-display">SewaCircle360</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Back */}
                <div className="w-[280px] h-[440px] rounded-[24px] bg-[#07070e] border border-indigo-500 shadow-none p-6 flex flex-col justify-between overflow-hidden relative">
                  <div className="text-center border-b border-slate-900 pb-2 relative z-10 flex flex-col gap-0.5">
                    <span className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase block">
                      Terms & Contact
                    </span>
                    <span className="text-[7.5px] font-medium text-slate-500">
                      www.sewacircle360tech.online
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 relative z-10 text-[9px] font-bold text-slate-300 my-3">
                    <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                      <span className="text-slate-500 font-semibold uppercase text-[8px]">Blood Group:</span>
                      <span className="text-indigo-400 font-bold">{cardForm.bloodGroup || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                      <span className="text-slate-500 font-semibold uppercase text-[8px]">Joining Date:</span>
                      <span>
                        {cardForm.joiningDate 
                          ? new Date(cardForm.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                          : "N/A"
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                      <span className="text-slate-500 font-semibold uppercase text-[8px]">Contact No:</span>
                      <span>{cardForm.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                      <span className="text-slate-500 font-semibold uppercase text-[8px]">Emergency Phone:</span>
                      <span>{cardForm.emergencyContact || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-900 mt-1 relative z-10">
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <span className="text-[7px] uppercase font-bold text-slate-500">Scan to Verify</span>
                      <img src={qrCodeUrl} alt="Verify QR" className="h-14 w-14 bg-white p-0.5 rounded border border-slate-800" />
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-normal leading-none font-mono tracking-widest text-slate-300 select-none block" style={{ fontFamily: "'Libre Barcode 39', sans-serif" }}>
                        {cardForm.employeeId ? `*${cardForm.employeeId}*` : "*SCT-CARD*"}
                      </span>
                      <span className="text-[7.5px] font-bold text-slate-500 tracking-wider mt-1">
                        {cardForm.employeeId || "PENDING"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[6.5px] text-slate-550 leading-relaxed text-center mt-3 pt-2 border-t border-slate-900 relative z-10">
                    <p>This card is the property of <strong>SewaCircle360Tech</strong>. If found, please return to: Office 14, Phase 8-B, Sector 74, Industrial Area, Mohali, Punjab.</p>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
                <button
                  onClick={() => setSelectedEmp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Close Panel
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Encryption QR
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
