"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function updateProfile(data: {
  name: string;
  email: string;
  password?: string;
  image?: string;
}) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, error: "Unauthorized access" };
    }

    const userId = session.user.id;

    // Check if email is already taken by another user
    if (data.email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== userId) {
        return { success: false, error: "Email is already taken by another account" };
      }
    }

    // Build update payload
    const updateData: any = {
      name: data.name,
      email: data.email,
      image: data.image || null,
    };

    // If new password is provided, hash it first
    if (data.password && data.password.trim() !== "") {
      if (data.password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long" };
      }
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    // Update user in database
    await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Profile update failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}
