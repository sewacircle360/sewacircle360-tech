"use client";

import { useState } from "react";
import { Wrench, Plus, Trash2, Edit3, Check, Code, Search, Globe, Shield, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminServicesPage() {
  const [services, setServices] = useState([
    { id: "1", title: "Enterprise Web Development", category: "Core Development", pricing: "Starting at $2,500", duration: "4-6 weeks", active: true },
    { id: "2", title: "Custom CRM & Business OS", category: "Internal Systems", pricing: "Starting at $4,999", duration: "8-12 weeks", active: true },
    { id: "3", title: "iOS & Android Mobile Applications", category: "App Engineering", pricing: "Starting at $6,000", duration: "10-14 weeks", active: true },
    { id: "4", title: "SEO & Digital Engine Optimization", category: "Marketing Tech", pricing: "Starting at $750/mo", duration: "Ongoing", active: true },
  ]);

  const [newService, setNewService] = useState({ title: "", category: "Core Development", pricing: "", duration: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title) return;
    setServices([
      ...services,
      {
        id: String(Date.now()),
        title: newService.title,
        category: newService.category,
        pricing: newService.pricing || "TBD / Custom Quote",
        duration: newService.duration || "Varies",
        active: true
      }
    ]);
    setNewService({ title: "", category: "Core Development", pricing: "", duration: "" });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Services Catalog Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build and edit the consulting services displayed on the public landing and estimation screens.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" /> Add Catalog Service
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/60 p-6 border dark:border-slate-800 rounded-2xl"
        >
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Service Title *</label>
              <input
                type="text"
                placeholder="Cloud Infrastructure Setup"
                required
                value={newService.title}
                onChange={e => setNewService({ ...newService, title: e.target.value })}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/80 border rounded-xl outline-none focus:border-primary text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Category</label>
              <select
                value={newService.category}
                onChange={e => setNewService({ ...newService, category: e.target.value })}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/80 border rounded-xl outline-none focus:border-primary text-foreground"
              >
                <option value="Core Development">Core Development</option>
                <option value="Internal Systems">Internal Systems</option>
                <option value="App Engineering">App Engineering</option>
                <option value="Marketing Tech">Marketing Tech</option>
                <option value="Cloud Services">Cloud Services</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Pricing Tier</label>
              <input
                type="text"
                placeholder="Starting at $3,500"
                value={newService.pricing}
                onChange={e => setNewService({ ...newService, pricing: e.target.value })}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/80 border rounded-xl outline-none focus:border-primary text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-bold uppercase text-slate-500">Estimated Duration</label>
                <input
                  type="text"
                  placeholder="3-5 weeks"
                  value={newService.duration}
                  onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/80 border rounded-xl outline-none focus:border-primary text-foreground"
                />
              </div>
              <button
                type="submit"
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/95 flex items-center justify-center cursor-pointer border-0 shrink-0 h-10 w-10 mt-auto"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/45 transition-all duration-300"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

            <div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary dark:text-accent rounded-full">
                  {service.category}
                </span>
                <button
                  onClick={() => handleDelete(service.id)}
                  title="Remove service"
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display mt-3">
                {service.title}
              </h3>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/85 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-450 uppercase font-semibold">Pricing Tier</span>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-350">{service.pricing}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-450 uppercase font-semibold">Delivery Time</span>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-350">{service.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
