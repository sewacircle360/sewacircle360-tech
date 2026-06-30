"use client";

import { useState, useEffect, useTransition } from "react";
import { getTalentProfiles, deleteTalentProfile } from "@/modules/talent/actions/talent";
import { 
  Users, 
  Trash2, 
  Eye, 
  Loader2, 
  Search, 
  Download, 
  Printer, 
  GraduationCap, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Github, 
  X, 
  FileText,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminTalentNetworkPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("");
  const [selectedDegreeFilter, setSelectedDegreeFilter] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const fetchProfiles = async () => {
    const list = await getTalentProfiles();
    setProfiles(list);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this candidate from the Talent Network?")) return;
    
    startTransition(async () => {
      const result = await deleteTalentProfile(id);
      if (result.error) {
        alert(result.error);
      } else {
        alert(result.success || "Removed successfully!");
        fetchProfiles();
        if (selectedProfile?.id === id) {
          setSelectedProfile(null);
        }
      }
    });
  };

  // Filter logic
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.personalEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.officialEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill = selectedSkillFilter === "" || p.skills.includes(selectedSkillFilter);
    const matchesDegree = selectedDegreeFilter === "" || p.degree === selectedDegreeFilter;

    return matchesSearch && matchesSkill && matchesDegree;
  });

  // Export to CSV/Excel
  const handleExportCSV = () => {
    if (filteredProfiles.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Full Name",
      "University",
      "Roll Number/UID",
      "Official Email",
      "Personal Email",
      "Mobile Number",
      "Degree",
      "Branch",
      "Year/Semester",
      "CGPA",
      "Skills",
      "GitHub",
      "LinkedIn",
      "Portfolio",
      "Registration Date"
    ];

    const rows = filteredProfiles.map((p) => [
      p.fullName,
      p.university,
      p.rollNumber,
      p.officialEmail,
      p.personalEmail,
      p.mobileNumber,
      p.degree,
      p.branch,
      p.yearSemester,
      p.cgpa || "N/A",
      p.skills.join("; "),
      p.githubProfile || "N/A",
      p.linkedinProfile || "N/A",
      p.portfolioLink || "N/A",
      new Date(p.createdAt).toLocaleDateString()
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map((row) => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SewaCircle360_TalentNetwork_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to trigger resume download client-side from base64 string
  const handleDownloadResume = (profile: any) => {
    if (!profile.resumeData) return;

    try {
      const base64Data = profile.resumeData;
      // Extract content type and clean base64 data string
      const parts = base64Data.split(";base64,");
      const contentType = parts[0].split(":")[1] || "application/octet-stream";
      const rawBase64 = parts[1] || parts[0];
      
      const byteCharacters = atob(rawBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = profile.resumeName || `${profile.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Resume extraction failed:", err);
      alert("Failed to extract and download resume file.");
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* Printable overrides styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, button, aside, nav, header, [role="navigation"] {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .printable-table-container {
            border: none !important;
            box-shadow: none !important;
          }
          table {
            border-collapse: collapse;
            width: 100% !important;
            font-size: 11px !important;
          }
          th, td {
            border: 1px solid #cbd5e1 !important;
            padding: 8px !important;
          }
        }
      ` }} />

      {/* Header and export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Talent Network Pool
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, review, and download registered talents across various technologies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export to Excel
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-5 rounded-2xl shadow-sm no-print flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, university, roll number, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Degree Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400">Degree:</span>
            <select
              value={selectedDegreeFilter}
              onChange={(e) => setSelectedDegreeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Degrees</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400">Skill:</span>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Skills</option>
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Main Table view */}
      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden printable-table-container">
        {filteredProfiles.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Talents Found</span>
            <p className="text-xs text-slate-500 mt-1">
              {profiles.length === 0 ? "The talent network registry is currently empty." : "No candidates match your current search filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">University</th>
                  <th className="py-4 px-6">Degree & Branch</th>
                  <th className="py-4 px-6">Skills</th>
                  <th className="py-4 px-6 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{profile.fullName}</span>
                          <span className="text-xs text-slate-400 font-medium">{profile.personalEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.university}</span>
                        <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">Roll: {profile.rollNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-bold">
                        <GraduationCap className="h-4 w-4 text-indigo-500" />
                        {profile.degree} ({profile.branch})
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {profile.skills.slice(0, 3).map((skill: string) => (
                          <span 
                            key={skill}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 3 && (
                          <span className="text-[9px] font-semibold text-slate-450 px-1 bg-slate-100 dark:bg-slate-900 rounded">
                            +{profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right no-print">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedProfile(profile)}
                          title="View sheet details"
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(profile.id)}
                          disabled={isPending}
                          title="Remove applicant"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overlay Modal for detailed profiles */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-left"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">Talent Network Registry</h3>
                    <span className="text-xs text-slate-400 font-medium">Registered: {new Date(selectedProfile.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto">
                
                {/* Section: Academic Details */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1.5">
                    Academic Credentials
                  </h4>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedProfile.fullName}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">University</span>
                      <span className="text-sm font-semibold text-slate-750 dark:text-slate-200">{selectedProfile.university}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Degree & Branch</span>
                        <span className="text-xs font-bold text-indigo-500">{selectedProfile.degree} ({selectedProfile.branch})</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Year / Sem</span>
                        <span className="text-xs font-semibold text-slate-750 dark:text-slate-250">{selectedProfile.yearSemester}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Roll No / UID</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{selectedProfile.rollNumber}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">CGPA</span>
                        <span className="text-xs font-bold text-slate-750 dark:text-white">{selectedProfile.cgpa || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Contact & Social Info */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1.5">
                    Contact & Profiles
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`mailto:${selectedProfile.personalEmail}`}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                      <div className="truncate">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Personal Email</span>
                        {selectedProfile.personalEmail}
                      </div>
                    </a>

                    <a
                      href={`mailto:${selectedProfile.officialEmail}`}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                      <div className="truncate">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Official University Email</span>
                        {selectedProfile.officialEmail}
                      </div>
                    </a>

                    <a
                      href={`tel:${selectedProfile.mobileNumber}`}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Mobile Number</span>
                        {selectedProfile.mobileNumber}
                      </div>
                    </a>

                    {/* Social profiles links */}
                    <div className="flex items-center gap-3 pt-1 border-t dark:border-slate-800 mt-1">
                      {selectedProfile.githubProfile ? (
                        <a
                          href={selectedProfile.githubProfile.startsWith('http') ? selectedProfile.githubProfile : `https://${selectedProfile.githubProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:border-indigo-500 rounded-xl transition-all"
                          title="Open GitHub Profile"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="p-2 text-slate-300 dark:text-slate-750 cursor-not-allowed" title="No GitHub Profile provided">
                          <Github className="h-4 w-4" />
                        </span>
                      )}

                      {selectedProfile.linkedinProfile ? (
                        <a
                          href={selectedProfile.linkedinProfile.startsWith('http') ? selectedProfile.linkedinProfile : `https://${selectedProfile.linkedinProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:border-indigo-500 rounded-xl transition-all"
                          title="Open LinkedIn Profile"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="p-2 text-slate-300 dark:text-slate-750 cursor-not-allowed" title="No LinkedIn Profile provided">
                          <Linkedin className="h-4 w-4" />
                        </span>
                      )}

                      {selectedProfile.portfolioLink ? (
                        <a
                          href={selectedProfile.portfolioLink.startsWith('http') ? selectedProfile.portfolioLink : `https://${selectedProfile.portfolioLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:border-indigo-500 rounded-xl transition-all"
                          title="Open Portfolio Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="p-2 text-slate-300 dark:text-slate-750 cursor-not-allowed" title="No Portfolio provided">
                          <Globe className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Skills Badges */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1.5">
                    Skills Selected
                  </h4>
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {selectedProfile.skills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No specific skills selected</span>
                    ) : (
                      selectedProfile.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Section: Resume Attachment */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1.5">
                    Resume / Attachment
                  </h4>
                  {selectedProfile.resumeData ? (
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800/80 rounded-2xl">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-750 dark:text-slate-300 truncate">
                          {selectedProfile.resumeName || "resume_attachment.pdf"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadResume(selectedProfile)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        Download Resume
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No resume uploaded by the candidate</span>
                  )}
                </div>

              </div>

              {/* Modal footer */}
              <div className="p-6 border-t dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center gap-3">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Close Sheet
                </button>
                <button
                  onClick={() => handleDelete(selectedProfile.id)}
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove Candidate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
