
import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  BadgeCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Landmark,
  FileCheck2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   সার্টিফিকেটের তথ্য
   আসল সার্টিফিকেটের ছবি /public/certificates/ ফোল্ডারে রাখবে।
   উদাহরণ: "/certificates/iso-9001.png"
───────────────────────────────────────────────────────────── */

const CERTIFICATES = [
  {
    id: "trade-license",
    name: "ট্রেড লাইসেন্স",
    issuedBy: "বাংলাদেশ সরকার",
    description:
      "বাংলাদেশে বৈধভাবে ব্যবসায়িক কার্যক্রম পরিচালনার জন্য নিবন্ধিত ও লাইসেন্সপ্রাপ্ত প্রতিষ্ঠান।",
    icon: <Landmark size={28} />,
    color: "blue",
  },
  {
    id: "halal",
    name: "হালাল সনদপ্রাপ্ত",
    issuedBy: "বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন",
    description:
      "আমাদের প্ল্যাটফর্মে তালিকাভুক্ত খাদ্য ও ভোগ্যপণ্যের ক্ষেত্রে হালাল মানদণ্ড অনুসরণের প্রতিশ্রুতি।",
    icon: <ShieldCheck size={28} />,
    color: "emerald",
  },
  {
    id: "bsti",
    name: "বিএসটিআই অনুমোদিত",
    issuedBy: "বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন (BSTI)",
    description:
      "আমাদের পণ্যের গুণগত মান ও নিরাপত্তা নিশ্চিত করতে বিএসটিআইয়ের প্রযোজ্য মানদণ্ড অনুসরণ করা হয়।",
    icon: <BadgeCheck size={28} />,
    color: "amber",
  },
  {
    id: "vat",
    name: "ভ্যাট নিবন্ধিত",
    issuedBy: "জাতীয় রাজস্ব বোর্ড (NBR), বাংলাদেশ",
    description:
      "প্রযোজ্য কর ও ভ্যাট সংক্রান্ত নিয়মনীতি মেনে ব্যবসায়িক কার্যক্রম পরিচালনার প্রতিশ্রুতি।",
    icon: <FileCheck2 size={28} />,
    color: "purple",
  },
  {
    id: "iso",
    name: "ISO 9001:2015",
    issuedBy: "আন্তর্জাতিক মান সংস্থা",
    description:
      "আমাদের প্ল্যাটফর্ম, পরিচালনা ব্যবস্থা এবং বিক্রেতা নেটওয়ার্কে গুণগত মান বজায় রাখার প্রতিশ্রুতি।",
    icon: <Award size={28} />,
    color: "rose",
  },
  {
    id: "ssl",
    name: "SSL / TLS নিরাপত্তা",
    issuedBy: "DigiCert / Let's Encrypt",
    description:
      "আমাদের প্ল্যাটফর্মে আদান-প্রদান করা তথ্য SSL/TLS এনক্রিপশন প্রযুক্তির মাধ্যমে সুরক্ষিত থাকে।",
    icon: <Lock size={28} />,
    color: "slate",
  },
];

const TRUST_STATS = [
  { label: "নিবন্ধিত বিক্রেতা", value: "500+", icon: <Globe size={20} /> },
  { label: "পণ্যের ক্যাটাগরি", value: "50+", icon: <Star size={20} /> },
  { label: "ব্যবসায়িক অভিজ্ঞতা", value: "3+", icon: <Award size={20} /> },
  { label: "মান যাচাই সম্পন্ন", value: "10K+", icon: <CheckCircle2 size={20} /> },
];

const COLOR_MAP: Record<
  string,
  { bg: string; icon: string; border: string; badge: string }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    border: "border-rose-100",
    badge: "bg-rose-100 text-rose-700",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "text-slate-600",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
  },
};

/* ─────────────────────────────────────────────────────────────
   মূল পেজ
───────────────────────────────────────────────────────────── */

