"use client";

import { useState, useTransition } from "react";
import { addExpense, deleteExpense } from "../actions/expenses";
import { Trash2, Loader2, DollarSign, Calendar, FileText, PlusCircle, PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from "recharts";

interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date | string;
}

interface ProjectExpensesProps {
  projectId: string;
  initialExpenses: ExpenseItem[];
}

const CATEGORIES = ["HOSTING", "DOMAIN", "DEVELOPER_PAYOUT", "MARKETING", "OTHER"];

export function ProjectExpenses({ projectId, initialExpenses }: ProjectExpensesProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("DEVELOPER_PAYOUT");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid amount." });
      return;
    }
    if (!description.trim()) {
      setMsg({ type: "error", text: "Please enter a description." });
      return;
    }

    startTransition(async () => {
      const result = await addExpense({
        projectId,
        amount: Number(amount),
        category,
        description,
        date: new Date(date),
      });

      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else if (result.expense) {
        setExpenses(prev => [
          {
            id: result.expense!.id,
            amount: result.expense!.amount,
            category: result.expense!.category,
            description: result.expense!.description,
            date: result.expense!.date,
          },
          ...prev,
        ]);
        setMsg({ type: "success", text: "Expense logged successfully!" });
        setAmount("");
        setDescription("");
        setShowAddForm(false);
        setTimeout(() => setMsg(null), 2500);
      }
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    startTransition(async () => {
      const result = await deleteExpense(id, projectId);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        setMsg({ type: "success", text: "Expense deleted." });
        setTimeout(() => setMsg(null), 2500);
      }
    });
  };

  // Grouped breakdown
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const breakdown = CATEGORIES.reduce((acc, cat) => {
    const sum = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    if (sum > 0) acc.push({ category: cat, amount: sum, percent: total > 0 ? (sum / total) * 100 : 0 });
    return acc;
  }, [] as Array<{ category: string; amount: number; percent: number }>);

  const CATEGORY_COLORS: Record<string, string> = {
    HOSTING: "#3b82f6",
    DOMAIN: "#a855f7",
    DEVELOPER_PAYOUT: "#eab308",
    MARKETING: "#10b981",
    OTHER: "#ef4444"
  };

  const pieData = breakdown.map(item => ({
    name: item.category.replace("_", " "),
    value: item.amount,
    color: CATEGORY_COLORS[item.category] || "#64748b"
  }));

  return (
    <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-6 flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-primary" /> Costing & Project Expenses
          </h3>
          <p className="text-[10px] text-slate-450 mt-1">Log external payouts, third-party server hosting fees, and domains.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3.5 py-1.8 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          {showAddForm ? "Close Form" : "Log Expense"}
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${msg.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
          {msg.text}
        </div>
      )}

      {/* Log Form */}
      {showAddForm && (
        <form onSubmit={handleAddExpense} className="p-4 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
            <input
              type="text"
              placeholder="e.g. Monthly server hosting cost on AWS"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expense Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground cursor-pointer"
            />
          </div>

          <div className="flex items-end justify-end sm:col-span-1">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Submit Expense
            </button>
          </div>
        </form>
      )}

      {/* Grid: Category Summary & List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Breakdown Panel */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expense Category Share</span>
          {breakdown.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-950/20 border border-dashed dark:border-slate-800/80 rounded-xl">
              <span className="text-xs text-slate-400">No expenses logged yet.</span>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/20 p-4 border dark:border-slate-800/60 rounded-2xl flex flex-col gap-3">
              {/* Pie Chart container */}
              <div className="h-36 w-full no-print relative select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff", fontSize: "10px" }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Progress bars list */}
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <span className="uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />
                      {item.category.replace("_", " ")}
                    </span>
                    <span>₹{item.amount.toLocaleString("en-IN")} ({item.percent.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.percent}%`, backgroundColor: CATEGORY_COLORS[item.category] }} />
                  </div>
                </div>
              ))}
              <div className="border-t dark:border-slate-850 pt-2 mt-2 flex justify-between text-xs font-bold text-slate-800 dark:text-white">
                <span>Total Staged Costs</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Expenses List */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Staged Ledger Items</span>
          {expenses.length === 0 ? (
            <div className="py-8 text-center">
              <span className="text-xs text-slate-400">No list entries.</span>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y dark:divide-slate-800">
              {expenses.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.description}</p>
                    <div className="flex gap-2 items-center text-[10px] text-slate-450 mt-1 uppercase font-semibold">
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[8px] tracking-wider text-slate-500 font-bold">{item.category.replace("_", " ")}</span>
                      <span>·</span>
                      <span>{new Date(item.date).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">₹{item.amount.toLocaleString("en-IN")}</span>
                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      disabled={isPending}
                      className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
