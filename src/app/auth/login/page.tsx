import { LoginForm } from "@/modules/auth/components/LoginForm";
import { ScrollLock } from "@/components/dashboard/ScrollLock";

export const metadata = {
  title: "Login | SewaCircle360 Business OS",
  description: "Secure login to access the SewaCircle360 Technologies business operating system.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      <ScrollLock />
      {/* Floating blurred background mesh grids */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <LoginForm />
    </main>
  );
}