export default function CertifiedPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">

      {/* ================= HERO SECTION ================= */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
            <ShieldCheck size={14} className="text-[#b48a08]" />
            বিশ্বাস ও নীতিমালা
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-[#12233F] sm:text-4xl lg:text-5xl">
            Aladdin Global B2B — স্বীকৃত ও বিশ্বস্ত প্রতিষ্ঠান
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b48a08] sm:text-xl">
            যাচাইকৃত। নিয়মনীতি অনুসরণকারী। বিশ্বাসের প্রতীক।
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Aladdin Global B2B একটি মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম।
            এখানে আমাদের প্রাতিষ্ঠানিক সনদ, নিবন্ধন এবং নীতিমালা
            সম্পর্কিত তথ্য তুলে ধরা হয়েছে। আমরা বাংলাদেশে প্রচলিত
            প্রযোজ্য আইন, ব্যবসায়িক নিয়মনীতি এবং আন্তর্জাতিক মান
            অনুসরণের মাধ্যমে একটি নির্ভরযোগ্য ব্যবসায়িক পরিবেশ
            গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#1b345e] sm:text-sm"
            >
              <ArrowRight size={16} />
              যোগাযোগ করুন
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-sm"
            >
              পণ্য দেখুন
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRUST STATS ================= */}

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#b48a08]">
                {stat.icon}
              </div>

              <p className="mt-3 text-2xl font-extrabold text-[#12233F]">
                {stat.value}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CERTIFICATE CARDS ================= */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
              আমাদের সনদপত্র
            </span>

            <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
              প্রাতিষ্ঠানিক সনদ ও নিবন্ধন
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              আমাদের প্রতিটি সনদ ও নিবন্ধন গুণগত মান, নিরাপত্তা,
              আইন মেনে ব্যবসা পরিচালনা এবং নৈতিক ব্যবসায়িক
              কার্যক্রমের প্রতি আমাদের অঙ্গীকার তুলে ধরে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATES.map((cert) => {
              const colors = COLOR_MAP[cert.color] ?? COLOR_MAP.slate;

              return (
                <div
                  key={cert.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* সার্টিফিকেট ছবির জায়গা */}

                  <div
                    className={`flex h-48 items-center justify-center border-b ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ${colors.icon}`}
                      >
                        {cert.icon}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${colors.badge}`}
                      >
                        সনদপত্রের ছবির স্থান
                      </span>
                    </div>
                  </div>

                  {/* কার্ডের তথ্য */}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#12233F]">
                        {cert.name}
                      </h3>

                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                    </div>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {cert.issuedBy}
                    </p>

                    <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600">
                      {cert.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 size={12} className="shrink-0" />
                      যাচাইকৃত ও কার্যকর
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            প্রকৃত সনদপত্রের ছবি আপলোড করার পর এখানে প্রদর্শিত হবে। কোনো
            মূল সনদের কপি বা বিস্তারিত তথ্য জানতে{" "}
            <Link
              href="/contact"
              className="font-bold text-[#12233F] hover:text-[#b48a08]"
            >
              আমাদের সঙ্গে যোগাযোগ করুন
            </Link>
            ।
          </p>
        </div>
      </section>

      {/* ================= WHY TRUST US ================= */}

      <section className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">

          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
              কেন আমাদের বেছে নেবেন
            </span>

            <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
              গুণগত মান ও নিরাপত্তার প্রতি আমাদের অঙ্গীকার
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ShieldCheck size={22} />,
                title: "বিক্রেতা যাচাইকরণ",
                body: "Aladdin Global B2B প্ল্যাটফর্মে পণ্য তালিকাভুক্ত করার আগে প্রতিটি বিক্রেতার তথ্য ও প্রয়োজনীয় কাগজপত্র যাচাই করার প্রক্রিয়া অনুসরণ করা হয়।",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: <BadgeCheck size={22} />,
                title: "পণ্যের গুণগত মান নিয়ন্ত্রণ",
                body: "পণ্যের ক্ষেত্রে প্রযোজ্য মান ও নিরাপত্তা সংক্রান্ত বিষয়গুলো যাচাই করার ওপর গুরুত্ব দেওয়া হয়। নিয়মনীতি না মানা পণ্যের তালিকা পর্যালোচনা করা হয়।",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: <Lock size={22} />,
                title: "নিরাপদ লেনদেন",
                body: "আমাদের প্ল্যাটফর্মে তথ্য আদান-প্রদানের নিরাপত্তায় SSL/TLS এনক্রিপশন প্রযুক্তি ব্যবহার করা হয়।",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: <FileCheck2 size={22} />,
                title: "আইন ও নীতিমালা অনুসরণ",
                body: "বাংলাদেশের প্রযোজ্য আইন, ব্যবসায়িক নিয়মনীতি এবং প্রয়োজনীয় নিবন্ধন সংক্রান্ত বিধান মেনে কার্যক্রম পরিচালনার ওপর আমরা গুরুত্ব দিই।",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: <Globe size={22} />,
                title: "স্বচ্ছ ব্যবসায়িক কার্যক্রম",
                body: "ব্যবসায়িক নিবন্ধন, ভ্যাট সংক্রান্ত কাগজপত্র এবং প্রয়োজনীয় নথিপত্র সম্পর্কে আনুষ্ঠানিক অনুরোধের মাধ্যমে তথ্য জানতে পারবেন।",
                color: "text-rose-600 bg-rose-50",
              },
              {
                icon: <Star size={22} />,
                title: "ক্রেতার সুরক্ষা",
                body: "অর্ডার সংক্রান্ত সমস্যা, প্রতারণা বা পণ্য সরবরাহে জটিলতা দেখা দিলে ক্রেতাদের সহায়তা ও অভিযোগ নিষ্পত্তির ব্যবস্থা রাখার ওপর আমরা গুরুত্ব দিই।",
                color: "text-slate-600 bg-slate-100",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#12233F]">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}

      <section className="bg-[#12233F] py-12 text-center text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          <h2 className="text-xl font-bold text-[#D6A419] sm:text-2xl">
            Aladdin Global B2B — স্বীকৃত ও বিশ্বস্ত প্রতিষ্ঠান
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
            যাচাইকৃত। নিয়মনীতি অনুসরণকারী। বিশ্বাসের প্রতীক।
          </p>

          <p className="mt-3 text-xs text-slate-400">
            সনদপত্র সংক্রান্ত তথ্য বা নথির কপি পেতে যোগাযোগ করুন:{" "}
            <a
              href="mailto:support@aladdinglobalb2b.com"
              className="text-white underline hover:text-[#D6A419]"
            >
              support@aladdinglobalb2b.com
            </a>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 sm:text-sm"
            >
              যোগাযোগ করুন
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D6A419] px-6 py-2.5 text-xs font-bold text-[#12233F] transition hover:bg-amber-400 sm:text-sm"
            >
              পণ্য কিনুন <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
