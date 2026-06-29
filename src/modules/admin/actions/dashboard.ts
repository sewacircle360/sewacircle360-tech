"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";
import { logAuditEvent } from "@/lib/audit";

// Clients
export async function getClients() {
  try {
    return await db.client.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getClients error:", error);
    return [];
  }
}

// Projects
export async function createProjectAction(data: {
  name: string;
  clientId: string;
  startDate?: string;
  deadline?: string;
  budget?: number;
  status?: string;
}) {
  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        budget: data.budget || 0,
        status: data.status || "PLANNING",
        progress: 0
      }
    });

    revalidatePath("/admin/projects");
    return { success: "Project created successfully!", project };
  } catch (error) {
    console.error("createProjectAction error:", error);
    return { error: "Failed to create project." };
  }
}

// Invoices
export async function getInvoices() {
  try {
    return await db.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    return [];
  }
}

// Quotations
export async function getQuotations() {
  try {
    return await db.quotation.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getQuotations error:", error);
    return [];
  }
}

// Agreements
export async function getAgreements() {
  try {
    return await db.agreement.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getAgreements error:", error);
    return [];
  }
}

// Meetings
export async function getMeetings() {
  try {
    return await db.meeting.findMany({
      orderBy: { preferredDate: "desc" }
    });
  } catch (error) {
    console.error("getMeetings error:", error);
    return [];
  }
}

// Audit Logs
export async function getAuditLogs() {
  try {
    return await db.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("getAuditLogs error:", error);
    return [];
  }
}

