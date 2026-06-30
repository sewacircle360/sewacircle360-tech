import { db } from "@/lib/db";
import { BadgeCheck, ShieldAlert, Calendar, Mail, User, Bookmark, ArrowRight, ShieldCheck, Hourglass } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyEmployeePage({ params }: PageProps) {
  const { id } = await params;

  let employee = null;
  let isValid = false;
  let isExpired = false;

  try {
    employee = await db.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (
      employee &&
      ["EMPLOYEE", "ADMIN", "SUPER_ADMIN"].includes(employee.role.name) &&
      employee.status === "ACTIVE"
    ) {
      if (employee.cardExpiryDate && new Date() > new Date(employee.cardExpiryDate)) {
        isExpired = true;
      } else {
        isValid = true;

        // Log the scan to the database
        try {
          const headerList = await headers();
          const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0] || headerList.get("x-real-ip") || "Unknown IP";
          const userAgent = headerList.get("user-agent") || "Unknown Browser";

          await db.verificationLog.create({
            data: {
              userId: employee.id,
              ipAddress,
              userAgent,
            },
          });
        } catch (logErr) {
          console.error("Failed to log verification scan:", logErr);
        }
      }
    }
  } catch (error) {
    console.error("Verification DB query failed:", error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glowing Ambient Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Company Header */}
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <Link href="https://sewacircle360tech.online" className="flex items-center gap-2">
            <img src="/logo.png" alt="SewaCircle360Tech" className="h-8 w-auto object-contain" />
            <span className="text-lg font-black tracking-wide bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent font-display">
              SewaCircle360Tech
            </span>
          </Link>
          <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-500 mt-1">
            Official Security & Verification Portal
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mt-3"></div>
        </div>

        {isValid && employee ? (
          /* SUCCESS STATE: VERIFIED EMPLOYEE */
          <div className="space-y-6">
            
            {/* Verification Status Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-full text-emerald-400 shadow-sm animate-pulse">
                <BadgeCheck className="h-5 w-5 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">Verified Staff Member</span>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="h-28 w-28 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center">
                {employee.image ? (
                  <img
                    src={employee.image}
                    alt={employee.name || "Employee"}
                    className="h-full w-full rounded-full object-cover border-2 border-slate-950"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-slate-950 text-slate-550 font-bold uppercase text-xl">
                    <User className="h-10 w-10 text-slate-650" />
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-extrabold text-white mt-4 text-center">
                {employee.name}
              </h2>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-center mt-1">
                {employee.designation || "Team Member"}
              </span>
            </div>

            {/* Employee Credentials Table */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 space-y-3.5 text-sm">
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2 text-slate-550">
                  <Bookmark className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Employee ID</span>
                </div>
                <span className="font-mono font-bold text-slate-200">{employee.employeeId || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2 text-slate-555">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Official Email</span>
                </div>
                <span className="font-semibold text-slate-250 truncate max-w-[220px]">{employee.email}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2 text-slate-555">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Date of Joining</span>
                </div>
                <span className="font-semibold text-slate-250">
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-555">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Active</span>
                </div>
              </div>

            </div>

            {/* Official Confirmation text */}
            <p className="text-[10px] text-slate-550 text-center leading-relaxed px-4">
              SewaCircle360Tech hereby certifies that the individual listed above is an authorized active member of our organization. For further queries, please reach out to admin support.
            </p>

          </div>
        ) : isExpired && employee ? (
          /* EXPIRED STATE: ID CARD HAS EXPIRED */
          <div className="space-y-6">
            
            {/* Warning Expiry Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-full text-amber-500 shadow-sm animate-pulse">
                <Hourglass className="h-5 w-5 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">ID Card Expired</span>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex flex-col items-center opacity-60">
              <div className="h-28 w-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 to-orange-500 shadow-lg flex items-center justify-center">
                {employee.image ? (
                  <img
                    src={employee.image}
                    alt={employee.name || "Employee"}
                    className="h-full w-full rounded-full object-cover border-2 border-slate-950"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-slate-950 text-slate-550 font-bold uppercase text-xl">
                    <User className="h-10 w-10 text-slate-650" />
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-extrabold text-white mt-4 text-center">
                {employee.name}
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mt-1">
                {employee.designation || "Team Member"}
              </span>
            </div>

            {/* Credentials Table (Marked as Expired) */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 space-y-3.5 text-sm">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Employee ID</span>
                <span className="font-mono font-bold text-slate-400">{employee.employeeId || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Expiry Date</span>
                <span className="font-bold text-red-500">
                  {new Date(employee.cardExpiryDate!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="font-bold text-red-500 text-xs uppercase tracking-wider">Expired</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-550 text-center leading-relaxed px-4">
              ⚠️ <strong>Warning:</strong> The ID card credentials of this employee have expired and are no longer valid. The individual is not authorized to use this card for identification.
            </p>

          </div>
        ) : (
          /* ERROR STATE: VERIFICATION FAILED */
          <div className="space-y-6 text-center">
            
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 animate-bounce">
                <ShieldAlert className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black text-red-500 uppercase tracking-wide">
                Verification Failed
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                The Employee ID or Link scanned is either inactive, revoked, or does not exist in the SewaCircle360Tech database directory.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 text-xs text-slate-500 text-left space-y-2">
              <p>⚠️ <strong>Important Note:</strong> Please ensure that the ID card QR code belongs to a valid SewaCircle360Tech identity asset.</p>
              <p>If you believe this is an error, please contact the SewaCircle360Tech Human Resources department to get your record registered or updated.</p>
            </div>

          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="https://sewacircle360tech.online"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-400 transition-colors group"
          >
            Go to SewaCircle360Tech Homepage
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
