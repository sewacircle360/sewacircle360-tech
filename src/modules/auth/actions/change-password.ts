"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function changePasswordAction(newPassword: string) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return { error: "You must be signed in to perform this action." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { error: "New password must be at least 6 characters long." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
      }
    });

    revalidatePath("/admin");
    revalidatePath("/portal");
    revalidatePath("/student");
    return { success: "Your password has been updated successfully!" };
  } catch (error) {
    console.error("changePasswordAction error:", error);
    return { error: "Failed to update password. Please try again." };
  }
}