// Agreement Creator & Auto Client Creation
export async function createAgreementAction(data: {
  clientType: "registered" | "manual";
  clientId?: string;
  manualClient?: {
    companyName: string;
    ownerName: string;
    email: string;
    phone?: string;
    address?: string;
    gst?: string;
  };
  projectName: string;
  timeline: string;
  totalBudget: number;
  currency: string;
  milestone1Percent: number;
  milestone2Percent: number;
  milestone3Percent: number;
  status?: string; // DRAFT or SENT
}) {
  try {
    let clientId = data.clientId;

    // Create client profile on the fly if manual unregistered client option was used
    if (data.clientType === "manual" && data.manualClient) {
      // Check if client with this email already exists
      const existingClient = await db.client.findUnique({
        where: { email: data.manualClient.email }
      });

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const client = await db.client.create({
          data: {
            companyName: data.manualClient.companyName,
            ownerName: data.manualClient.ownerName,
            email: data.manualClient.email,
            phone: data.manualClient.phone || null,
            address: data.manualClient.address || null,
            gst: data.manualClient.gst || null,
          }
        });
        clientId = client.id;
      }
    }

    if (!clientId) {
      return { error: "No valid client profile selected or created." };
    }

    // Retrieve client details for the document assembly
    const client = await db.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return { error: "Client not found in database." };
    }

    // Calculate Milestone amounts
    const amt1 = (data.totalBudget * data.milestone1Percent) / 100;
    const amt2 = (data.totalBudget * data.milestone2Percent) / 100;
    const amt3 = (data.totalBudget * data.milestone3Percent) / 100;
    const formatCurrency = (val: number) => `${data.currency} ${val.toLocaleString("en-IN")}`;

    // Auto-Generate Software Development Agreement Document Text
    const documentText = `SOFTWARE DEVELOPMENT AGREEMENT

This Software Development Agreement (hereinafter referred to as the "Agreement") is entered into and made effective as of ${new Date().toLocaleDateString("en-IN")}, by and between the following contracting parties:

1. PARTIES TO THE AGREEMENT
DEVELOPER / SERVICE PROVIDER: SewaCircle360 Technology, operating under the executive leadership of Deepak Bawa (Founder) and Riya Garg (Co-Founder) (hereinafter referred to as the "Developer").
AND
THE CLIENT: ${client.ownerName} representing ${client.companyName}, having its primary place of business operations at ${client.address || "Client Address"} (hereinafter referred to as the "Client").

2. DEFINITIONS & INTERPRETATION
- "System" / "Software": Refers explicitly to the Custom ${data.projectName} System developed tailored for the Client's specific requirements.
- "Specifications": The documented list of software requirements, user dashboards, and technical protocols explicitly articulated in this document.
- "Deliverables": The specific functional code packages, active deployment setups, or architectural configurations scheduled for handover.

3. PROJECT SCOPE & PURPOSE
The core objective of this corporate engagement is the engineering and deployment of a secure, professional Custom ${data.projectName} System. The software is designed to provide comprehensive, automated, and centralized visibility into the Client's business workflow.

4. CORE STOCK MANAGEMENT FEATURES
The Developer explicitly agrees to build, configure, and integrate the following functional modules making up the comprehensive core architecture:
- Core UI Layout & Custom User Workflows.
- Database Infrastructure & Schema Mapping.
- Interactive Dashboard Reports.
- Role-based Security Permissions & Data Auditing.

5. CLOUD HOSTING, INFRASTRUCTURE & CREDENTIALS POLICY
To establish operational security and corporate transparency, the deployment infrastructure rules are declared as follows:
- Third-Party Infrastructure & Billing: All external server fees, domain rates, or computing costs are the sole financial responsibility of the Client.
- Render Cloud / Hosting Charges: The system will initially be deployed using hosting infrastructure configurations via Render or Vercel.
- Secure Technical Handover: Following successful live deployment and final project submission, all account controls will be formally delivered to the Client starting exactly one (1) week following final deployment.

6. DELIVERABLES
- Custom software build deployed live on the client's cloud environment.
- Normalized relational database schema.
- Operations manual covering credentials and control guidelines.

7. PROJECT TIMELINE & MILESTONES
- Phase I (Setup): Account linking, database architecture, and initial backend setup (Weeks 1 - 2).
- Phase II (Core Build): Core system building and dashboards (Weeks 3 - 5).
- Phase III (QA): Integration checks, bug testing, and permission locks (Weeks 6 - 7).
- Phase IV (Launch): Handover and production deployment (${data.timeline}).

8. PAYMENT TERMS & FINANCIAL SCHEDULE
In consideration of the custom software development services provided by SewaCircle360 Technology, the Client agrees to make payments according to the following corporate milestone schedule:
- Milestone 1: ${data.milestone1Percent}% Advance Payment - Amount: ${formatCurrency(amt1)}. Due immediately upon execution of this Agreement prior to the start of development. This payment is strictly non-refundable.
- Milestone 2: ${data.milestone2Percent}% Demo Stage Payment - Amount: ${formatCurrency(amt2)}. Due immediately following completion of core system demonstrations and dashboard screens.
- Milestone 3: ${data.milestone3Percent}% Final Submission Payment - Amount: ${formatCurrency(amt3)}. Due immediately prior to the final production live release and credential handover.

9. CLIENT RESPONSIBILITIES
- Providing all baseline content, branding assets, and server access credentials within seven (7) days of project launch.
- Providing timely feedback during review intervals, ensuring developer queries are answered within 48 business hours.

10. REVISION POLICY
- The Client is entitled to a maximum of three (3) iterative rounds of revisions. Revisions are restricted to user interface fine-tuning, layout structuring, or minor field adjustments.
- Any request for entirely new functional features or structural logic changes will require a separate written addendum outlining additional engineering costs.

11. TESTING & USER ACCEPTANCE (UAT)
- The Client shall have seven (7) calendar days to evaluate the system on a staging setup.
- If the Client fails to provide formal defect feedback within this 7-day Testing Window, the system will be legally deemed accepted, and the final payment milestone will become due.

12. WARRANTY & SUPPORT
- The Developer grants a 30-day post-launch technical warranty. This warranty covers resolving database bugs or system crashes at no extra charge.

13. MAINTENANCE & AMC
- Following the expiration of the 30-day warranty, the Client can opt for a structured Annual Maintenance Contract (AMC) negotiated independently.

14. CONFIDENTIALITY (NDA)
- Both parties agree to hold all shared corporate data, business processes, and source code in strict confidence.

15. INTELLECTUAL PROPERTY RIGHTS
- Pre-Existing Materials: The Developer retains ownership over all pre-existing utility frameworks used.
- Custom Deliverables: Upon clear receipt of the final payment milestone, ownership of the custom frontend system layout and database configuration will transfer to the Client.

16. DATA PROTECTION
- The Developer will implement secure database protection parameters during development. The Client maintains ownership over all database entries logged into the system.

17. LIMITATION OF LIABILITY
- In no event shall either party be liable for any indirect or consequential damages. The maximum financial liability of the Developer under this Agreement shall be strictly capped at the total amount actually paid by the Client.

18. FORCE MAJEURE
- Neither party shall be held liable for failure or delays caused by events beyond their reasonable control, including natural disasters, national lockouts, or civil unrest.

19. TERMINATION & CANCELLATION
- For Convenience: The Client may terminate this agreement by providing fourteen (14) days advance written notice. All advance payments up to that point remain non-refundable.
- For Material Breach: Either party may terminate if the other party fails to cure a material breach within fourteen (14) days of receiving written notice.

20. GOVERNING LAW & JURISDICTION
- This Agreement and its interpretation shall be governed by and construed in accordance with the laws of India. All legal matters fall under the exclusive territorial jurisdiction of the courts located in the state of the Developer's corporate headquarters.`;

    const agreementNumber = "SCA-" + Math.floor(100000 + Math.random() * 900000);
    const agreementStatus = data.status || "SENT";

    const agreement = await db.agreement.create({
      data: {
        agreementNumber,
        clientId,
        title: data.projectName + " Software Development Agreement",
        content: documentText,
        status: agreementStatus,
      }
    });

    if (agreementStatus === "SENT") {
      await sendEmail({
        to: client.email,
        subject: `Review & Sign: ${data.projectName} Software Development Agreement`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #6366f1; text-align: center;">Software Development Agreement</h2>
            <p>Hello ${client.ownerName},</p>
            <p>A Software Development Agreement has been generated for your project: <strong>${data.projectName}</strong>.</p>
            <p>Please click the button below to review the document terms, milestones, and sign it electronically:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://sewacircle360tech.online/portal/agreements/${agreement.id}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Review & Sign Agreement</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
          </div>
        `
      }).catch(err => console.error("Agreement email trigger failed:", err));
    }

    await logAuditEvent(
      agreementStatus === "DRAFT" ? "CREATE_DRAFT_AGREEMENT" : "CREATE_SEND_AGREEMENT", 
      `Created SLA agreement ${agreementNumber} (${agreementStatus}) for client: ${client.companyName}`
    );

    revalidatePath("/admin/agreements");
    return { success: agreementStatus === "DRAFT" ? "Draft saved successfully!" : "Agreement sent successfully!", agreementId: agreement.id };
  } catch (error) {
    console.error("createAgreementAction error:", error);
    return { error: "Failed to create agreement." };
  }
}

// Manual email dispatch for Draft Agreements
export async function sendAgreementEmailAction(agreementId: string) {
  try {
    const agreement = await db.agreement.findUnique({
      where: { id: agreementId },
      include: { client: true }
    });

    if (!agreement || !agreement.client) {
      return { error: "Agreement or Client not found." };
    }

    await sendEmail({
      to: agreement.client.email,
      subject: `Review & Sign: ${agreement.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Software Development Agreement</h2>
          <p>Hello ${agreement.client.ownerName},</p>
          <p>A Software Development Agreement is ready for your project: <strong>${agreement.title}</strong>.</p>
          <p>Please click the button below to review the document terms, milestones, and sign it electronically:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sewacircle360tech.online/portal/agreements/${agreement.id}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Review & Sign Agreement</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">© SewaCircle360 Technologies.</p>
        </div>
      `
    });

    await db.agreement.update({
      where: { id: agreementId },
      data: { status: "SENT" }
    });

    await logAuditEvent("SEND_AGREEMENT_EMAIL", `Emailed SLA contract: ${agreement.title} to client ${agreement.client.companyName}`);

    revalidatePath("/admin/agreements");
    return { success: "Agreement email sent to client!" };
  } catch (error) {
    console.error("sendAgreementEmailAction error:", error);
    return { error: "Failed to send email." };
  }
}
