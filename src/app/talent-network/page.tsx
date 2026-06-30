"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { submitTalentProfile } from "@/modules/talent/actions/talent";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  Users, 
  Award, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  Globe,
  Briefcase,
  GitBranch
} from "lucide-react";

const BENEFITS = [
  {
    icon: Terminal,
    title: "Build Real Software",
    desc: "Work on active client projects. Write production-level code, participate in pull request reviews, and run agile sprints."
  },
  {
    icon: Layers,
    title: "Modern Stack Experience",
    desc: "Gain hands-on training with Next.js, React, Node.js, MongoDB, Prisma, Tailwind CSS, and scalable cloud architectures."
  },
  {
    icon: Users,
    title: "Dedicated Mentorship",
    desc: "Collaborate directly with our senior engineering team, attending technical design workshops and review sessions."
  },
  {
    icon: Award,
    title: "Portfolio Development",
    desc: "Instead of plain certificates, leave with tangible, working projects added to your GitHub and portfolio."
  }
];

const SKILL_OPTIONS = [
  "Web Development",
  "React / Next.js",
  "Node.js",
  "Java / Python",
  "UI/UX Design",
  "Graphic Design",
  "AI/ML",
  "Digital Marketing",
  "Content Writing",
  "Software Testing"
];

export default function TalentNetworkPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    rollNumber: "",
    officialEmail: "",
    personalEmail: "",
    mobileNumber: "",
    degree: "",
    branch: "",
    yearSemester: "",
    cgpa: "",
    githubProfile: "",
    linkedinProfile: "",
    portfolioLink: ""
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<{ data: string; name: string } | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size should not exceed 2MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setResumeFile({
        data: reader.result as string,
        name: file.name
      });
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic Validation
    if (
      !formData.fullName ||
      !formData.university ||
      !formData.rollNumber ||
      !formData.officialEmail ||
      !formData.personalEmail ||
      !formData.mobileNumber ||
      !formData.degree ||
      !formData.branch ||
      !formData.yearSemester
    ) {
      setError("Please fill out all required academic and contact fields.");
      window.scrollTo({ top: 400, behavior: "smooth" });
      return;
    }

    startTransition(async () => {
      const result = await submitTalentProfile({
        ...formData,
        skills: selectedSkills,
        resumeData: resumeFile?.data,
        resumeName: resumeFile?.name
      });

      if (result.error) {
        setError(result.error);
        window.scrollTo({ top: 400, behavior: "smooth" });
      } else {
        setSuccess(result.success || "Successfully joined the Talent Network!");
        // Clear form
        setFormData({
          fullName: "",
          university: "",
          rollNumber: "",
          officialEmail: "",
          personalEmail: "",
          mobileNumber: "",
          degree: "",
          branch: "",
          yearSemester: "",
          cgpa: "",
          githubProfile: "",
          linkedinProfile: "",
          portfolioLink: ""
        });
        setSelectedSkills([]);
        setResumeFile(null);
      }
    });
  };

  return (
    <>
      <title>Join the SewaCircle360 Talent Network</title>
      <meta name="description" content="Build real products, work on live projects, and grow your portfolio by joining the SewaCircle360 Early Access Talent Pool." />
      <Header />
      
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] text-left transition-colors duration-300">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-4"
          >
            <Sparkles className="h-3.5 w-3.5" /> Early Access Program
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-6 leading-tight max-w-4xl mx-auto"
          >
            Join the <span className="text-indigo-600 dark:text-indigo-400">SewaCircle360</span> Talent Network
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Build Real Products. Work on Live Projects. Grow Your Portfolio. We build client products and remote software teams—register today to be considered for upcoming roles.
          </motion.p>
        </div>

        {/* Value Proposition Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group hover:border-indigo-500/20"
              >
                <div className="p-3 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Application Form Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
            
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-tr-full pointer-events-none" />

            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Talent Pool Registry</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
              Complete the profile fields below. Anyone can register. Once registered, selection is based on project fit and availability.
            </p>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-5 text-center py-10"
                >
                  <div className="p-4 bg-green-500/10 text-green-500 rounded-full animate-bounce">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Welcome to the Network!</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
                      {success}
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(null)}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    Submit another response
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Section 1: Basic Details */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      1. Basic Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="mobileNumber" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 9876543210"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="personalEmail" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Personal Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="personalEmail"
                          name="personalEmail"
                          type="email"
                          required
                          value={formData.personalEmail}
                          onChange={handleInputChange}
                          placeholder="e.g. rahul@gmail.com"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="officialEmail" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Official University Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="officialEmail"
                          name="officialEmail"
                          type="email"
                          required
                          value={formData.officialEmail}
                          onChange={handleInputChange}
                          placeholder="e.g. rahul@university.edu"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="university" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          University Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="university"
                          name="university"
                          type="text"
                          required
                          value={formData.university}
                          onChange={handleInputChange}
                          placeholder="e.g. Chitkara University"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="rollNumber" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Roll Number / UID <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="rollNumber"
                          name="rollNumber"
                          type="text"
                          required
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 2110991234"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic Info */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      2. Academic Info
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="degree" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Degree <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="degree"
                          name="degree"
                          required
                          value={formData.degree}
                          onChange={handleInputChange}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Degree</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="branch" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="branch"
                          name="branch"
                          type="text"
                          required
                          value={formData.branch}
                          onChange={handleInputChange}
                          placeholder="e.g. CSE / AIML / IT"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="yearSemester" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Year / Semester <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="yearSemester"
                          name="yearSemester"
                          type="text"
                          required
                          value={formData.yearSemester}
                          onChange={handleInputChange}
                          placeholder="e.g. 3rd Year / 6th Sem"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-[200px]">
                      <label htmlFor="cgpa" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        CGPA <span className="text-xs text-slate-400">(Optional)</span>
                      </label>
                      <input
                        id="cgpa"
                        name="cgpa"
                        type="text"
                        value={formData.cgpa}
                        onChange={handleInputChange}
                        placeholder="e.g. 8.9"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Section 3: Skills */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      3. Skills
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Select all skills that apply to you:</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SKILL_OPTIONS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <CheckCircle className="w-2.5 h-2.5 text-white fill-white" />}
                            </div>
                            <span className="truncate">{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: Experience & Links (Optional) */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      4. Experience & Links <span className="text-xs text-slate-400 font-normal lowercase">(all optional)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="githubProfile" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <GitBranch className="h-3.5 w-3.5 text-slate-400" /> GitHub Profile
                        </label>
                        <input
                          id="githubProfile"
                          name="githubProfile"
                          type="url"
                          value={formData.githubProfile}
                          onChange={handleInputChange}
                          placeholder="e.g. github.com/rahul"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="linkedinProfile" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" /> LinkedIn Profile
                        </label>
                        <input
                          id="linkedinProfile"
                          name="linkedinProfile"
                          type="url"
                          value={formData.linkedinProfile}
                          onChange={handleInputChange}
                          placeholder="e.g. linkedin.com/in/rahul"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="portfolioLink" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-slate-400" /> Portfolio Website
                        </label>
                        <input
                          id="portfolioLink"
                          name="portfolioLink"
                          type="url"
                          value={formData.portfolioLink}
                          onChange={handleInputChange}
                          placeholder="e.g. rahulsharma.dev"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-slate-400" /> Resume / CV Upload
                      </label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors relative cursor-pointer group">
                        <input
                          id="resume-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2.5 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                            <Upload className="h-5 w-5" />
                          </div>
                          {resumeFile ? (
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[250px] truncate">
                                {resumeFile.name}
                              </span>
                              <span className="text-[10px] text-green-500 font-semibold mt-1">Ready for upload</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Click to select or drag PDF/Word document
                              </span>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500">
                                PDF, DOC, DOCX up to 2MB
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission expectation disclaimer */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border text-[11px] sm:text-xs text-slate-500 dark:text-slate-450 leading-relaxed mt-2 text-left">
                    <strong>Legal Notice / Expectations:</strong> Submitting this form does not guarantee an internship or employment. Selected candidates will be contacted based on project requirements and availability.
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 transition-all text-sm cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing Registry...
                      </>
                    ) : (
                      <>
                        Register Profile
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </form>
              )}
            </AnimatePresence>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
