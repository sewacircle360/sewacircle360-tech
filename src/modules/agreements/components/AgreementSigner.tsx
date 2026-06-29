"use client";

import { useState, useTransition } from "react";
import { signAgreementAction } from "../actions/agreements";
import { FileCheck, Save, Loader2, AlertCircle, Sparkles, User, Info } from "lucide-react";

interface Agreement {
  id: string;
  title: string;
  agreementNumber: string;
  content: string;
  status: string;
  clientSignature?: string | null;
  signedAt?: Date | string | null;
}

interface AgreementSignerProps {
  agreement: Agreement;
}

export function AgreementSigner({ agreement }: AgreementSignerProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [signatureName, setSignatureName] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!signatureName.trim()) {
      setError("Please type your name to sign the document.");
      return;
    }
    if (!isAgreed) {
      setError("You must check the box to agree to the terms.");
      return;
    }

    startTransition(async () => {
      try {
        // Embed name inside digital signature SVG payload
        const signatureSVG = `
          <svg width="250" height="80" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="50" font-family="'Brush Script MT', cursive, sans-serif" font-size="32" fill="#2563EB" font-style="italic">
              ${signatureName.trim()}
            </text>
            <line x1="10" y1="65" x2="240" y2="65" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
          </svg>
        `;

        const result = await signAgreementAction(agreement.id, signatureSVG);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Agreement signed successfully!");
        }
      } catch (err) {
        setError("An error occurred during signing.");
      }
    });
  };

  const isSigned = agreement.status === "SIGNED" || !!success;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contract Viewer */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Cover Page Header Block */}
        <div className="bg-[#050B14] p-8 sm:p-12 text-left relative overflow-hidden border-b border-slate-850">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-8">
            <span className="h-6 w-1 bg-primary inline-block" />
            <span className="text-white font-bold font-display tracking-widest text-sm sm:text-base">
              SewaCircle360 TECHNOLOGY
            </span>
          </div>

          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary block mb-2">
            CORPORATE MASTER AGREEMENT
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
            SOFTWARE DEVELOPMENT<br />AGREEMENT
          </h1>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-slate-800 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Project Title</span>
              <span className="text-slate-200 font-bold">{agreement.title || "Custom Stock Management System"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Service Provider</span>
              <span className="text-slate-200 font-bold">SewaCircle360 Technology</span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Executive Leadership</span>
              <span className="text-slate-200 font-medium">Deepak Bawa (Founder) & Riya Garg (Co-Founder)</span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Agreement Reference</span>
              <span className="text-primary font-bold font-mono">{agreement.agreementNumber}</span>
            </div>
          </div>
        </div>

        {/* Index & Clauses Container */}
        <div className="p-6 sm:p-10 text-left">
          {/* Index Section */}
          <div className="mb-10 pb-8 border-b dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
              Document Outline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>1. Parties to the Agreement</span>
                <span className="text-primary">Page 3</span>
              </div>
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>2. Definitions & Interpretation</span>
                <span className="text-primary">Page 3</span>
              </div>
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>3. Project Scope & Purpose</span>
                <span className="text-primary">Page 4</span>
              </div>
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>4. Core Stock Management Features</span>
                <span className="text-primary">Page 4</span>
              </div>
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>5. Cloud Hosting & Handover Policy</span>
                <span className="text-primary">Page 5</span>
              </div>
              <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1">
                <span>6. Governing Law & Signatures</span>
                <span className="text-primary">Page 9</span>
              </div>
            </div>
          </div>

          {/* Contract Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-6 sm:p-8 rounded-2xl border dark:border-slate-800/80 min-h-[300px]">
            {agreement.content.split("\n\n").map((para, idx) => (
              <p key={idx} className="mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Corporate Signatures Footer Block */}
          <div className="mt-12 pt-8 border-t dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Developer Sign Block */}
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border dark:border-slate-800/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider block border-b dark:border-slate-800 pb-1.5">
                On Behalf of Developer
              </span>
              <div className="py-2">
                <span className="font-serif italic text-lg text-slate-800 dark:text-slate-200">Deepak Bawa</span>
                <div className="w-24 border-t border-slate-300 dark:border-slate-800 mt-1" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400">By: Deepak Bawa</span>
                <span className="text-slate-400">Title: Founder & Executive Director</span>
                <span className="text-slate-400">SewaCircle360 Technology</span>
              </div>
            </div>

            {/* Client Sign Block */}
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border dark:border-slate-800/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider block border-b dark:border-slate-800 pb-1.5">
                On Behalf of Client
              </span>
              <div className="py-2">
                {isSigned ? (
                  <div 
                    className="h-10 w-fit overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: agreement.clientSignature || "" }}
                  />
                ) : (
                  <span className="text-slate-400 italic">Signature Pending...</span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400">By: {signatureName || agreement.clientSignature ? "Authorized Client" : "________________"}</span>
                <span className="text-slate-400">Title: Representative / Owner</span>
                <span className="text-slate-400">
                  Signed At: {agreement.signedAt ? new Date(agreement.signedAt).toLocaleString() : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Execution Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 text-left">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-3">
          Execute Contract
        </span>

        {isSigned ? (
          <div className="flex flex-col gap-4 text-center items-center py-6">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full w-fit">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white font-display">
              Agreement Executed
            </h3>
            <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
              This document has been electronically signed and timestamped. Copies are archived in the client portal vault.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSign} className="space-y-5">
            {/* Signature name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Type Full Name to Sign *
              </label>
              <input
                type="text"
                placeholder="Deepak Kumar"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:border-primary text-slate-900 dark:text-white"
              />
              
              {/* Cursive Signature Live Preview */}
              {signatureName.trim() && (
                <div className="p-4 border dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 flex flex-col gap-2 items-center justify-center mt-2 relative overflow-hidden">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest absolute top-2 left-3">
                    Digital Preview
                  </span>
                  <span className="font-serif italic font-light text-2xl tracking-wide text-primary dark:text-accent pt-3 pb-1">
                    {signatureName}
                  </span>
                  <div className="w-full border-t border-dashed border-ccslate-350 dark:border-slate-800/80" />
                </div>
              )}
            </div>

            {/* Checkbox consent */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                disabled={isPending}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 bg-slate-50 dark:bg-slate-950"
              />
              <label htmlFor="agree" className="text-[10px] sm:text-xs font-semibold text-slate-500 leading-normal select-none cursor-pointer">
                I agree that this typed signature constitutes a binding electronic execution of this agreement.
              </label>
            </div>

            {/* Feedbacks */}
            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !isAgreed || !signatureName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executing Sign...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Sign Agreement
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
