"use client";

import { useState, useEffect, useTransition } from "react";
import { createProduct, getProducts, deleteProduct } from "@/modules/products/actions/products";
import { Layers, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, Globe, Sparkles } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "SaaS Application",
    description: "",
    version: "1.0.0",
    liveUrl: "",
    featuresText: "",
    priceTier: "Starter",
    priceVal: "Custom Quote"
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchProducts = async () => {
    const list = await getProducts();
    setProducts(list);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.slug || !formData.description) {
      setError("Name, slug, and description are required.");
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
        setFormData({
          name: "",
          slug: "",
          category: "SaaS Application",
          description: "",
          version: "1.0.0",
          liveUrl: "",
          featuresText: "",
          priceTier: "Starter",
          priceVal: "Custom Quote"
        });
        fetchProducts();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const result = await deleteProduct(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchProducts();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Products Catalog CMS
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage dynamic SaaS products and ERP modules displayed on the public products catalog page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Add Form */}
        <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Add Dynamic Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hospital ERP System"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="hospital-erp"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Version</label>
                <input 
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="1.0.0"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <input 
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Healthcare IT"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live URL</label>
                <input 
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://hospital.sewacircle360.online"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pricing Tier</label>
                <input 
                  type="text"
                  required
                  value={formData.priceTier}
                  onChange={(e) => setFormData({ ...formData, priceTier: e.target.value })}
                  placeholder="Enterprise"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price Value</label>
                <input 
                  type="text"
                  required
                  value={formData.priceVal}
                  onChange={(e) => setFormData({ ...formData, priceVal: e.target.value })}
                  placeholder="₹9,999/mo or Custom"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Features (comma-separated)</label>
              <input 
                type="text"
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                placeholder="24/7 Support, Cloud Caching, PDF Billing"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Description</label>
              <textarea 
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A centralized database ERP for patient records and billing..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450 resize-none"
              />
            </div>

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

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publish SaaS Product
            </button>
          </form>
        </div>

        {/* Right Side: Products List */}
        <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Layers className="h-8 w-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Database Products</span>
              <p className="text-xs text-slate-500 mt-1">SewaCircle360.online is hardcoded as default. Added products will show up next to it.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Version</th>
                    <th className="py-4 px-6">Live URL</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{prod.name}</span>
                          <span className="text-xs text-slate-450 line-clamp-1 max-w-xs">{prod.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{prod.category}</td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-450">v{prod.version}</td>
                      <td className="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">
                        {prod.liveUrl ? (
                          <a href={prod.liveUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                            Link <Globe className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete product"
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
