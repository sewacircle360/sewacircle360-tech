"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/modules/clients/actions/clients";
import { Users, Building2, User, Mail, Phone, MapPin, Plus, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNewClientPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
    country: "India"
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.companyName || !formData.ownerName || !formData.email) {
      setError("Company Name, Owner Name, and Email are required fields.");
      return;
    }

    startTransition(async () => {
      const result = await createClient({
        companyName: formData.companyName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        gst: formData.gst || undefined,
        country: formData.country || undefined,
        createPortalAccess: true,
        portalPassword: "123456789" // Default password
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Client profile and portal account created successfully! Credentials sent to client email.");
        setTimeout(() => {
          router.push("/admin/clients");
        }, 1500);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Add New Client
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create client profile and auto-generate portal access details.
        </p>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-8 rounded-3xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company Name *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Acme Corp"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Owner Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Owner *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Deepak Kumar"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="owner@acme.com"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* GST Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">GST Registration No.</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  placeholder="07AAAAA0000A1Z5"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Country</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="India"
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

          </div>

          {/* Billing Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Billing Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <textarea 
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete billing address details..."
                disabled={isPending}
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Banners */}
          {error && (
            <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <Link 
              href="/admin/clients"
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border rounded-xl"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating Client Profile...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Register Client Profile
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
