"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { updateInvoiceStatus } from "../actions/invoices";
import { Loader2, CreditCard, Lock, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentDrawerProps {
  invoiceId: string;
  amount: number;
  invoiceNumber: string;
  onPaymentSuccess?: () => void;
}

export function PaymentDrawer({ invoiceId, amount, invoiceNumber, onPaymentSuccess }: PaymentDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"FORM" | "PROCESSING" | "SUCCESS">("FORM");
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  // Canvas Confetti simulation
  useEffect(() => {
    if (step !== "SUCCESS" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#2563eb", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 15,
      vy: -(Math.random() * 12 + 10),
      radius: Math.random() * 5 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      gravity: 0.25,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        if (p.vy > 0) p.opacity -= 0.015;

        if (p.opacity > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          active = true;
        }
      });

      if (active) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [step]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 15 || cvv.length < 3 || expiry.length < 5 || !cardName.trim()) {
      alert("Please fill in valid card details.");
      return;
    }

    setStep("PROCESSING");
    setTimeout(() => {
      startTransition(async () => {
        const result = await updateInvoiceStatus(invoiceId, "PAID");
        if (result.error) {
          alert(result.error);
          setStep("FORM");
        } else {
          setStep("SUCCESS");
          setTimeout(() => {
            setIsOpen(false);
            setStep("FORM");
            setCardNumber("");
            setCardName("");
            setExpiry("");
            setCvv("");
            if (onPaymentSuccess) onPaymentSuccess();
            router.refresh();
          }, 3500);
        }
      });
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 py-2 px-5 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0"
      >
        <CreditCard className="h-4 w-4" /> Pay Invoice
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Canvas for success Confetti */}
          {step === "SUCCESS" && (
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-55 w-full h-full" />
          )}

          {/* Checkout Drawer panel */}
          <div className="relative bg-white dark:bg-[#070b19] border-l dark:border-slate-800/80 w-full max-w-md h-screen flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300 z-50 overflow-y-auto">
            {step === "FORM" && (
              <>
                {/* Header */}
                <div className="flex flex-col gap-1 border-b dark:border-slate-850 pb-4 mb-4 text-left">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">SewaCircle360 Secure Checkout</span>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                    Invoice {invoiceNumber}
                  </h3>
                  <div className="flex justify-between items-center bg-slate-55/60 dark:bg-slate-950/40 p-3 rounded-xl border dark:border-slate-850 mt-2">
                    <span className="text-xs font-bold text-slate-450 uppercase">Total Amount:</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* 3D-styled Interactive Card View */}
                <div className="w-full h-44 relative perspective-1000 mb-6 shrink-0">
                  <div className={`w-full h-full rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-650 via-primary to-cyan-600 shadow-xl transition-transform duration-700 transform-style-3d relative ${isFlipped ? "rotate-y-180" : ""}`}>
                    {/* Front side */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden rounded-2xl">
                      <div className="flex justify-between items-start">
                        <CreditCard className="h-9 w-9 opacity-80" />
                        <div className="text-[8px] font-bold tracking-widest border border-white/30 px-2 py-0.5 rounded-lg">VISA / MC</div>
                      </div>
                      <div className="text-lg font-bold font-mono tracking-widest leading-none my-4">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-white/50 uppercase tracking-widest">Cardholder Name</span>
                          <span className="text-xs font-bold font-mono tracking-wide uppercase truncate max-w-44">{cardName || "Your Name"}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[7px] text-white/50 uppercase tracking-widest">Expires</span>
                          <span className="text-xs font-bold font-mono">{expiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back side (CVV) */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden rotate-y-180 rounded-2xl bg-slate-900">
                      <div className="w-full h-9 bg-black -mx-5 mt-1" />
                      <div className="flex flex-col gap-1 items-end mt-4">
                        <span className="text-[7px] text-white/50 uppercase tracking-widest">CVV / CVN</span>
                        <div className="bg-white text-slate-900 font-mono font-bold text-xs px-3 py-1 rounded w-12 text-center">
                          {cvv || "•••"}
                        </div>
                      </div>
                      <div className="text-[7px] text-white/40 tracking-wide text-left">
                        Authorized digital receipt issued under SewaCircle360 payment gateway integrations.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form inputs */}
                <form onSubmit={handlePay} className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Name on Card</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        onFocus={() => setIsFlipped(false)}
                        className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground font-semibold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                      <input
                        type="text"
                        placeholder="4532 7150 1200 4567"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        onFocus={() => setIsFlipped(false)}
                        className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground font-semibold font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          onFocus={() => setIsFlipped(false)}
                          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground font-semibold font-mono"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={3}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/gi, ""))}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground font-semibold font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="border-t dark:border-slate-850 pt-4 mt-6">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/25"
                    >
                      <Lock className="h-3.5 w-3.5" /> Pay ₹{amount.toLocaleString("en-IN")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-500 mt-3 transition-colors cursor-pointer"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === "PROCESSING" && (
              <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Processing Payment</h4>
                  <p className="text-xs text-slate-450 mt-1 max-w-[240px] mx-auto">
                    Securing tunnel and contacting bank transaction processors. Please do not refresh.
                  </p>
                </div>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in duration-300">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center animate-bounce scale-110 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-500 uppercase tracking-widest">Transaction Successful</h4>
                  <p className="text-xs text-slate-450 mt-1.5 max-w-[240px] mx-auto">
                    Your invoice payment has been fully recorded. An email confirmation receipt is on its way.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
