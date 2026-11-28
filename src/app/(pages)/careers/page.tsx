
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
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";

const OFFICIAL_EMAIL = "support@aladdinglobalb2b.com";

const POSITIONS = [
  "সেলস ও ভেন্ডর রিলেশনস এক্সিকিউটিভ",
  "কাস্টমার সাপোর্ট প্রতিনিধি",
  "লজিস্টিকস ও ডেলিভারি অফিসার",
  "ডিজিটাল মার্কেটিং ও সোশ্যাল মিডিয়া এক্সিকিউটিভ",
  "সফটওয়্যার ডেভেলপার / আইটি বিশেষজ্ঞ",
  "গ্রাফিক্স ও কনটেন্ট ক্রিয়েটর",
  "অ্যাকাউন্টস ও ফাইন্যান্স অফিসার",
  "ওয়্যারহাউস ও ইনভেন্টরি কো-অর্ডিনেটর",
  "অন্যান্য / উন্মুক্ত পদ",
];

const EXPERIENCE_OPTIONS = [
  "নতুন / অভিজ্ঞতাহীন",
  "১–২ বছর",
  "৩–৫ বছর",
  "৫ বছরের বেশি (সিনিয়র)",
];

export default function CareersPage() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_EMAIL);
      setCopied(true);
      toast.success("ইমেইল ঠিকানাটি কপি করা হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("ইমেইল ঠিকানাটি কপি করা যায়নি।");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("শুধুমাত্র PDF, DOC অথবা DOCX ফাইল আপলোড করুন।");
        e.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("ফাইলের আকার ১০ মেগাবাইটের বেশি হতে পারবে না।");
        e.target.value = "";
        return;
      }

      setCvFile(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("অনুগ্রহ করে প্রয়োজনীয় সব তথ্য পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("আপনার আবেদন সফলভাবে জমা হয়েছে!");

      window.scrollTo({
        top: document.getElementById("apply-form")?.offsetTop || 400,
        behavior: "smooth",
      });
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

      {/* HERO HEADER */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
            <Briefcase size={14} className="text-[#b48a08]" />
            আলাদিন গ্লোবাল বিটুবিতে ক্যারিয়ার
          </div>

          <h1 className="mt-4 font-[var(--font-poppins)] text-3xl font-extrabold text-[#12233F] sm:text-4xl lg:text-5xl">
            আমাদের টিমে যোগ দিন
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b48a08] sm:text-xl">
            আপনার ক্যারিয়ার গড়ুন, ভবিষ্যৎ গড়ুন।
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            আলাদিন গ্লোবাল বিটুবি একটি আধুনিক মাল্টি-ভেন্ডর
            ই-কমার্স প্ল্যাটফর্ম। আমাদের প্রতিষ্ঠানে কাজ করার
            আগ্রহ থাকলে আপনার জীবনবৃত্তান্ত (CV) ইমেইলের
            মাধ্যমে অথবা নিচের অনলাইন আবেদন ফর্ম ব্যবহার করে
            জমা দিন।
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#1b345e] sm:text-sm"
            >
              <Send size={16} />
              অনলাইনে আবেদন করুন
            </a>

            <a
              href={`mailto:${OFFICIAL_EMAIL}?subject=Application%20for%20Career%20at%20Aladdin%20Global%20B2B`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-sm"
            >
              <Mail size={16} />
              ইমেইলে CV পাঠান
            </a>

          </div>
        </div>
      </section>

      {/* SUBMISSION METHODS */}

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* EMAIL CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Mail size={22} />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#12233F]">
                  ইমেইলের মাধ্যমে CV জমা দিন
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার হালনাগাদ জীবনবৃত্তান্ত সরাসরি আমাদের
                  অফিসিয়াল ইমেইলে পাঠান।
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
                    <span className="text-emerald-600">কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>ইমেইল কপি করুন</span>
                  </>
                )}
              </button>

            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>বিষয়: আবেদনকৃত পদ – আপনার নাম</span>

              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=Job%20Application%20-%20Aladdin%20Global%20B2B`}
                className="font-bold text-[#12233F] hover:text-[#b48a08]"
              >
                ইমেইল খুলুন →
              </a>
            </div>

          </div>

          {/* OFFICE CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Building2 size={22} />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#12233F]">
                  কর্পোরেট অফিস
                </h3>
                <p className="text-xs text-slate-500">
                  সরাসরি অফিসে এসে আপনার জীবনবৃত্তান্ত জমা দিতে পারেন।
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-700">

              <div className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-slate-400" />
                <span>গোনাতা রোড, যশোর – ৭৪০০, বাংলাদেশ</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-slate-400" />
                <span>শনিবার – বৃহস্পতিবার: সকাল ১০টা – রাত ১০টা</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-slate-400" />
                <span>01312-789354</span>
              </div>

            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
              <Link
                href="/contact"
                className="font-bold text-[#12233F] hover:text-[#b48a08]"
              >
                যোগাযোগ ও অবস্থানের বিস্তারিত দেখুন →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* APPLICATION FORM */}

      <section id="apply-form" className="scroll-mt-12 py-12 sm:py-16">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">

            <div className="mb-8 border-b border-slate-100 pb-5 text-center">

              <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
                অনলাইন আবেদন
              </span>

              <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
                চাকরির আবেদন ফর্ম
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                অনুগ্রহ করে আপনার প্রয়োজনীয় তথ্য পূরণ করুন এবং
                জীবনবৃত্তান্ত সংযুক্ত করুন। আমাদের নিয়োগ টিম
                আপনার আবেদন পর্যালোচনা করে প্রয়োজন অনুযায়ী
                আপনার সঙ্গে যোগাযোগ করবে।
              </p>

            </div>

            {/* SUCCESS STATE */}

            {isSubmitted ? (

              <div className="py-10 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#12233F]">
                  আবেদন গ্রহণ করা হয়েছে!
                </h3>

                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                  ধন্যবাদ, <strong>{formData.fullName}</strong>।
                  আলাদিন গ্লোবাল বিটুবিতে কাজ করার আগ্রহ প্রকাশ
                  করার জন্য আমরা কৃতজ্ঞ।
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">

                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    নতুন আবেদন জমা দিন
                  </button>

                  <Link
                    href="/"
                    className="rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a335d]"
                  >
                    হোম পেজে ফিরে যান
                  </Link>

                </div>

              </div>

            ) : (

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* FULL NAME */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* EMAIL & PHONE */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      মোবাইল / হোয়াটসঅ্যাপ নম্বর{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                    />
                  </div>

                </div>

                {/* POSITION & EXPERIENCE */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      পছন্দের পদ <span className="text-rose-500">*</span>
                    </label>

                    <select
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
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
                      কাজের অভিজ্ঞতা
                    </label>

                    <select
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
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

                {/* PORTFOLIO */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    লিংকডইন / পোর্টফোলিও / অনলাইন CV লিংক (ঐচ্ছিক)
                  </label>

                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, portfolioUrl: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/... অথবা Google Drive লিংক"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* CV UPLOAD */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    জীবনবৃত্তান্ত / CV আপলোড করুন (PDF, DOC, DOCX)
                  </label>

                  <label
                    htmlFor="cv-upload-file"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
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
                      className={`mb-2 ${
                        cvFile ? "text-emerald-600" : "text-slate-400"
                      }`}
                    />

                    {cvFile ? (

                      <div>
                        <span className="text-xs font-bold text-emerald-700 sm:text-sm">
                          {cvFile.name}
                        </span>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                          {" "}• পরিবর্তন করতে এখানে ক্লিক করুন
                        </p>
                      </div>

                    ) : (

                      <div>
                        <span className="text-xs font-bold text-slate-700 sm:text-sm">
                          CV ফাইল নির্বাচন করতে ক্লিক করুন
                        </span>

                        <p className="mt-1 text-[11px] text-slate-400">
                          সর্বোচ্চ ফাইলের আকার: ১০ মেগাবাইট
                        </p>
                      </div>

                    )}

                  </label>
                </div>

                {/* COVER NOTE */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    নিজের সম্পর্কে সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                  </label>

                  <textarea
                    rows={3}
                    value={formData.coverNote}
                    onChange={(e) =>
                      setFormData({ ...formData, coverNote: e.target.value })
                    }
                    placeholder="আপনার কাজের অভিজ্ঞতা, দক্ষতা অথবা আলাদিন গ্লোবাল বিটুবিতে কাজ করতে আগ্রহী হওয়ার কারণ সংক্ষেপে লিখুন..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 outline-none transition focus:border-[#12233F] focus:bg-white sm:text-sm"
                  />
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#12233F] py-3.5 text-xs font-bold text-white shadow transition hover:bg-[#1b345e] disabled:opacity-50 sm:text-sm"
                >
                  {isSubmitting
                    ? "আবেদন জমা হচ্ছে..."
                    : "আবেদন জমা দিন"}
                </button>

              </form>

            )}

          </div>
        </div>
      </section>

      {/* FOOTER BANNER */}

      <section className="bg-[#12233F] py-12 text-center text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          <h2 className="font-[var(--font-poppins)] text-xl font-bold text-[#D6A419] sm:text-2xl">
            আলাদিন গ্লোবাল বিটুবি
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
            আপনার ক্যারিয়ার গড়ুন, ভবিষ্যৎ গড়ুন।
          </p>

          <p className="mt-3 text-xs text-slate-400">
            নিয়োগ সংক্রান্ত প্রয়োজনে যোগাযোগ করুন:{" "}
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="text-white underline hover:text-[#D6A419]"
            >
              {OFFICIAL_EMAIL}
            </a>
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-white">
              হোম পেজ
            </Link>
            <span>·</span>
            <Link href="/about-us" className="hover:text-white">
              আমাদের সম্পর্কে
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white">
              যোগাযোগ
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
