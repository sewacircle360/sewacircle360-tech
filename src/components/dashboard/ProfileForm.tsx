"use client";

import { useState } from "react";
import { updateProfile } from "@/modules/profile/actions/updateProfile";
import { Loader2, CheckCircle2, AlertTriangle, User, Mail, ShieldAlert, KeyRound, Image as ImageIcon } from "lucide-react";

interface ProfileFormProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roleName: string;
  };
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [image, setImage] = useState(initialUser.image || "");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const res = await updateProfile({
      name,
      email,
      password: password || undefined,
      image: image || undefined,
    });

    setIsPending(false);
    if (res.success) {
      setMessage({ type: "success", text: "Profile details updated successfully! Please refresh or re-sign in to sync changes." });
      setPassword("");
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update profile." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-ccslate-850 p-6 sm:p-8 rounded-3xl shadow-md backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/80 dark:border-slate-800/80">
        {/* Profile Avatar Preview */}
        <div className="w-20 h-20 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center font-bold text-2xl text-primary font-display uppercase overflow-hidden shrink-0">
          {image ? (
            <img src={image} alt="Profile Avatar" className="w-full h-full object-cover" onError={() => setImage("")} />
          ) : (
            name ? name.substring(0, 2) : "US"
          )}
        </div>
        
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Personal Details
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your account details, photo, and secure authentication keys.
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          message.type === "success" 
            ? "bg-green-500/10 text-green-500 border-green-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary"
            />
          </div>
        </div>

        {/* Email input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary"
            />
          </div>
        </div>

        {/* Photo URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avatar URL (Profile Photo)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={isPending}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary"
            />
          </div>
        </div>

        {/* Access Role Badge (Readonly) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Assigned Role
          </label>
          <div className="relative">
            <ShieldAlert className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              readOnly
              value={initialUser.roleName.replace(/_/g, ' ')}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-ccslate-850/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-slate-400 dark:text-slate-500 select-none uppercase font-extrabold tracking-wider"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="flex flex-col gap-1.5 border-t border-border/80 dark:border-slate-800/80 pt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Change Password (Leave blank to keep current)
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all duration-300 disabled:opacity-75 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving Updates...
          </>
        ) : (
          <span>Save Changes</span>
        )}
      </button>
    </form>
  );
}
