"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  UploadCloud,
  FileText,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";

const OFFICIAL_EMAIL = "support@aladdinglobalb2b.com";

const POSITIONS = [
  "Sales & Vendor Relations Executive",
  "Customer Support Representative",
  "Logistics & Delivery Officer",
  "Digital Marketing & Social Media Executive",
  "Software Developer / IT Specialist",
  "Graphics & Content Creator",
  "Accounts & Finance Officer",
  "Warehouse & Inventory Coordinator",
  "Other / Open Position",
];

const EXPERIENCE_OPTIONS = [
  "Fresher / Entry Level",
  "1 – 2 Years",
  "3 – 5 Years",
  "5+ Years (Senior)",
];

export default function CareersPage() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: POSITIONS[0],
    experience: EXPERIENCE_OPTIONS[0],
    portfolioUrl: "",
    coverNote: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size cannot exceed 10MB");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Your application has been submitted successfully!");
      window.scrollTo({ top: document.getElementById("apply-form")?.offsetTop || 400, behavior: "smooth" });
    }, 1000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCvFile(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: POSITIONS[0],
      experience: EXPERIENCE_OPTIONS[0],
      portfolioUrl: "",
      coverNote: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">
      {/* =========================================================
          HERO HEADER
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#12233F] py-14 text-white sm:py-20">
        <div className="relative mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-[#f1c453]">
            <Briefcase size={14} className="text-[#D6A419]" />
            Careers at Aladdin Global B2B
          </div>

          {/* Main Title & Motto from User Notes */}
          <h1 className="mt-4 font-[var(--font-poppins)] text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Join Aladdin Global B2B
          </h1>

          <p className="mt-2 text-lg font-bold text-[#D6A419] sm:text-xl">
            Build your career, Build the future.
          </p>

          {/* Description from User Notes */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Aladdin Global B2B is a modern multi-vendor e-commerce platform. Submit your CV to our organization’s email or through the Career Application Form below.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D6A419] px-6 py-3 text-xs font-bold text-[#12233F] shadow transition hover:bg-[#e2b534] sm:text-sm"
            >
              <Send size={16} />
              Career Application Form
            </a>

            <a
              href={`mailto:${OFFICIAL_EMAIL}?subject=Application%20for%20Career%20at%20Aladdin%20Global%20B2B`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20 sm:text-sm"
            >
              <Mail size={16} />
              Email Your CV
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY SUBMISSION METHODS (From User Note)
      ========================================================= */}
      <section className="relative -mt-6 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Card 1: Official Email Submission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#12233F]">
                  Submit CV via Email
                </h3>
                <p className="text-xs text-slate-500">
                  Send your updated CV or resume directly to our official inbox.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <span className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                {OFFICIAL_EMAIL}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Subject: Application for [Role] - [Your Name]</span>
              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=Job%20Application%20-%20Aladdin%20Global%20B2B`}
                className="font-bold text-[#12233F] hover:text-[#b48a08]"
              >
                Open Mail App →
              </a>
            </div>
          </div>

          {/* Card 2: Corporate Office & Walk-In */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#12233F]">
                  Corporate Office
                </h3>
                <p className="text-xs text-slate-500">
                  Drop your physical CV or visit our corporate premises.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-slate-400" />
                <span>Gonata Road, Jashore - 7400, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-slate-400" />
                <span>Saturday – Thursday: 10:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-slate-400" />
                <span>01312-789354</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <Link
                href="/contact"
                className="font-bold text-[#12233F] hover:text-[#b48a08]"
              >
                View Contact & Location Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CAREER APPLICATION FORM
      ========================================================= */}
      <section id="apply-form" className="scroll-mt-12 py-12 sm:py-16">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            {/* Header */}
            <div className="mb-8 border-b border-slate-100 pb-5 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
                Online Application
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
                Career Application Form
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                Please provide your details and attach your CV. Our recruitment team will review your profile and reach out to you.
              </p>
            </div>

            {/* Submitted State */}
            {isSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#12233F]">
                  Application Received!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Thank you, <strong>{formData.fullName}</strong>. Your application has been successfully submitted to the Aladdin Global B2B team.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    href="/"
                    className="rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a335d]"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    />
                  </div>
                </div>

                {/* Position and Experience */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Desired Position <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    >
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Experience Level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    >
                      {EXPERIENCE_OPTIONS.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Portfolio / LinkedIn Link */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    LinkedIn / Portfolio / Online CV Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/... or Google Drive link"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* Upload CV */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Upload CV / Resume (PDF, DOC, DOCX)
                  </label>
                  <label
                    htmlFor="cv-upload-file"
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                      cvFile
                        ? "border-emerald-400 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50"
                    }`}
                  >
                    <input
                      id="cv-upload-file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud
                      size={30}
                      className={`mb-2 ${cvFile ? "text-emerald-600" : "text-slate-400"}`}
                    />
                    {cvFile ? (
                      <div>
                        <span className="text-xs font-bold text-emerald-700 sm:text-sm">
                          {cvFile.name}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-bold text-slate-700 sm:text-sm">
                          Click to select your CV file
                        </span>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Cover Note */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Brief Cover Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    placeholder="Briefly tell us about your background or why you want to join Aladdin Global B2B..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#12233F] py-3.5 text-xs font-bold text-white shadow transition hover:bg-[#1b345e] disabled:opacity-50 sm:text-sm"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM FOOTER BANNER
      ========================================================= */}
      <section className="bg-[#12233F] py-12 text-center text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-[var(--font-poppins)] text-xl font-bold text-[#D6A419] sm:text-2xl">
            Join Aladdin Global B2B
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
            Build your career, Build the future.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            For recruitment inquiries:{" "}
            <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-white underline hover:text-[#D6A419]">
              {OFFICIAL_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
