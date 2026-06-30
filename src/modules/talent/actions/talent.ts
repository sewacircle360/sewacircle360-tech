"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function submitTalentProfile(data: {
  fullName: string;
  university: string;
  rollNumber: string;
  officialEmail: string;
  personalEmail: string;
  mobileNumber: string;
  degree: string;
  branch: string;
  yearSemester: string;
  cgpa?: string;
  skills: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioLink?: string;
  resumeData?: string;
  resumeName?: string;
}) {
  try {
    // Validate required fields
    if (
      !data.fullName ||
      !data.university ||
      !data.rollNumber ||
      !data.officialEmail ||
      !data.personalEmail ||
      !data.mobileNumber ||
      !data.degree ||
      !data.branch ||
      !data.yearSemester
    ) {
      return { error: "Please fill out all required fields." };
    }

    const profile = await db.talentProfile.create({
      data: {
        fullName: data.fullName,
        university: data.university,
        rollNumber: data.rollNumber,
        officialEmail: data.officialEmail,
        personalEmail: data.personalEmail,
        mobileNumber: data.mobileNumber,
        degree: data.degree,
        branch: data.branch,
        yearSemester: data.yearSemester,
        cgpa: data.cgpa || null,
        skills: data.skills || [],
        githubProfile: data.githubProfile || null,
        linkedinProfile: data.linkedinProfile || null,
        portfolioLink: data.portfolioLink || null,
        resumeData: data.resumeData || null,
        resumeName: data.resumeName || null,
      },
    });

    // Send confirmation email to student
    try {
      await sendEmail({
        to: data.personalEmail,
        subject: "Welcome to the SewaCircle360 Talent Network!",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase;">SewaCircle360</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Talent Pool & Early Access Program</p>
            </div>
            
            <h3 style="color: #0f172a; font-size: 18px; margin-top: 0;">Welcome, ${data.fullName}!</h3>
            <p style="color: #334155; line-height: 1.6; font-size: 14px;">
              Thank you for joining the <strong>SewaCircle360 Talent Network</strong>. We have successfully registered your profile in our database.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0;">
              <h4 style="color: #475569; font-size: 13px; font-weight: bold; text-transform: uppercase; margin-top: 0; letter-spacing: 0.05em; margin-bottom: 12px;">Submitted Academic & Contact Profile:</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
                <tr>
                  <td style="padding: 4px 0; font-weight: 600; width: 40%;">University:</td>
                  <td style="padding: 4px 0;">${data.university}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 600;">Degree / Branch:</td>
                  <td style="padding: 4px 0;">${data.degree} (${data.branch})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 600;">Skills Selected:</td>
                  <td style="padding: 4px 0;">${(data.skills || []).join(", ") || "None listed"}</td>
                </tr>
              </table>
            </div>

            <p style="color: #334155; line-height: 1.6; font-size: 14px;">
              <strong>What's next?</strong> Our administrative team regularly reviews registrations based on live project workloads and talent requests. We will reach out to you directly when a matching remote opportunity, client project, or freelance position matches your skillset.
            </p>

            <p style="color: #ef4444; font-size: 11px; margin-top: 24px;">
              *Disclaimer: Submitting this registration does not guarantee an immediate internship, project assignment, or employment. Selected candidates are contacted as opportunities arise.
            </p>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              © SewaCircle360 Technologies. India.
            </p>
          </div>
        `,
      });

      // Send to official email as well if different
      if (data.officialEmail && data.officialEmail !== data.personalEmail) {
        await sendEmail({
          to: data.officialEmail,
          subject: "Welcome to the SewaCircle360 Talent Network!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3>Talent Network Registration Confirmation</h3>
              <p>Hi ${data.fullName},</p>
              <p>Your profile has been added to the SewaCircle360 Talent Network.</p>
              <p>We'll notify you on this official email as well once matching projects or opportunities become available.</p>
            </div>
          `
        });
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    revalidatePath("/admin/talent-network");
    return { success: "Welcome to the SewaCircle360 Talent Network! We'll review your profile and contact you when a suitable live project or opportunity matches your skills." };
  } catch (error) {
    console.error("submitTalentProfile error:", error);
    return { error: "Failed to submit registration. Please try again." };
  }
}

export async function getTalentProfiles() {
  try {
    return await db.talentProfile.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getTalentProfiles error:", error);
    return [];
  }
}

export async function deleteTalentProfile(id: string) {
  try {
    await db.talentProfile.delete({
      where: { id },
    });
    revalidatePath("/admin/talent-network");
    return { success: "Profile deleted successfully!" };
  } catch (error) {
    console.error("deleteTalentProfile error:", error);
    return { error: "Failed to delete profile." };
  }
}

export async function hireTalentAsEmployee(talentId: string, designation: string) {
  try {
    const bcrypt = await import("bcryptjs");
    const { logAuditEvent } = await import("@/lib/audit");

    const profile = await db.talentProfile.findUnique({ where: { id: talentId } });
    if (!profile) return { error: "Talent profile not found." };

    const existing = await db.user.findUnique({ where: { email: profile.personalEmail } });
    if (existing) {
      return { error: "An employee or user account with this email already exists." };
    }

    const employeeRole = await db.role.findUnique({ where: { name: "EMPLOYEE" } });
    if (!employeeRole) {
      return { error: "EMPLOYEE role does not exist." };
    }

    const hashedPassword = await bcrypt.hash("123456789", 10);

    const employee = await db.user.create({
      data: {
        name: profile.fullName,
        email: profile.personalEmail,
        passwordHash: hashedPassword,
        roleId: employeeRole.id,
        status: "ACTIVE",
        mustChangePassword: true,
        designation: designation || "Intern / Trainee",
        phone: profile.mobileNumber,
        joiningDate: new Date(),
      }
    });

    await db.talentProfile.delete({ where: { id: talentId } });

    await sendEmail({
      to: profile.personalEmail,
      subject: "Welcome to SewaCircle360 Tech - Accepted!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to the SewaCircle360 Team!</h2>
          <p>Congratulations ${profile.fullName},</p>
          <p>You have been accepted for the position of <strong>${designation || "Intern / Trainee"}</strong>. Your employee workspace has been activated:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Portal Login:</strong> <a href="https://sewacircle360tech.online/auth/login">https://sewacircle360tech.online/auth/login</a></p>
            <p style="margin: 5px 0;"><strong>Username:</strong> ${profile.personalEmail}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> 123456789</p>
          </div>
          <p style="color: #ef4444; font-size: 11px;">Please reset your password on your first login.</p>
        </div>
      `
    }).catch(err => console.error("Hire email failed:", err));

    try {
      await logAuditEvent("HIRE_TALENT", `Registered talent ${profile.fullName} as employee`);
    } catch (auditErr) {
      console.error("Failed to log audit event:", auditErr);
    }

    revalidatePath("/admin/talent-network");
    revalidatePath("/admin/employees");
    return { success: "Talent registered successfully! Login details have been emailed.", employee };
  } catch (error) {
    console.error("hireTalentAsEmployee error:", error);
    return { error: "Failed to hire talent." };
  }
}
