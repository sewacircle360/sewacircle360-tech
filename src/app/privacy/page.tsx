import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata = {
  title: "Privacy Policy | SewaCircle360 Technologies",
  description: "Read our privacy policy to understand how SewaCircle360 Technologies collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Legal</span>
            <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-4">Privacy Policy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: June 2025</p>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
            <h2>1. Information We Collect</h2>
            <p>SewaCircle360 Technologies ("we," "our," or "us") collects information you provide directly to us, such as when you fill out a contact form, book a meeting, request a service quotation, or sign up for our newsletter. This may include your name, email address, phone number, company name, and project details.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services; process and fulfill service requests; send you technical notices, updates, and support messages; respond to your inquiries; and send you marketing communications (with your consent).</p>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except to trusted service providers who assist us in operating our website, conducting our business, or serving you — provided that those parties agree to keep this information confidential.</p>

            <h2>4. Data Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and transmitted via SSL encryption. Access to your personal data is restricted to authorized personnel only.</p>

            <h2>5. Cookies</h2>
            <p>Our website may use cookies to enhance your experience. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. Please refer to our Cookie Policy for more details.</p>

            <h2>6. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policy of any third-party site you visit.</p>

            <h2>7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at <a href="mailto:support.sewacircle360@gmail.com">support.sewacircle360@gmail.com</a>.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with a revised date.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:info.sewacircle360@gmail.com">info.sewacircle360@gmail.com</a></li>
              <li>Phone: +91 9461111010</li>
              <li>Address: Phase 7, Mohali, Punjab, India</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
