"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAgreements() {
  try {
    return await db.agreement.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
  } catch (error) {
    console.error("getAgreements error:", error);
    return [];
  }
}

export async function getAgreementById(id: string) {
  try {
    return await db.agreement.findUnique({
      where: { id },
      include: { client: true },
    });
  } catch (error) {
    console.error("getAgreementById error:", error);
    return null;
  }
}

export async function getAgreementsByClientId(clientId: string) {
  try {
    return await db.agreement.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getAgreementsByClientId error:", error);
    return [];
  }
}

export async function createAgreement(data: {
  agreementNumber: string;
  clientId: string;
  title: string;
  content: string;
}) {
  try {
    const existing = await db.agreement.findUnique({ where: { agreementNumber: data.agreementNumber } });
    if (existing) {
      return { error: "An agreement with this number already exists." };
    }

    const agreement = await db.agreement.create({
      data: {
        agreementNumber: data.agreementNumber,
        clientId: data.clientId,
        title: data.title,
        content: data.content,
        status: "DRAFT",
      }
    });

    revalidatePath("/admin/agreements");
    revalidatePath("/portal/agreements");
    return { success: "Agreement generated successfully!", agreement };
  } catch (error) {
    console.error("createAgreement error:", error);
    return { error: "Failed to create agreement." };
  }
}

export async function signAgreementAction(id: string, signatureData: string) {
  try {
    const agreement = await db.agreement.update({
      where: { id },
      data: {
        clientSignature: signatureData,
        signedAt: new Date(),
        status: "SIGNED",
      }
    });

    revalidatePath(`/admin/agreements/${id}`);
    revalidatePath(`/portal/agreements/${id}`);
    revalidatePath("/portal");

    return { success: "Agreement signed successfully!", agreement };
  } catch (error) {
    console.error("signAgreementAction error:", error);
    return { error: "Failed to sign agreement." };
  }
}
