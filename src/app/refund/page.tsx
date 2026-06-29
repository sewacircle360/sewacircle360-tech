import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata = {
  title: "Refund Policy | SewaCircle360 Technologies",
  description: "Understand our refund policy for software development and digital services provided by SewaCircle360 Technologies.",
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Legal</span>
            <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-4">Refund Policy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: June 2025</p>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
            <h2>1. Overview</h2>
            <p>At SewaCircle360 Technologies, we are committed to delivering high-quality digital services. Due to the nature of software development and digital services, our refund policy is as follows. Please read it carefully before engaging our services.</p>

            <h2>2. Advance Payment</h2>
            <p>The advance payment (typically 50% of the total project value) is non-refundable once project work has commenced. This covers initial research, planning, design drafts, architecture setup, and resources allocated to your project.</p>

            <h2>3. Milestone-Based Projects</h2>
            <p>For milestone-based projects, payments made for completed and approved milestones are non-refundable. If you choose to discontinue a project after a milestone has been delivered and approved, no refund will be issued for that milestone.</p>

            <h2>4. Cancellation Before Work Begins</h2>
            <p>If you cancel a project before any work has commenced (within 24 hours of signing the agreement), we will issue a full refund of any advance payment, minus any payment processing fees.</p>

            <h2>5. Quality Issues</h2>
            <p>If the delivered work does not meet the agreed specifications, we will work with you to rectify the issues at no additional cost within a 30-day warranty period after final delivery. We do not issue refunds for change-of-mind or scope changes after project completion.</p>

            <h2>6. Subscription Services</h2>
            <p>For monthly maintenance or SaaS subscription services, you may cancel at any time. Cancellation takes effect at the end of the current billing period. No partial refunds are issued for unused days in a billing period.</p>

            <h2>7. How to Request a Refund</h2>
            <p>To request a refund (where applicable), please contact us in writing at:</p>
            <ul>
              <li>Email: <a href="mailto:support.sewacircle360@gmail.com">support.sewacircle360@gmail.com</a></li>
              <li>Subject: Refund Request — [Your Project Name]</li>
            </ul>
            <p>We will review your request and respond within 5-7 business days.</p>

            <h2>8. Dispute Resolution</h2>
            <p>In case of any disputes regarding refunds, both parties agree to first attempt resolution through good-faith negotiation. If unresolved, disputes shall be subject to arbitration under Indian law.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
