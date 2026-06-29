"use client";

import { useState, useTransition } from "react";
import { createProduct } from "@/modules/products/actions/products";
import { Layers, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "SaaS Application",
    description: "",
    version: "1.0.0",
    liveUrl: "",
    featuresText: "",
    priceTier: "Standard",
    priceVal: "Custom Quote"
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Helper to suggest slug on name changes
  const handleNameChange = (val: string) => {
    const suggestedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData(prev => ({ ...prev, name: val, slug: suggestedSlug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.slug || !formData.description) {
      setError("Product Name, Slug, and Description are required.");
      return;
    }

    const features = formData.featuresText
      ? formData.featuresText.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    const pricingPlans = [
      { name: formData.priceTier, price: formData.priceVal }
    ];

    startTransition(async () => {
      const result = await createProduct({
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        version: formData.version,
        liveUrl: formData.liveUrl || undefined,
        features,
        pricingPlans,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Product registered successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Add New Product
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register a new proprietary SaaS tool or corporate software in your portfolio directory.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Name *</label>
              <input
                type="text"
                placeholder="SewaCircle Inventory OS"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Slug *</label>
              <input
                type="text"
                placeholder="sewacircle-inventory-os"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              >
                <option value="SaaS Application">SaaS Application</option>
                <option value="ERP / CRM Module">ERP / CRM Module</option>
                <option value="E-Commerce Core">E-Commerce Core</option>
                <option value="Developer Utility">Developer Utility</option>
              </select>
            </div>

            {/* Version */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Initial Version</label>
              <input
                type="text"
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            {/* Live Website URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live URL (optional)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://inventory.sewacircle.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Description *</label>
            <textarea
              placeholder="Provide a comprehensive summary of features, tech stack, and user utility..."
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
            />
          </div>

          {/* Features */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Features (comma-separated)</label>
            <input
              type="text"
              placeholder="Real-time audit, Custom alert thresholds, Supplier log tracks, CSV export"
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pricing Tier Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pricing Tier Title</label>
              <input
                type="text"
                placeholder="Enterprise Subscription"
                value={formData.priceTier}
                onChange={(e) => setFormData({ ...formData, priceTier: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            {/* Pricing Tier Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pricing Rate</label>
              <input
                type="text"
                placeholder="Custom Quote / $199 mo"
                value={formData.priceVal}
                onChange={(e) => setFormData({ ...formData, priceVal: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          {/* Feedback logs */}
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
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/85">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Register Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
