import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
  
  if (!resend) {
    console.log("[EMAIL DISPATCH] Mock send: Resend API Key is not set in environment.");
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: `SewaCircle360 OS <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log("[EMAIL DISPATCH] Resend Response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("[EMAIL DISPATCH] Resend error:", error);
    return { error: "Failed to dispatch email notification." };
  }
}
