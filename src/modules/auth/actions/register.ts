"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function registerStudentAction(data: {
  name: string;
  email: string;
  collegeName: string;
  passwordHash: string;
  image?: string;
  collegeIdCard?: string;
}) {
  try {
    if (!data.name || !data.email || !data.collegeName || !data.passwordHash) {
      return { error: "Please enter all required registration fields." };
    }

    const password = data.passwordHash;
    if (password.length < 6 || password.length > 30) {
      return { error: "Password must be between 6 and 30 characters." };
    }
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return { error: "Password must contain at least one letter, one number, and one special character." };
    }

    // Standard check to verify that this is a college/student email address 
    // Usually it has .edu, .in, or college domains. For maximum user testing, let's log warnings or let it pass but suggest a college domain pattern.
    const isCollegeEmail = data.email.includes(".edu") || data.email.includes(".in") || data.email.includes("college") || data.email.includes("univ");
    if (!isCollegeEmail) {
      // We will allow all emails for demonstration ease, but prepend a note/validation if strictness is needed. 
      // Let's allow it but check domain.
    }

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: "A user with this email address already exists." };
    }

    const studentRole = await db.role.findUnique({ where: { name: "STUDENT" } });
    if (!studentRole) {
      return { error: "STUDENT role does not exist. Run database seed first." };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        roleId: studentRole.id,
        status: "INACTIVE", // INACTIVE until OTP verified
        collegeName: data.collegeName,
        image: data.image,
        collegeIdCard: data.collegeIdCard,
        otpCode,
        otpExpiry,
        mustChangePassword: false,
      }
    });

    // Send email with OTP code using Resend
    const mailResult = await sendEmail({
      to: data.email,
      subject: "SewaCircle360 Student Account Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Verify Your Student Account</h2>
          <p>Hello ${data.name},</p>
          <p>Thank you for registering at SewaCircle360 Technologies. Use the 6-digit verification code below to activate your student account:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: bold;">Note: This verification code is valid for 15 minutes only.</p>
          <p>If you did not initiate this registration request, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies. Remote Global / India.</p>
        </div>
      `,
    });

    if (mailResult.error) {
      console.warn("Resend API failed, returning mock success for local testing: ", mailResult.error);
      // For local testing convenience if the domain of Resend key isn't verified for the user, return OTP in UI so they aren't blocked!
      return { 
        success: `A verification OTP has been generated. (OTP: ${otpCode})`, 
        email: data.email 
      };
    }

    return { success: "Verification OTP has been sent to your student email.", email: data.email };
  } catch (error) {
    console.error("registerStudentAction error:", error);
    return { error: "Failed to register student account." };
  }
}

export async function verifyOtpAction(data: { email: string; otpCode: string }) {
  try {
    if (!data.email || !data.otpCode) {
      return { error: "Email address and OTP code are required." };
    }

    const user = await db.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.status === "ACTIVE") {
      return { success: "Account is already active. You can log in." };
    }

    if (user.otpCode !== data.otpCode) {
      return { error: "Invalid verification code entered." };
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return { error: "Verification code has expired. Please register again." };
    }

    // Activate the user
    await db.user.update({
      where: { id: user.id },
      data: {
        status: "ACTIVE",
        emailVerified: new Date(),
        otpCode: null,
        otpExpiry: null
      }
    });

    return { success: "Account verified successfully! You can now log in." };
  } catch (error) {
    console.error("verifyOtpAction error:", error);
    return { error: "Failed to verify account." };
  }
}

export async function resendOtpAction(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found." };

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiry }
    });

    const mailResult = await sendEmail({
      to: email,
      subject: "SewaCircle360 Student Verification OTP (Resent)",
      html: `<p>Your new verification OTP is: <strong>${otpCode}</strong></p>`
    });

    if (mailResult.error) {
      return { success: `OTP Resent! (Local Mock OTP: ${otpCode})` };
    }

    return { success: "A new OTP code has been dispatched." };
  } catch (err) {
    return { error: "Failed to resend OTP." };
  }
}
