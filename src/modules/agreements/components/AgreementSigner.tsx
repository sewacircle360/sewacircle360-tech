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
      <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="border-b border-border/80 pb-5 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary dark:text-accent rounded-xl border border-primary/20">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                {agreement.title}
              </h2>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                Ref: {agreement.agreementNumber}
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
            isSigned 
              ? "bg-green-500/10 text-green-500" 
              : "bg-amber-500/10 text-amber-500"
          }`}>
            {isSigned ? "SIGNED & ACTIVE" : "PENDING SIGNATURE"}
          </span>
        </div>

        {/* Contract Text */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-ccslate-650 dark:text-ccslate-350 text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border dark:border-ccslate-850/80 min-h-[300px]">
          {agreement.content.split("\n\n").map((para, idx) => (
            <p key={idx} className="mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Signature Execution Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-border/80 pb-3">
          Sign Contract
        </span>

        {isSigned ? (
          <div className="flex flex-col gap-4 text-center items-center py-6">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full w-fit">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white font-display">
              Agreement Executed
            </h3>
            <p className="text-xs text-slate-500 dark:text-ccslate-450 leading-relaxed">
              This document has been electronically signed and timestamped. Copies are archived in the client portal vault.
            </p>
            
            {/* Display SVG Signature */}
            {agreement.clientSignature && (
              <div 
                className="p-3 border dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl mt-4 w-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: agreement.clientSignature }}
              />
            )}
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
