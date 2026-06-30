import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { MyIdCard } from "@/components/dashboard/MyIdCard";

export const metadata = {
  title: "My Profile Settings | SewaCircle360 OS",
};

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect("/auth/login");
  }

  // Fetch complete user and role records from DB to ensure data freshness
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true }
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none font-display">
          My Account Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View your system privileges, manage account details, and reset authentication credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-7 flex justify-start items-start w-full">
          <ProfileForm 
            initialUser={{
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.image,
              roleName: dbUser.role.name
            }} 
          />
        </div>

        {dbUser.employeeId && (
          <div className="lg:col-span-5 w-full">
            <MyIdCard 
              user={{
                id: dbUser.id,
                name: dbUser.name,
                image: dbUser.image,
                employeeId: dbUser.employeeId,
                designation: dbUser.designation,
                bloodGroup: dbUser.bloodGroup,
                joiningDate: dbUser.joiningDate,
                cardExpiryDate: dbUser.cardExpiryDate,
                phone: dbUser.phone,
                emergencyContact: dbUser.emergencyContact
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
