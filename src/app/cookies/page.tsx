import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata = {
  title: "Cookie Policy | SewaCircle360 Technologies",
  description: "Learn about how SewaCircle360 Technologies uses cookies and similar tracking technologies on our website.",
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Legal</span>
            <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-4">Cookie Policy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: June 2025</p>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>

            <h2>2. How We Use Cookies</h2>
            <p>SewaCircle360 Technologies uses cookies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly. These include session authentication cookies for our client and admin portals.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website, allowing us to improve user experience.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences, such as your chosen theme (dark/light mode).</li>
              <li><strong>Security Cookies:</strong> Help protect against fraudulent logins and cross-site request forgery attacks.</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <ul>
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser. Used for maintaining login sessions.</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period. Used for remembering your preferences.</li>
              <li><strong>First-Party Cookies:</strong> Set by our website directly.</li>
            </ul>

            <h2>4. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li>Most web browsers allow you to manage cookies through their settings</li>
              <li>You can delete cookies that have already been set</li>
              <li>You can set your browser to prevent cookies from being set</li>
            </ul>
            <p>Note that blocking certain cookies may impact the functionality of our website, particularly the client portal and admin dashboard.</p>

            <h2>5. Authentication Cookies</h2>
            <p>Our platform uses secure authentication cookies to manage your login session. These are essential for the security of your account and cannot be disabled while using our portals. They expire when you log out or after 30 days of inactivity.</p>

            <h2>6. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. Changes will be reflected on this page with a revised date.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:info.sewacircle360@gmail.com">info.sewacircle360@gmail.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
