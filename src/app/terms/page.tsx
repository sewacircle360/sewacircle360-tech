import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata = {
  title: "Terms & Conditions | SewaCircle360 Technologies",
  description: "Read the terms and conditions governing your use of SewaCircle360 Technologies services and platforms.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Legal</span>
            <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-4">Terms & Conditions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: June 2025</p>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the services provided by SewaCircle360 Technologies ("Company," "we," "us," or "our"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>

            <h2>2. Services</h2>
            <p>SewaCircle360 Technologies provides custom software development, website development, mobile app development, UI/UX design, SaaS product development, and related digital services. The scope of each project is defined in a separate Statement of Work (SOW) or Service Agreement signed between the parties.</p>

            <h2>3. Client Responsibilities</h2>
            <p>The client is responsible for providing accurate and complete project requirements, timely feedback during development, necessary access credentials, content, and assets. Delays caused by the client may result in adjusted timelines and additional costs.</p>

            <h2>4. Intellectual Property</h2>
            <p>Upon full payment, the client receives ownership of the final deliverables as specified in the project agreement. SewaCircle360 Technologies retains the right to use the project in our portfolio unless the client requests otherwise in writing. All pre-existing tools, frameworks, and libraries remain the property of their respective owners.</p>

            <h2>5. Payment Terms</h2>
            <p>Payment schedules are defined in individual project agreements. Typically, 50% advance is required before work begins, and the remaining balance is due upon project completion. Late payments may incur interest charges.</p>

            <h2>6. Confidentiality</h2>
            <p>Both parties agree to maintain confidentiality of proprietary information shared during the course of the project. This obligation survives the termination of any agreement.</p>

            <h2>7. Limitation of Liability</h2>
            <p>SewaCircle360 Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the amount paid by the client for the specific service giving rise to the claim.</p>

            <h2>8. Termination</h2>
            <p>Either party may terminate a project agreement with 30 days written notice. The client is responsible for payment of all work completed up to the termination date.</p>

            <h2>9. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mohali, Punjab, India.</p>

            <h2>10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:business.sewacircle360@gmail.com">business.sewacircle360@gmail.com</a> or call +91 9461111010.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
