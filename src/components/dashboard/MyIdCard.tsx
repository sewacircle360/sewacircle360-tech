"use client";

import { useState } from "react";
import { CreditCard, Printer, ShieldCheck, Image as ImageIcon } from "lucide-react";

interface MyIdCardProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    employeeId: string | null;
    designation: string | null;
    bloodGroup: string | null;
    joiningDate: Date | null;
    phone: string | null;
    emergencyContact: string | null;
  };
}

export function MyIdCard({ user }: MyIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!user.employeeId) return null;

  const verificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${user.id}`
    : `https://sewacircle360tech.online/verify/${user.id}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-md backdrop-blur-sm">
      
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
          .print-card-box {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            transform: none !important;
          }
        }
      ` }} />

      <div className="flex items-center justify-between pb-6 border-b border-border/80 dark:border-slate-800/80 mb-6 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              My Employee ID Card
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verify your digital ID card details and download/print your copy.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-all border border-slate-200/50 dark:border-slate-800/50 cursor-pointer"
          >
            Flip Card
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Printer className="h-3 w-3" /> Print Card
          </button>
        </div>
      </div>

      {/* Card Preview Area */}
      <div className="flex flex-col items-center justify-center py-4 no-print">
        <div className="relative w-[280px] h-[440px] perspective-1000">
          <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
            
            {/* FRONT OF THE CARD */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-gradient-to-br from-[#0b0c16] via-[#101430] to-[#04040a] border border-indigo-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-hidden print-card-box">
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

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

              <div className="flex flex-col items-center justify-center relative z-10 my-4">
                <div className="h-[120px] w-[120px] rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 shadow-lg relative flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.name || "Employee"} className="h-full w-full rounded-full object-cover border-2 border-slate-950" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-slate-900 border-2 border-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 font-bold uppercase">
                      <ImageIcon className="h-6 w-6 text-slate-650 mb-1" />
                      No Photo
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center relative z-10 flex flex-col gap-0.5">
                <h4 className="text-base font-extrabold text-white tracking-wide font-display truncate">
                  {user.name}
                </h4>
                <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase truncate">
                  {user.designation || "Staff Member"}
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-450 mt-1 font-mono">
                  ID: {user.employeeId || "PENDING"}
                </span>
              </div>

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
              <div className="absolute top-10 right-10 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>

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
                  <span className="text-indigo-400 font-bold">{user.bloodGroup || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                  <span className="text-slate-500 font-semibold uppercase text-[8px]">Joining Date:</span>
                  <span>
                    {user.joiningDate 
                      ? new Date(user.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A"
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                  <span className="text-slate-500 font-semibold uppercase text-[8px]">Contact No:</span>
                  <span>{user.phone || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-950 pb-1">
                  <span className="text-slate-500 font-semibold uppercase text-[8px]">Emergency Phone:</span>
                  <span>{user.emergencyContact || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 mt-1 relative z-10">
                <div className="flex flex-col gap-0.5 shrink-0">
                  <span className="text-[7px] uppercase font-bold text-slate-500">Scan to Verify</span>
                  <img src={qrCodeUrl} alt="Verify QR" className="h-14 w-14 bg-white p-0.5 rounded border border-slate-800" />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-normal leading-none font-mono tracking-widest text-slate-300 select-none block" style={{ fontFamily: "'Libre Barcode 39', sans-serif" }}>
                    {user.employeeId ? `*${user.employeeId}*` : "*SCT-CARD*"}
                  </span>
                  <span className="text-[7.5px] font-bold text-slate-500 tracking-wider mt-1">
                    {user.employeeId || "PENDING"}
                  </span>
                </div>
              </div>

              <div className="text-[6.5px] text-slate-550 leading-relaxed text-center mt-3 pt-2 border-t border-slate-900 relative z-10">
                <p>This card is the property of <strong>SewaCircle360Tech</strong>. If found, please return to: Office 14, Phase 8-B, Sector 74, Industrial Area, Mohali, Punjab.</p>
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
              {user.image ? (
                <img src={user.image} alt={user.name || "Employee"} className="h-full w-full rounded-full object-cover border-2 border-slate-950" />
              ) : (
                <div className="h-full w-full rounded-full bg-slate-900 border-2 border-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 font-bold uppercase">
                  No Photo
                </div>
              )}
            </div>
          </div>

          <div className="text-center relative z-10 flex flex-col gap-0.5">
            <h4 className="text-base font-extrabold text-white tracking-wide font-display truncate">
              {user.name}
            </h4>
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase truncate">
              {user.designation || "Staff Member"}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-450 mt-1 font-mono">
              ID: {user.employeeId || "PENDING"}
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
              <span className="text-indigo-400 font-bold">{user.bloodGroup || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-950 pb-1">
              <span className="text-slate-500 font-semibold uppercase text-[8px]">Joining Date:</span>
              <span>
                {user.joiningDate 
                  ? new Date(user.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : "N/A"
                }
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-950 pb-1">
              <span className="text-slate-500 font-semibold uppercase text-[8px]">Contact No:</span>
              <span>{user.phone || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-950 pb-1">
              <span className="text-slate-500 font-semibold uppercase text-[8px]">Emergency Phone:</span>
              <span>{user.emergencyContact || "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-900 mt-1 relative z-10">
            <div className="flex flex-col gap-0.5 shrink-0">
              <span className="text-[7px] uppercase font-bold text-slate-500">Scan to Verify</span>
              <img src={qrCodeUrl} alt="Verify QR" className="h-14 w-14 bg-white p-0.5 rounded border border-slate-800" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[32px] font-normal leading-none font-mono tracking-widest text-slate-300 select-none block" style={{ fontFamily: "'Libre Barcode 39', sans-serif" }}>
                {user.employeeId ? `*${user.employeeId}*` : "*SCT-CARD*"}
              </span>
              <span className="text-[7.5px] font-bold text-slate-500 tracking-wider mt-1">
                {user.employeeId || "PENDING"}
              </span>
            </div>
          </div>

          <div className="text-[6.5px] text-slate-550 leading-relaxed text-center mt-3 pt-2 border-t border-slate-900 relative z-10">
            <p>This card is the property of <strong>SewaCircle360Tech</strong>. If found, please return to: Office 14, Phase 8-B, Sector 74, Industrial Area, Mohali, Punjab.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
