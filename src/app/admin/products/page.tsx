"use client";

import { useState, useEffect, useTransition } from "react";
import { createProduct, getProducts, deleteProduct } from "@/modules/products/actions/products";
import { Layers, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Products Catalog CMS
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage dynamic SaaS products and ERP modules displayed on the public products catalog page.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Register Product
        </Link>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
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
                        className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer bg-transparent border-0"
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
  );
}
