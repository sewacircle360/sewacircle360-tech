"use client";

import { useState, useEffect, useTransition } from "react";
import { getClients, createAgreementAction } from "@/modules/admin/actions/dashboard";
import { FileCheck, ArrowLeft, Loader2, CheckCircle, AlertCircle, RefreshCw, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NewAgreementPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [clientType, setClientType] = useState<"registered" | "manual">("registered");
  const [selectedClientId, setSelectedClientId] = useState("");
  
  // Manual client input state
  const [manualClient, setManualClient] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    gst: ""
  });

  // Project variables state
  const [projectName, setProjectName] = useState("Custom Stock Management System");
  const [timeline, setTimeline] = useState("8 Weeks");
  const [totalBudget, setTotalBudget] = useState("150000");
  const [currency, setCurrency] = useState("INR");
  
  // Milestones percentages state
  const [percent1, setPercent1] = useState(30);
  const [percent2, setPercent2] = useState(50);
  const [percent3, setPercent3] = useState(20);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusOption, setStatusOption] = useState<"DRAFT" | "SENT">("SENT");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    }
    load();
  }, []);

  // Determine current display names for the Live Preview
  const selectedClientObject = clients.find(c => c.id === selectedClientId);
  const displayClientName = clientType === "registered" 
    ? (selectedClientObject?.ownerName || "Client Owner Name")
    : (manualClient.ownerName || "Client Owner Name");
  
  const displayCompanyName = clientType === "registered"
    ? (selectedClientObject?.companyName || "Client Company")
    : (manualClient.companyName || "Client Company");

  const displayAddress = clientType === "registered"
    ? (selectedClientObject?.address || "Client Address")
    : (manualClient.address || "Client Address");

  // Calculate live milestones cash amounts
  const budgetValue = parseFloat(totalBudget) || 0;
  const amt1 = (budgetValue * percent1) / 100;
  const amt2 = (budgetValue * percent2) / 100;
  const amt3 = (budgetValue * percent3) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const totalPercent = Number(percent1) + Number(percent2) + Number(percent3);
    if (totalPercent !== 100) {
      setError(`Milestone percentages must sum up to exactly 100% (currently ${totalPercent}%).`);
      return;
    }

    if (clientType === "manual") {
      if (!manualClient.ownerName || !manualClient.companyName || !manualClient.email) {
        setError("Please enter all required manual client fields (Name, Company, Email).");
        return;
      }
    }

    startTransition(async () => {
      const result = await createAgreementAction({
        clientType,
        clientId: clientType === "registered" ? selectedClientId : undefined,
        manualClient: clientType === "manual" ? manualClient : undefined,
        projectName,
        timeline,
        totalBudget: budgetValue,
        currency,
        milestone1Percent: percent1,
        milestone2Percent: percent2,
        milestone3Percent: percent3,
        status: statusOption
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Agreement created successfully!");
        setTimeout(() => {
          router.push("/admin/agreements");
        }, 1800);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/agreements"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            New Agreement Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build customized software development contracts and calculate milestone breakdowns.
          </p>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Form */}
        <div className="lg:col-span-6 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Client Selection Type Toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Profile Type</label>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/80 p-1.5 rounded-xl border dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setClientType("registered")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                    clientType === "registered"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-450 bg-transparent hover:text-slate-700"
                  }`}
                >
                  Registered Client
                </button>
                <button
                  type="button"
                  onClick={() => setClientType("manual")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                    clientType === "manual"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-450 bg-transparent hover:text-slate-700"
                  }`}
                >
                  Unregistered (Manual)
                </button>
              </div>
            </div>

            {/* Client Inputs based on Toggle */}
            {clientType === "registered" ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Client Profile *</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={clients.length === 0}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                >
                  {clients.length === 0 ? (
                    <option value="">No clients found - Go add one</option>
                  ) : (
                    clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.ownerName})
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <div className="space-y-4 border dark:border-slate-800 p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block border-b dark:border-slate-800 pb-2">
                  Enter Manual Client Credentials
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-450">Owner Name *</label>
                    <input
                      type="text"
                      placeholder="Harpreet Singh"
                      required
                      value={manualClient.ownerName}
                      onChange={e => setManualClient({ ...manualClient, ownerName: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-455">Company Name *</label>
                    <input
                      type="text"
                      placeholder="ABC Retailers"
                      required
                      value={manualClient.companyName}
                      onChange={e => setManualClient({ ...manualClient, companyName: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-450">Email Address *</label>
                    <input
                      type="email"
                      placeholder="harpreet@abc.com"
                      required
                      value={manualClient.email}
                      onChange={e => setManualClient({ ...manualClient, email: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-450">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={manualClient.phone}
                      onChange={e => setManualClient({ ...manualClient, phone: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-450">Business Address</label>
                    <input
                      type="text"
                      placeholder="Phase 7, Mohali, Punjab"
                      value={manualClient.address}
                      onChange={e => setManualClient({ ...manualClient, address: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase text-slate-450">GSTIN Number</label>
                    <input
                      type="text"
                      placeholder="03AAAAA1111A1Z1"
                      value={manualClient.gst}
                      onChange={e => setManualClient({ ...manualClient, gst: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Project Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project / SLA Title *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl text-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated Duration *</label>
                <input
                  type="text"
                  required
                  value={timeline}
                  onChange={e => setTimeline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl text-foreground"
                />
              </div>
            </div>

            {/* Budget & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Project Budget *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    value={totalBudget}
                    onChange={e => setTotalBudget(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl text-foreground"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Currency *</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl text-foreground"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Milestone Percentages */}
            <div className="space-y-4 border dark:border-slate-800 p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                3-Step Milestone Payments Split
              </span>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Step 1 (Advance %)</label>
                  <input
                    type="number"
                    value={percent1}
                    onChange={e => setPercent1(Number(e.target.value))}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 rounded-lg text-foreground font-bold"
                  />
                  <span className="text-[10px] text-slate-450 mt-1 font-medium">{currency} {amt1.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Step 2 (Demo Build %)</label>
                  <input
                    type="number"
                    value={percent2}
                    onChange={e => setPercent2(Number(e.target.value))}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 rounded-lg text-foreground font-bold"
                  />
                  <span className="text-[10px] text-slate-450 mt-1 font-medium">{currency} {amt2.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Step 3 (Handover %)</label>
                  <input
                    type="number"
                    value={percent3}
                    onChange={e => setPercent3(Number(e.target.value))}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 rounded-lg text-foreground font-bold"
                  />
                  <span className="text-[10px] text-slate-450 mt-1 font-medium">{currency} {amt3.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/85 flex-wrap">
              <Link
                href="/admin/agreements"
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={() => setStatusOption("DRAFT")}
                disabled={isPending || (clientType === "registered" && clients.length === 0)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              >
                {isPending && statusOption === "DRAFT" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft Only"
                )}
              </button>
              <button
                type="submit"
                onClick={() => setStatusOption("SENT")}
                disabled={isPending || (clientType === "registered" && clients.length === 0)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              >
                {isPending && statusOption === "SENT" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin font-medium" />
                    Sending Email...
                  </>
                ) : (
                  "Create & Email Client"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Live Preview */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl sticky top-24 hidden md:block">
          <div className="bg-[#050B14] p-8 text-left relative overflow-hidden border-b border-slate-850">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <span className="h-5 w-1 bg-primary inline-block" />
              <span className="text-white font-bold font-display tracking-widest text-xs">
                SewaCircle360 TECHNOLOGY
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-1">
              CORPORATE MASTER AGREEMENT
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white tracking-tight leading-tight">
              SOFTWARE DEVELOPMENT AGREEMENT
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 text-[10px] border-t border-slate-800 pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 uppercase font-semibold">Project Title</span>
                <span className="text-slate-200 font-bold">{projectName}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 uppercase font-semibold">Service Provider</span>
                <span className="text-slate-200 font-bold">SewaCircle360 Technology</span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-slate-500 uppercase font-semibold">Executive Leadership</span>
                <span className="text-slate-200 font-medium">Deepak Bawa & Riya Garg</span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-slate-500 uppercase font-semibold">Client Name / Business</span>
                <span className="text-primary font-bold">{displayClientName} ({displayCompanyName})</span>
              </div>
            </div>
          </div>

          {/* Draft Preview Text */}
          <div className="p-6 text-left max-h-[350px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 text-xs text-slate-500 leading-relaxed font-sans border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Live Document Stream</span>
            <p className="mb-3 font-semibold text-slate-700 dark:text-slate-350">
              This Agreement is entered into effective as of {new Date().toLocaleDateString("en-IN")}, between SewaCircle360 Technology (Developer) and {displayClientName} representing {displayCompanyName} having business address at {displayAddress} (Client).
            </p>
            <p className="mb-3">
              <strong>Section 4. Core Scope</strong>: The Developer explicitly agrees to build, configure, and integrate the custom {projectName} System.
            </p>
            <p className="mb-3">
              <strong>Section 7. Payment Milestones Schedule</strong>: The Client agrees to make payments according to the following corporate schedule:
            </p>
            <ul className="list-disc pl-4 space-y-1 mb-3">
              <li>Milestone 1: {percent1}% Advance Payment — Amount: <strong>{currency} {amt1.toLocaleString("en-IN")}</strong> (Non-refundable).</li>
              <li>Milestone 2: {percent2}% Demo Stage Payment — Amount: <strong>{currency} {amt2.toLocaleString("en-IN")}</strong>.</li>
              <li>Milestone 3: {percent3}% Final Submission Payment — Amount: <strong>{currency} {amt3.toLocaleString("en-IN")}</strong>.</li>
            </ul>
            <p>
              <strong>Section 20. Governing Law</strong>: This Agreement shall be governed by and construed in accordance with the laws of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
