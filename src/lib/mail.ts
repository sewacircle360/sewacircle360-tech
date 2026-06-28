"use server";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultSender = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("Email alert: RESEND_API_KEY is not configured in .env. Email transmission skipped.");
    return { error: "Email configuration key missing in environment variables." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from || `SewaCircle360 Tech <${defaultSender}>`,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Resend API returned error:", err);
      return { error: err.message || "Email server rejected connection." };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("sendEmail utility error:", error);
    return { error: "Failed to dispatch email request." };
  }
}
