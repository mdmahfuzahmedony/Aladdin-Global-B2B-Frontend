"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Briefcase,
  Mail,
  Send,
  Building2,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  UploadCloud,
  FileText,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const OFFICIAL_EMAIL = "support@aladdinglobalb2b.com";

const DEPARTMENTS = [
  "Sales & Vendor Acquisition",
  "Customer Support & Operations",
  "Logistics & Delivery Management",
  "Software Engineering & IT",
  "Digital Marketing & SEO",
  "Graphics & Content Creation",
  "Accounts & Finance",
  "Inventory & Warehouse Operations",
  "Other / Open Application",
];

const EXPERIENCE_LEVELS = [
  "Fresher / Entry Level",
  "1 – 2 Years",
  "3 – 5 Years",
  "5+ Years (Senior / Lead)",
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
    position: DEPARTMENTS[0],
    experience: EXPERIENCE_LEVELS[0],
    portfolioUrl: "",
    coverNote: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopied(true);
    toast.success("ইমেইল অ্যাড্রেস কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ফাইলের সাইজ সর্বোচ্চ 10MB হতে পারবে");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    // Simulate clean submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("আপনার আবেদন সফলভাবে গ্রহণ করা হয়েছে!");
      window.scrollTo({ top: document.getElementById("apply-form")?.offsetTop || 600, behavior: "smooth" });
    }, 1200);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCvFile(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: DEPARTMENTS[0],
      experience: EXPERIENCE_LEVELS[0],
      portfolioUrl: "",
      coverNote: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#12233F] via-[#162a4d] to-[#12233F] py-16 text-white sm:py-24">
        {/* Background Decorative Rings */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#D6A419]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#f1c453] sm:text-sm">
              <Sparkles size={16} className="text-[#D6A419]" />
              Join Aladdin Global B2B Team
            </div>

            {/* Title */}
            <h1 className="mt-5 font-[var(--font-poppins)] text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-5xl">
              Build Your Career, <br className="hidden sm:inline" />
              <span className="text-[#D6A419]">Build the Future</span>
            </h1>

            {/* Bangla Subtitle based on User's Notes */}
            <p className="mt-5 text-base leading-relaxed text-slate-200 sm:text-lg">
              Aladdin Global B2B একটি আধুনিক মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম। আমাদের দ্রুত বর্ধনশীল সংগঠনে যোগ দিন এবং দেশের ডিজিটাল পাইকারি বাণিজ্যকে রূপান্তরিত করতে ভূমিকা রাখুন।
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#apply-form"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D6A419] px-6 py-3.5 text-sm font-bold text-[#12233F] shadow-lg transition hover:bg-[#e0b22d] hover:shadow-xl sm:text-base"
              >
                <Send size={18} />
                আবেদন ফর্ম পূরণ করুন
              </a>

              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=Application%20for%20Career%20at%20Aladdin%20Global%20B2B`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 sm:text-base"
              >
                <Mail size={18} />
                সরাসরি সিভি ই-মেইল করুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUBMISSION METHODS / HOW TO APPLY
      ========================================================= */}
      <section className="relative -mt-8 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Email Submission */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Mail size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#12233F]">
                ১. ই-মেইলে সরাসরি সিভি পাঠান
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                আপনার আপডেটেড CV / Resume সরাসরি আমাদের অফিশিয়াল ই-মেইল ঠিকানায় পাঠিয়ে দিন:
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <span className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                  {OFFICIAL_EMAIL}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-100 transition"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=Job%20Application%20-%20Aladdin%20Global%20B2B`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12233F] hover:text-[#b48a08] transition"
              >
                এখনই ইমেইল পাঠান <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 2: Application Form */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <FileText size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#12233F]">
                ২. ক্যারিয়ার অ্যাপ্লিকেশন ফর্ম
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                নিচের অনলাইন ফর্মটি পূরণ করে আপনার বায়োডাটা ও তথ্য সরাসরি আমাদের এইচআর টিমের কাছে জমা দিন।
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>কাঙ্ক্ষিত পদ ও কাজের ধরণ নির্বাচন</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>সিভি / পোর্টফোলিও আপলোড সুবিধা</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <a
                href="#apply-form"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12233F] hover:text-[#b48a08] transition"
              >
                ফর্ম পূরণ করুন <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 3: Corporate Office */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Building2 size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#12233F]">
                ৩. অফিস অবস্থান ও যোগাযোগ
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                সরাসরি আমাদের হেড অফিসে যোগাযোগ করতে পারেন অথবা ডাকযোগে সিভি পাঠাতে পারেন:
              </p>
              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Gonata Road, Jashore - 7400, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400 shrink-0" />
                  <span>শনিবার – বৃহস্পতিবার: সকাল ১০:০০ – রাত ১০:০০</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span>01312-789354</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12233F] hover:text-[#b48a08] transition"
              >
                যোগাযোগ পৃষ্ঠা দেখুন <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY JOIN US / CULTURE SECTION
      ========================================================= */}
      <section className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b48a08]">
            Why Aladdin Global B2B
          </span>
          <h2 className="mt-2 text-2xl font-black text-[#12233F] sm:text-3xl lg:text-4xl">
            আমাদের সাথে ক্যারিয়ার গড়ার সুবিধা
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            আমরা একটি তারুণ্যদীপ্ত, প্রযুক্তিভিত্তিক এবং সহযোগিতাপূর্ণ পরিবেশ নিশ্চিত করি যেখানে আপনার প্রতিভা যথাযথ মূল্যায়ন পায়।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600">
              <TrendingUp size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#12233F]">
              দ্রুত প্রমোশন ও প্রবৃদ্ধি
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              যোগ্যতা ও মেধার ভিত্তিতে দ্রুত পদোন্নতি এবং ক্যারিয়ারের প্রতিটি ধাপে এগিয়ে যাওয়ার সর্বোচ্চ সুযোগ।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Users size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#12233F]">
              সহযোগিতামূলক টিম কালচার
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              অভিজ্ঞ মেন্টর এবং সহযোগী সহকর্মীদের সাথে একাত্ম হয়ে কাজ করার আধুনিক ও বন্ধুত্বপূর্ণ পরিবেশ।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Award size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#12233F]">
              আকর্ষণীয় পারিশ্রমিক ও বোনাস
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              প্রতিযোগিতামূলক স্যালারি কাঠামো, বার্ষিক ইনক্রিমেন্ট, উৎসব ভাতা এবং পারফরম্যান্স বোনাস।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#12233F]">
              চাকরির স্থায়ী নিশ্চয়তা
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              দেশজুড়ে বিস্তৃত সাপ্লাই চেইনের অংশ হয়ে একটি সুদৃঢ় ও দীর্ঘমেয়াদী পেশাদার পথচলা গড়ে তুলুন।
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          APPLICATION FORM SECTION
      ========================================================= */}
      <section
        id="apply-form"
        className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Info & Instructions */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#b48a08]">
                Career Application Form
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#12233F] sm:text-3xl lg:text-4xl">
                আলাদিন গ্লোবাল বি২বি-তে আবেদন করুন
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                আপনার বায়োডাটা এবং আবেদন সরাসরি আমাদের নিয়োগ বিভাগের কাছে পাঠাতে ডানদিকের ফর্মটি পূরণ করুন। প্রাথমিক বাছাই শেষে আমাদের টিম আপনার সাথে সরাসরি যোগাযোগ করবে।
              </p>

              {/* Instructions checklist */}
              <div className="mt-8 space-y-4 rounded-2xl border border-slate-100 bg-[#f8f9fc] p-6">
                <h4 className="text-sm font-bold text-[#12233F]">
                  আবেদনের গুরুত্বপূর্ণ নির্দেশনা:
                </h4>
                <ul className="space-y-3 text-xs leading-relaxed text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>সিভি ফাইলে আপনার হালনাগাদ যোগাযোগ নম্বর ও ঠিকানা উল্লেখ রাখুন।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>পিডিএফ (PDF) ফরম্যাটে সিভি আপলোড করা সর্বোত্তম।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>ফর্ম ছাড়াও চাইলে সরাসরি <strong className="text-slate-800">{OFFICIAL_EMAIL}</strong>-এ সিভি মেইল করতে পারেন।</span>
                  </li>
                </ul>
              </div>

              {/* Quote from user notes */}
              <div className="mt-8 rounded-2xl border-l-4 border-[#D6A419] bg-amber-50 p-5">
                <p className="text-xs font-semibold leading-relaxed text-amber-900">
                  “Join Aladdin Global B2B — Build your career, Build the future.”
                </p>
                <span className="mt-1 block text-[11px] text-amber-700">
                  — Aladdin Global B2B Recruitment Board
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#12233F] sm:text-2xl">
                      আবেদন সফলভাবে গৃহীত হয়েছে!
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                      ধন্যবাদ <strong>{formData.fullName}</strong>! আপনার সিভি ও আবেদন Aladdin Global B2B-র এইচআর টিমের কাছে পৌঁছেছে। যাচাই-বাছাই শেষে উপযুক্ত হলে খুব দ্রুত আপনার সাথে যোগাযোগ করা হবে।
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        আরেকটি আবেদন করুন
                      </button>
                      <Link
                        href="/"
                        className="rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a335d]"
                      >
                        হোমপেজে ফিরে যান
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        আপনার পুরো নাম (Full Name) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="যেমন: মোঃ সাকিব আহমেদ"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                          ই-মেইল ঠিকানা (Email) <span className="text-rose-500">*</span>
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
                          মোবাইল নম্বর (Phone / WhatsApp) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="01XXXXXXXXX"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Position and Experience */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                          কাঙ্ক্ষিত পদ (Desired Position) <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                          অভিজ্ঞতা (Experience Level)
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                        >
                          {EXPERIENCE_LEVELS.map((exp) => (
                            <option key={exp} value={exp}>
                              {exp}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Portfolio / LinkedIn / Drive URL */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        পোর্টফোলিও / লিঙ্কডইন / সিভি ড্রাইভ লিঙ্ক (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/... অথবা Google Drive link"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                      />
                    </div>

                    {/* CV Upload Box */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        সিভি আপলোড করুন (Upload CV / Resume)
                      </label>
                      <label
                        htmlFor="cv-upload"
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                          cvFile
                            ? "border-emerald-400 bg-emerald-50/30"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50"
                        }`}
                      >
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <UploadCloud
                          size={32}
                          className={`mb-2 ${cvFile ? "text-emerald-600" : "text-slate-400"}`}
                        />
                        {cvFile ? (
                          <div>
                            <span className="text-xs font-bold text-emerald-700 sm:text-sm">
                              {cvFile.name}
                            </span>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • ফাইল পরিবর্তন করতে ক্লিক করুন
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-slate-700 sm:text-sm">
                              ক্লিক করে সিভি ফাইল নির্বাচন করুন
                            </span>
                            <p className="mt-1 text-[11px] text-slate-400">
                              PDF, DOC অথবা DOCX ফরম্যাট (সর্বোচ্চ 10MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Short Message / Cover Note */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        নিজের সম্পর্কে সংক্ষেপিত বার্তা (Short Cover Letter)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.coverNote}
                        onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                        placeholder="আপনার পূর্ব অভিজ্ঞতা বা কেন আপনি এই পদে কাজ করতে আগ্রহী সে সম্পর্কে লিখুন..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#12233F] py-4 text-xs font-bold text-white shadow-md transition hover:bg-[#1a335d] hover:shadow-lg disabled:opacity-50 sm:text-sm"
                    >
                      {isSubmitting ? "আবেদন জমা হচ্ছে..." : "আবেদন সম্পন্ন করুন (Submit Application)"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM INSPIRING BANNER
      ========================================================= */}
      <section className="bg-[#12233F] py-14 text-white">
        <div className="mx-auto max-w-[1500px] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[var(--font-poppins)] text-2xl font-black text-[#D6A419] sm:text-3xl lg:text-4xl">
            Join Aladdin Global B2B
          </h2>
          <p className="mt-2 text-base font-medium text-slate-200 sm:text-lg">
            Build your career, Build the future.
          </p>
          <p className="mt-4 text-xs text-slate-400 max-w-xl mx-auto">
            দেশের সবচেয়ে দ্রুত বিকাশমান B2B মাল্টি-ভেন্ডর নেটওয়ার্কের অংশ হয়ে এগিয়ে যান আগামীর সম্ভাবনাময় ভবিষ্যতের দিকে।
          </p>
          <div className="mt-6">
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-[#12233F] shadow transition hover:bg-slate-100 sm:text-sm"
            >
              <Mail size={16} />
              {OFFICIAL_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
