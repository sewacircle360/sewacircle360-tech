import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { BookingForm } from "@/modules/meetings/components/BookingForm";

export const metadata = {
  title: "Book a Consultation | SewaCircle360 Technologies",
  description: "Schedule a discovery call or scoping session directly with our software engineering team.",
};

export default function BookMeetingPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
              Consultation Scheduler
            </span>
            <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-4 leading-tight">
              Schedule Your Discovery Call
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Select your meeting type, pick an available date, and lock in a timezone-adjusted slot. We will automatically log your booking in our CRM pipeline.
            </p>
          </div>
          
          <BookingForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
