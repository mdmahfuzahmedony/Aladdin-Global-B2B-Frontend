
import React from "react";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Cookie,
  Scale,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const LAST_UPDATED = "নভেম্বর ২০২৬";
const CONTACT_EMAIL = "support@aladdinglobalb2b.com";
const CONTACT_PHONE = "01312-789354";

// ======================================================
// TABLE OF CONTENTS
// ======================================================

const TOC = [
  { id: "privacy", icon: <ShieldCheck size={16} />, label: "গোপনীয়তা নীতি" },
  { id: "shipping", icon: <Truck size={16} />, label: "পরিবহন ও ডেলিভারি" },
  { id: "refund", icon: <RotateCcw size={16} />, label: "পণ্য ফেরত ও টাকা ফেরত" },
  { id: "terms", icon: <FileText size={16} />, label: "শর্তাবলি" },
  { id: "cookies", icon: <Cookie size={16} />, label: "কুকি নীতি" },
  { id: "legal", icon: <Scale size={16} />, label: "আইনগত ও নীতিমালা" },
];

// ======================================================
// MAIN PAGE
// ======================================================

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">

      {/* HERO */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
            <ShieldCheck size={14} className="text-[#b48a08]" />
            আইনগত তথ্য ও গোপনীয়তা
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-[#12233F] sm:text-4xl lg:text-5xl">
            গোপনীয়তা নীতি ও ব্যবহার নির্দেশিকা
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b48a08] sm:text-xl">
            আলাদিন গ্লোবাল বিটুবি — স্বচ্ছতা ও বিশ্বস্ততার প্রতিশ্রুতি
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            আলাদিন গ্লোবাল বিটুবি প্ল্যাটফর্ম ব্যবহারের ক্ষেত্রে
            নিচে উল্লেখিত নীতিমালা ও শর্তাবলি প্রযোজ্য হবে।
            আমাদের সেবা ব্যবহার করার মাধ্যমে আপনি এসব শর্তে
            সম্মতি প্রদান করছেন।
            সর্বশেষ হালনাগাদ: <strong>{LAST_UPDATED}</strong>।
          </p>

        </div>
      </section>

      {/* LAYOUT */}

      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* STICKY SIDEBAR */}

          <aside className="shrink-0 lg:sticky lg:top-6 lg:w-72">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                এই পৃষ্ঠার বিষয়বস্তু
              </p>

              <ul className="space-y-1">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-amber-50 hover:text-[#12233F]"
                    >
                      <span className="text-[#b48a08]">
                        {item.icon}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* QUICK CONTACT */}

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  সহযোগিতা প্রয়োজন?
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 flex items-center gap-1.5 break-all text-xs font-semibold text-[#12233F] hover:text-[#b48a08]"
                >
                  <Mail size={12} className="shrink-0" />
                  {CONTACT_EMAIL}
                </a>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#12233F] hover:text-[#b48a08]"
                >
                  <Phone size={12} />
                  {CONTACT_PHONE}
                </a>

              </div>

            </div>

          </aside>

          {/* MAIN POLICY CONTENT */}

          <div className="min-w-0 flex-1 space-y-6">

            {/* ================================================== */}
            {/* 01. PRIVACY POLICY */}
            {/* ================================================== */}

            <PolicySection
              id="privacy"
              icon={<ShieldCheck size={22} />}
              number="০১"
              title="গোপনীয়তা নীতি"
              subtitle="আপনার ব্যক্তিগত ও ব্যবসায়িক তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ এবং সুরক্ষার নীতিমালা"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                আলাদিন গ্লোবাল বিটুবি একটি মাল্টি-ভেন্ডর
                ই-কমার্স প্ল্যাটফর্ম, যা বাংলাদেশের বিভিন্ন
                অঞ্চলের ক্রেতা, বিক্রেতা ও ব্যবসায়ীদের
                মধ্যে নিরাপদ এবং নির্ভরযোগ্য ব্যবসায়িক
                সংযোগ তৈরি করে। আমাদের প্ল্যাটফর্ম ব্যবহারের
                সময় আপনার ব্যক্তিগত ও ব্যবসায়িক তথ্য কীভাবে
                সংগ্রহ, ব্যবহার, সংরক্ষণ এবং সুরক্ষিত রাখা
                হয়, তা এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে।
              </p>

              <SubHeading
                icon={<Database size={15} />}
                text="১.১ আমরা যে তথ্য সংগ্রহ করি"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমাদের সেবা প্রদান, অর্ডার পরিচালনা এবং
                প্ল্যাটফর্মের নিরাপত্তা নিশ্চিত করার জন্য
                প্রয়োজন অনুযায়ী নিম্নলিখিত তথ্য সংগ্রহ
                করা হতে পারে:
              </p>

              <ul className="space-y-2">
                {[
                  {
                    bold: "ব্যক্তিগত তথ্য:",
                    text: "অ্যাকাউন্ট তৈরির সময় আপনার পূর্ণ নাম, ইমেইল ঠিকানা, মোবাইল নম্বর, প্রোফাইল তথ্য এবং বিলিং ও ডেলিভারির ঠিকানা।",
                  },
                  {
                    bold: "অর্ডার ও লেনদেনের তথ্য:",
                    text: "আপনার অর্ডারের বিবরণ, কেনা পণ্য, পণ্যের পরিমাণ, মূল্য, ডেলিভারি তথ্য, পেমেন্টের অবস্থা এবং লেনদেনের ইতিহাস।",
                  },
                  {
                    bold: "ব্যবসায়িক তথ্য:",
                    text: "বিক্রেতা হিসেবে নিবন্ধনের ক্ষেত্রে প্রতিষ্ঠানের নাম, ব্যবসার ঠিকানা, জাতীয় পরিচয়পত্র (NID), ট্রেড লাইসেন্স এবং TIN-সংক্রান্ত তথ্য।",
                  },
                  {
                    bold: "পেমেন্ট ও পেআউট তথ্য:",
                    text: "লেনদেন সম্পন্ন এবং বিক্রেতাদের অর্থ পরিশোধের জন্য প্রয়োজনীয় ব্যাংক অথবা অনুমোদিত মোবাইল ফিন্যান্সিয়াল সার্ভিসের তথ্য।",
                  },
                  {
                    bold: "স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য:",
                    text: "আইপি অ্যাড্রেস, ব্রাউজারের ধরন, ডিভাইসের তথ্য, লগ, কুকি এবং প্ল্যাটফর্ম ব্যবহারের কিছু প্রযুক্তিগত তথ্য।",
                  },
                ].map((item) => (
                  <li
                    key={item.bold}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>
                      <strong className="text-[#12233F]">
                        {item.bold}
                      </strong>{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <SubHeading
                icon={<Lock size={15} />}
                text="১.২ তথ্য সংগ্রহের উদ্দেশ্য"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আপনার তথ্য আমরা আমাদের সেবা পরিচালনা,
                অর্ডার সম্পন্ন করা এবং প্ল্যাটফর্মের
                নিরাপত্তা বজায় রাখার জন্য ব্যবহার করতে পারি।
                এর মধ্যে রয়েছে:
              </p>

              <ul className="space-y-2">
                {[
                  "ব্যবহারকারীর অ্যাকাউন্ট তৈরি, পরিচালনা ও পরিচয় যাচাই করা।",
                  "ক্রেতার অর্ডার গ্রহণ, প্রক্রিয়াকরণ এবং ডেলিভারি সম্পন্ন করা।",
                  "বিক্রেতাদের অর্ডার, পণ্য, কমিশন ও পেআউট পরিচালনা করা।",
                  "গ্রাহকসেবা, অভিযোগ এবং বিরোধ নিষ্পত্তিতে সহায়তা করা।",
                  "প্রতারণা, অননুমোদিত প্রবেশ এবং সন্দেহজনক কার্যক্রম প্রতিরোধ করা।",
                  "প্ল্যাটফর্মের কার্যকারিতা, নিরাপত্তা এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করা।",
                  "প্রযোজ্য আইন ও সরকারি বিধিবিধান অনুসরণ করা।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <SubHeading
                icon={<UserCheck size={15} />}
                text="১.৩ বিক্রেতাদের তথ্য ও দায়িত্ব"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                বিক্রেতাদের কাছ থেকে সংগৃহীত ব্যবসায়িক ও
                পরিচয় যাচাই-সংক্রান্ত তথ্য অ্যাকাউন্ট
                যাচাই, ব্যবসার বৈধতা নিশ্চিত করা, পেমেন্ট
                পরিচালনা এবং প্ল্যাটফর্মের নিরাপত্তা
                বজায় রাখার জন্য ব্যবহার করা হতে পারে।
                বিক্রেতাদের অবশ্যই সঠিক ও হালনাগাদ তথ্য
                প্রদান করতে হবে এবং ক্রেতার ব্যক্তিগত
                তথ্য কেবল সংশ্লিষ্ট অর্ডার ও বৈধ
                ব্যবসায়িক প্রয়োজনে ব্যবহার করতে হবে।
              </p>

              <SubHeading
                icon={<Eye size={15} />}
                text="১.৪ তথ্য শেয়ার করার ক্ষেত্র"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না।
                তবে প্রয়োজনীয় সেবা পরিচালনা এবং আইনগত
                বাধ্যবাধকতা পূরণের জন্য সীমিত পরিসরে
                তথ্য শেয়ার করা হতে পারে:
              </p>

              <ul className="space-y-2">
                {[
                  "সংশ্লিষ্ট বিক্রেতার সঙ্গে অর্ডার সম্পন্ন ও পণ্য সরবরাহের জন্য প্রয়োজনীয় তথ্য।",
                  "ডেলিভারি ও লজিস্টিকস পার্টনারের সঙ্গে পণ্য পৌঁছে দেওয়ার জন্য প্রয়োজনীয় তথ্য।",
                  "পেমেন্ট সেবা প্রদানকারীর সঙ্গে লেনদেন সম্পন্ন করার জন্য প্রয়োজনীয় তথ্য।",
                  "প্রযোজ্য আইন, আদালতের আদেশ অথবা সরকারি কর্তৃপক্ষের বৈধ অনুরোধে প্রয়োজনীয় তথ্য।",
                  "প্ল্যাটফর্মের নিরাপত্তা ও প্রযুক্তিগত কার্যক্রম পরিচালনায় সহায়তাকারী অনুমোদিত সেবা প্রদানকারীর সঙ্গে প্রয়োজনীয় তথ্য।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <SubHeading
                icon={<Lock size={15} />}
                text="১.৫ পেমেন্ট তথ্যের নিরাপত্তা"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                অনলাইন পেমেন্টের ক্ষেত্রে সংশ্লিষ্ট
                পেমেন্ট সেবা প্রদানকারীর প্রক্রিয়া ও
                নিরাপত্তা নীতিমালা অনুসরণ করা হবে।
                প্রয়োজন ছাড়া আমরা আপনার সম্পূর্ণ
                পেমেন্ট তথ্য সংরক্ষণ করার উদ্দেশ্য রাখি না।
                পেমেন্ট সংক্রান্ত তথ্যের ব্যবহার সংশ্লিষ্ট
                সেবা প্রদানকারীর শর্তাবলির অধীনেও হতে পারে।
              </p>

              <SubHeading
                icon={<Database size={15} />}
                text="১.৬ তথ্য সংরক্ষণ ও নিরাপত্তা"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আপনার তথ্য সুরক্ষিত রাখতে আমরা উপযুক্ত
                প্রযুক্তিগত ও সাংগঠনিক নিরাপত্তা ব্যবস্থা
                গ্রহণের চেষ্টা করি। তথ্যের অননুমোদিত
                প্রবেশ, পরিবর্তন, প্রকাশ বা ক্ষতি
                প্রতিরোধে প্রয়োজনীয় ব্যবস্থা নেওয়া হয়।
                ব্যবসায়িক, আইনগত অথবা সেবা পরিচালনার
                প্রয়োজন যতদিন থাকে, ততদিন তথ্য সংরক্ষণ
                করা হতে পারে। প্রয়োজন শেষ হলে প্রযোজ্য
                নিয়ম অনুযায়ী তথ্য মুছে ফেলা বা নিরাপদভাবে
                নিষ্পত্তি করা হতে পারে।
              </p>

              <SubHeading
                icon={<UserCheck size={15} />}
                text="১.৭ আপনার গোপনীয়তার অধিকার"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                প্রযোজ্য আইন ও আমাদের সেবা পরিচালনার
                শর্তসাপেক্ষে আপনি আপনার ব্যক্তিগত তথ্য
                সম্পর্কে নিম্নলিখিত অনুরোধ জানাতে পারেন:
              </p>

              <ul className="space-y-2">
                {[
                  "আপনার সংরক্ষিত ব্যক্তিগত তথ্য সম্পর্কে জানতে বা তার অনুলিপি চাইতে পারবেন।",
                  "ভুল বা অসম্পূর্ণ তথ্য সংশোধনের অনুরোধ করতে পারবেন।",
                  "আইনগত বাধ্যবাধকতা না থাকলে নির্দিষ্ট তথ্য মুছে ফেলার অনুরোধ করতে পারবেন।",
                  "নির্দিষ্ট ধরনের তথ্য ব্যবহার সীমিত করার অনুরোধ জানাতে পারবেন।",
                  "প্রযোজ্য ক্ষেত্রে বিপণনমূলক যোগাযোগ বন্ধ করার অনুরোধ করতে পারবেন।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <SubHeading
                icon={<ShieldCheck size={15} />}
                text="১.৮ শিশুদের গোপনীয়তা"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমাদের প্ল্যাটফর্ম মূলত ব্যবসায়িক ও
                প্রাপ্তবয়স্ক ব্যবহারকারীদের জন্য তৈরি।
                প্রযোজ্য আইন অনুযায়ী প্রয়োজনীয় বয়সের
                নিচে থাকা কোনো ব্যক্তির তথ্য অভিভাবকের
                যথাযথ সম্মতি ছাড়া সংগ্রহ করার উদ্দেশ্য
                আমাদের নেই। এ ধরনের তথ্য অনিচ্ছাকৃতভাবে
                সংগ্রহ হয়েছে বলে জানা গেলে আমাদের সঙ্গে
                যোগাযোগ করে প্রয়োজনীয় ব্যবস্থা নেওয়ার
                অনুরোধ জানাতে পারবেন।
              </p>

              <SubHeading
                icon={<Eye size={15} />}
                text="১.৯ তৃতীয় পক্ষের ওয়েবসাইট ও সেবা"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমাদের প্ল্যাটফর্মে তৃতীয় পক্ষের
                ওয়েবসাইট, পেমেন্ট সেবা অথবা অন্যান্য
                বাহ্যিক সেবার লিংক থাকতে পারে। এসব
                তৃতীয় পক্ষের নিজস্ব গোপনীয়তা নীতি ও
                ব্যবহারের শর্তাবলি রয়েছে। তাদের তথ্য
                সংগ্রহ ও ব্যবহারের পদ্ধতির জন্য
                সংশ্লিষ্ট প্রতিষ্ঠানের নীতিমালা
                পর্যালোচনা করুন।
              </p>

              <SubHeading
                icon={<Database size={15} />}
                text="১.১০ আন্তর্জাতিক তথ্য স্থানান্তর"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমাদের প্রযুক্তিগত অবকাঠামো অথবা
                তৃতীয় পক্ষের সেবা প্রদানকারী বাংলাদেশের
                বাইরে অবস্থিত হলে প্রয়োজনীয় তথ্য অন্য
                দেশে প্রক্রিয়াকরণ বা সংরক্ষিত হতে পারে।
                এ ধরনের ক্ষেত্রে প্রযোজ্য আইন এবং
                উপযুক্ত নিরাপত্তা ব্যবস্থা অনুসরণের
                চেষ্টা করা হবে।
              </p>

              <SubHeading
                icon={<AlertTriangle size={15} />}
                text="১.১১ তথ্য নিরাপত্তা লঙ্ঘনের ক্ষেত্রে ব্যবস্থা"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                তথ্যের নিরাপত্তা লঙ্ঘন বা অননুমোদিত
                প্রবেশের ঘটনা সম্পর্কে অবগত হলে আমরা
                পরিস্থিতি পর্যালোচনা করে প্রয়োজনীয়
                প্রতিকারমূলক ব্যবস্থা গ্রহণের চেষ্টা
                করব। প্রযোজ্য আইন অনুযায়ী সংশ্লিষ্ট
                ব্যবহারকারী বা কর্তৃপক্ষকে অবহিত
                করা হতে পারে।
              </p>

              <SubHeading
                icon={<Cookie size={15} />}
                text="১.১২ কুকিজ ও ট্র্যাকিং প্রযুক্তি"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                ব্যবহারকারীর পছন্দ সংরক্ষণ, সেশন
                পরিচালনা, নিরাপত্তা এবং প্ল্যাটফর্মের
                কার্যকারিতা বিশ্লেষণের জন্য কুকি ও
                অনুরূপ প্রযুক্তি ব্যবহার করা হতে পারে।
                বিস্তারিত জানতে নিচের কুকি নীতি
                বিভাগটি দেখুন।
              </p>

              <SubHeading
                icon={<FileText size={15} />}
                text="১.১৩ গোপনীয়তা নীতির পরিবর্তন"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আমাদের সেবা, প্রযুক্তি অথবা প্রযোজ্য
                আইন পরিবর্তনের কারণে এই গোপনীয়তা নীতি
                হালনাগাদ করা হতে পারে। পরিবর্তিত নীতি
                এই পৃষ্ঠায় প্রকাশ করা হবে এবং সর্বশেষ
                হালনাগাদের তারিখ উল্লেখ করা হবে।
                গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে
                উপযুক্ত মাধ্যমে ব্যবহারকারীদের
                অবহিত করার চেষ্টা করা হবে।
              </p>

              <SubHeading
                icon={<Mail size={15} />}
                text="১.১৪ গোপনীয়তা সংক্রান্ত যোগাযোগ"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আপনার ব্যক্তিগত তথ্য, গোপনীয়তা, তথ্য
                সংশোধন অথবা মুছে ফেলার অনুরোধের জন্য
                আমাদের সঙ্গে যোগাযোগ করতে পারেন।
              </p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                <p className="text-sm font-bold text-[#12233F]">
                  আলাদিন গ্লোবাল বিটুবি
                </p>

                <div className="mt-3 space-y-2">

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 break-all text-sm font-semibold text-[#12233F] hover:text-[#b48a08]"
                  >
                    <Mail size={15} className="shrink-0" />
                    {CONTACT_EMAIL}
                  </a>

                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center gap-2 text-sm font-semibold text-[#12233F] hover:text-[#b48a08]"
                  >
                    <Phone size={15} />
                    {CONTACT_PHONE}
                  </a>

                </div>

                <p className="mt-3 text-xs leading-relaxed text-amber-800">
                  আপনার অনুরোধ যাচাই করার জন্য প্রয়োজনে
                  অতিরিক্ত পরিচয় নিশ্চিতকরণ তথ্য চাওয়া
                  হতে পারে।
                </p>

              </div>

            </PolicySection>

            {/* ================================================== */}
            {/* 02. SHIPPING & DELIVERY */}
            {/* ================================================== */}

            <PolicySection
              id="shipping"
              icon={<Truck size={22} />}
              number="০২"
              title="পরিবহন ও ডেলিভারি নীতি"
              subtitle="পণ্য পৌঁছানোর সময়সীমা, ডেলিভারি চার্জ ও একাধিক বিক্রেতার অর্ডার"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                বাংলাদেশের বিভিন্ন অঞ্চলে দ্রুত ও নির্ভরযোগ্যভাবে
                পণ্য পৌঁছে দেওয়ার জন্য আলাদিন গ্লোবাল বিটুবি
                বিশ্বস্ত ডেলিভারি ও লজিস্টিকস পার্টনারদের
                সঙ্গে কাজ করে।
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {[
                  {
                    label: "এক্সপ্রেস ডেলিভারি",
                    value: "একই দিনে (নির্বাচিত এলাকায়)",
                    icon: "⚡",
                  },
                  {
                    label: "ঢাকার ভেতরে",
                    value: "১–৩ কার্যদিবস",
                    icon: "🏙️",
                  },
                  {
                    label: "ঢাকার বাইরে",
                    value: "৩–৭ কার্যদিবস",
                    icon: "🗺️",
                  },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-lg">{d.icon}</p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {d.label}
                    </p>

                    <p className="text-sm font-bold text-[#12233F]">
                      {d.value}
                    </p>
                  </div>
                ))}

              </div>

              <SubHeading
                icon={<AlertTriangle size={15} />}
                text="গুরুত্বপূর্ণ নির্দেশনা"
              />

              <ul className="space-y-2">
                {[
                  "বিক্রেতা, পণ্যের ওজন এবং ডেলিভারির অবস্থান অনুযায়ী পরিবহন খরচ ভিন্ন হতে পারে। চূড়ান্ত ডেলিভারি চার্জ অর্ডার সম্পন্ন করার সময় দেখানো হবে।",
                  "একাধিক বিক্রেতার কাছ থেকে পণ্য অর্ডার করলে পণ্যগুলো আলাদাভাবে পাঠানো হতে পারে এবং প্রতিটি অর্ডারের জন্য পৃথক ডেলিভারি চার্জ প্রযোজ্য হতে পারে।",
                  "আপনার অ্যাকাউন্টের 'আমার অর্ডারসমূহ' বিভাগ থেকে অর্ডারের বর্তমান অবস্থা জানতে পারবেন।",
                  "সরকারি ছুটি, জাতীয় অনুষ্ঠান অথবা প্রতিকূল আবহাওয়ার কারণে ডেলিভারির সময় পরিবর্তিত হতে পারে।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

            </PolicySection>

            {/* ================================================== */}
            {/* 03. RETURN & REFUND */}
            {/* ================================================== */}

            <PolicySection
              id="refund"
              icon={<RotateCcw size={22} />}
              number="০৩"
              title="পণ্য ফেরত ও টাকা ফেরত নীতি"
              subtitle="পণ্য ফেরতের যোগ্যতা, প্রক্রিয়া এবং টাকা ফেরত পাওয়ার সময়সীমা"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                আপনি যদি ত্রুটিপূর্ণ, ক্ষতিগ্রস্ত অথবা ভুল
                পণ্য পেয়ে থাকেন, তাহলে নির্ধারিত সময়সীমার
                মধ্যে পণ্য ফেরত অথবা পরিবর্তনের জন্য
                আবেদন করতে পারবেন।
              </p>

              <SubHeading
                icon={<CheckCircle2 size={15} />}
                text="পণ্য ফেরতের শর্তাবলি"
              />

              <ul className="space-y-2">
                {[
                  "পণ্য হাতে পাওয়ার ২৪ থেকে ৭২ ঘণ্টার মধ্যে পণ্য ফেরত অথবা পরিবর্তনের আবেদন জমা দিতে হবে।",
                  "পণ্য অব্যবহৃত এবং মূল প্যাকেজিংয়ে থাকতে হবে। পণ্যের সব ট্যাগ ও আনুষঙ্গিক উপকরণ অক্ষত থাকতে হবে।",
                  "পণ্য ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ হওয়ার প্রমাণ হিসেবে ছবি অথবা ভিডিও আপনার অ্যাকাউন্ট কিংবা কাস্টমার সাপোর্টের মাধ্যমে জমা দিতে হবে।",
                  "পচনশীল পণ্য, বিশেষভাবে তৈরি করা পণ্য এবং ডিজিটাল পণ্য সাধারণত ফেরতযোগ্য নয়।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <SubHeading
                icon={<Database size={15} />}
                text="টাকা ফেরত পাওয়ার প্রক্রিয়া"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {[
                  {
                    step: "০১",
                    label: "আবেদন জমা",
                    desc: "নির্ধারিত সময়সীমার মধ্যে আপনার অ্যাকাউন্ট থেকে পণ্য ফেরত বা টাকা ফেরতের আবেদন করুন।",
                  },
                  {
                    step: "০২",
                    label: "যাচাই ও অনুমোদন",
                    desc: "আমাদের টিম ২–৫ কার্যদিবসের মধ্যে আপনার আবেদন পর্যালোচনা করবে।",
                  },
                  {
                    step: "০৩",
                    label: "টাকা ফেরত",
                    desc: "অনুমোদিত টাকা ফেরত সাধারণত ৫–১০ কার্যদিবসের মধ্যে মূল পেমেন্ট মাধ্যমে পাঠানো হবে।",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <span className="text-2xl font-extrabold text-amber-400">
                      {s.step}
                    </span>

                    <p className="mt-1 text-xs font-bold text-[#12233F]">
                      {s.label}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {s.desc}
                    </p>
                  </div>
                ))}

              </div>

            </PolicySection>

            {/* ================================================== */}
            {/* 04. TERMS & CONDITIONS */}
            {/* ================================================== */}

            <PolicySection
              id="terms"
              icon={<FileText size={22} />}
              number="০৪"
              title="শর্তাবলি"
              subtitle="আলাদিন গ্লোবাল বিটুবি প্ল্যাটফর্ম ব্যবহারের নিয়ম ও নীতিমালা"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                আলাদিন গ্লোবাল বিটুবি ব্যবহার বা অ্যাক্সেস
                করার মাধ্যমে আপনি এই শর্তাবলিতে সম্মতি
                প্রদান করছেন। আপনি যদি এসব শর্তে সম্মত
                না হন, তাহলে অনুগ্রহ করে আমাদের প্ল্যাটফর্ম
                ব্যবহার বন্ধ করুন।
              </p>

              {[
                {
                  title: "১. শর্তাবলিতে সম্মতি",
                  body: "আমাদের প্ল্যাটফর্ম ব্যবহার করার অর্থ হলো আপনি এই শর্তাবলি সম্পূর্ণভাবে মেনে নিচ্ছেন। আমরা যেকোনো সময় এসব শর্ত পরিবর্তন বা হালনাগাদ করার অধিকার সংরক্ষণ করি। পরিবর্তিত শর্ত কার্যকর হওয়ার পরও প্ল্যাটফর্ম ব্যবহার অব্যাহত রাখলে তা নতুন শর্তে সম্মতি হিসেবে গণ্য হবে।",
                },
                {
                  title: "২. বিক্রেতা অ্যাকাউন্ট নিবন্ধন",
                  body: "বিক্রেতাদের অবশ্যই সঠিক ও বৈধ ব্যবসায়িক তথ্য প্রদান করতে হবে। এর মধ্যে জাতীয় পরিচয়পত্র (NID), বৈধ ট্রেড লাইসেন্স এবং কর শনাক্তকরণ নম্বর (TIN) অন্তর্ভুক্ত। ভুল বা মিথ্যা তথ্য প্রদান করলে অ্যাকাউন্ট স্থগিত করা হতে পারে এবং বকেয়া পাওনা যাচাইয়ের জন্য সাময়িকভাবে আটকে রাখা হতে পারে।",
                },
                {
                  title: "৩. কমিশন ও অর্থ পরিশোধ",
                  body: "সফল লেনদেনের ওপর আলাদিন নির্ধারিত কমিশন চার্জ করে। প্রশাসনিক যাচাইয়ের পর বিক্রেতার পেমেন্ট সেটিংস অনুযায়ী ব্যাংক ট্রান্সফার, বিকাশ অথবা নগদের মাধ্যমে অর্থ পরিশোধ করা হবে।",
                },
                {
                  title: "৪. নিষিদ্ধ কার্যক্রম",
                  body: "নকল পণ্য তালিকাভুক্ত করা, প্রতারণামূলক লেনদেন, পণ্যের মূল্য নিয়ে কারসাজি অথবা প্ল্যাটফর্মের নিরাপত্তা ব্যবস্থা ভাঙার চেষ্টা করা ব্যবহারকারী ও বিক্রেতাদের জন্য সম্পূর্ণ নিষিদ্ধ।",
                },
                {
                  title: "৫. অ্যাকাউন্ট স্থগিতকরণ",
                  body: "কোনো ব্যবহারকারী বা বিক্রেতা এই শর্তাবলি লঙ্ঘন করলে প্ল্যাটফর্ম কর্তৃপক্ষ প্রয়োজন অনুযায়ী তার অ্যাকাউন্ট সাময়িকভাবে স্থগিত অথবা স্থায়ীভাবে বাতিল করার অধিকার রাখে।",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="text-sm font-bold text-[#12233F]">
                    {item.title}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}

            </PolicySection>

            {/* ================================================== */}
            {/* 05. COOKIE POLICY */}
            {/* ================================================== */}

            <PolicySection
              id="cookies"
              icon={<Cookie size={22} />}
              number="০৫"
              title="কুকি নীতি"
              subtitle="কুকি এবং অনুরূপ প্রযুক্তি কীভাবে ব্যবহার করা হয়"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করা,
                ওয়েবসাইটের ব্যবহার বিশ্লেষণ এবং প্রয়োজনীয়
                কনটেন্ট প্রদানের জন্য আলাদিন গ্লোবাল বিটুবি
                কুকি ও অনুরূপ প্রযুক্তি ব্যবহার করতে পারে।
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {[
                  {
                    name: "অপরিহার্য কুকি",
                    desc: "প্ল্যাটফর্ম সঠিকভাবে পরিচালনার জন্য প্রয়োজনীয়। এর মধ্যে সেশন পরিচালনা, ব্যবহারকারীর পরিচয় যাচাই এবং নিরাপত্তা সংক্রান্ত তথ্য অন্তর্ভুক্ত।",
                    required: true,
                  },
                  {
                    name: "বিশ্লেষণমূলক কুকি",
                    desc: "ব্যবহারকারীরা কীভাবে আমাদের প্ল্যাটফর্ম ব্যবহার করেন তা বুঝতে এবং সেবার মান ও কার্যকারিতা উন্নত করতে সাহায্য করে।",
                    required: false,
                  },
                  {
                    name: "পছন্দ সংরক্ষণকারী কুকি",
                    desc: "ভাষা, অঞ্চল এবং কার্টে সংরক্ষিত পণ্যের মতো আপনার পছন্দ ও সেটিংস মনে রাখতে সাহায্য করে।",
                    required: false,
                  },
                  {
                    name: "বিজ্ঞাপন সংক্রান্ত কুকি",
                    desc: "প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন এবং আমাদের প্রচারণার কার্যকারিতা পরিমাপ করার জন্য ব্যবহার করা হতে পারে।",
                    required: false,
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-bold text-[#12233F]">
                        {c.name}
                      </p>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          c.required
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {c.required ? "আবশ্যিক" : "ঐচ্ছিক"}
                      </span>

                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {c.desc}
                    </p>

                  </div>
                ))}

              </div>

              <SubHeading
                icon={<Cookie size={15} />}
                text="কুকি নিয়ন্ত্রণ"
              />

              <p className="text-sm leading-relaxed text-slate-600">
                আপনি আপনার ব্রাউজারের সেটিংস থেকে
                অপ্রয়োজনীয় কুকি নিয়ন্ত্রণ অথবা বন্ধ করতে
                পারবেন। তবে কুকি বন্ধ করলে প্ল্যাটফর্মের
                কিছু সুবিধা সঠিকভাবে কাজ নাও করতে পারে।
              </p>

            </PolicySection>

            {/* ================================================== */}
            {/* 06. LEGAL & COMPLIANCE */}
            {/* ================================================== */}

            <PolicySection
              id="legal"
              icon={<Scale size={22} />}
              number="০৬"
              title="আইনগত ও নীতিমালা সংক্রান্ত তথ্য"
              subtitle="আইনগত বাধ্যবাধকতা এবং একজন ব্যবহারকারী হিসেবে আপনার অধিকার"
            >

              <p className="text-sm leading-relaxed text-slate-600">
                আলাদিন গ্লোবাল বিটুবি বাংলাদেশের প্রচলিত
                আইন ও সরকারি বিধিবিধান অনুসরণ করে
                ব্যবসায়িক কার্যক্রম পরিচালনার প্রতিশ্রুতি
                প্রদান করে। এর মধ্যে ই-কমার্স, ভোক্তা
                অধিকার এবং তথ্যের গোপনীয়তা সংক্রান্ত
                প্রযোজ্য নির্দেশনাগুলো অন্তর্ভুক্ত।
              </p>

              <ul className="space-y-2">
                {[
                  "আমরা বাংলাদেশের যশোর থেকে ব্যবসায়িক কার্যক্রম পরিচালনা করি। প্রতিষ্ঠানের নিবন্ধন ও লাইসেন্স সংক্রান্ত তথ্য প্রযোজ্য নথি অনুযায়ী যাচাইযোগ্য।",
                  "আমাদের প্ল্যাটফর্ম ব্যবহারের ফলে সৃষ্ট যেকোনো বিরোধ বাংলাদেশের প্রচলিত আইন অনুযায়ী নিষ্পত্তির চেষ্টা করা হবে।",
                  "ব্যবহারকারীরা আমাদের সাপোর্ট টিমের সঙ্গে যোগাযোগ করে নিজেদের ব্যক্তিগত তথ্য দেখার, সংশোধন করার অথবা মুছে ফেলার অনুরোধ জানাতে পারবেন।",
                  "ডিজিটাল পেমেন্ট প্রক্রিয়াকরণের ক্ষেত্রে সংশ্লিষ্ট পেমেন্ট সেবা প্রদানকারীর নিয়ম ও প্রযোজ্য নির্দেশনা অনুসরণ করা হবে।",
                  "তথ্য নিরাপত্তা লঙ্ঘনের ঘটনা ঘটলে প্রযোজ্য আইন অনুযায়ী প্রয়োজনীয় ব্যবস্থা গ্রহণ করা হবে।",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* USER RIGHTS */}

              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">

                <UserCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs leading-relaxed text-amber-800">
                  <strong>আপনার অধিকার:</strong>{" "}
                  প্রযোজ্য আইন ও নীতিমালা অনুযায়ী আপনি
                  আপনার ব্যক্তিগত তথ্য দেখার, সংশোধন
                  করার অথবা মুছে ফেলার অনুরোধ জানাতে
                  পারেন। এজন্য আমাদের ইমেইল করুন:

                  {" "}

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-all font-bold underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  ।
                </p>

              </div>

            </PolicySection>

            {/* ================================================== */}
            {/* CONTACT SUPPORT BOX */}
            {/* ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
                    কোনো প্রশ্ন বা অভিযোগ আছে?
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#12233F]">
                    আমাদের সাপোর্ট টিমের সঙ্গে যোগাযোগ করুন
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    এই নীতিমালা, ব্যক্তিগত তথ্য অথবা অর্ডার
                    সংক্রান্ত যেকোনো সহযোগিতার জন্য আমাদের
                    সঙ্গে যোগাযোগ করুন।
                  </p>

                  <div className="mt-3 space-y-1">

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center gap-2 break-all text-xs font-semibold text-[#12233F] hover:text-[#b48a08]"
                    >
                      <Mail size={13} />
                      {CONTACT_EMAIL}
                    </a>

                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="flex items-center gap-2 text-xs font-semibold text-[#12233F] hover:text-[#b48a08]"
                    >
                      <Phone size={13} />
                      {CONTACT_PHONE}
                    </a>

                  </div>

                </div>

                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b345e]"
                >
                  যোগাযোগ পৃষ্ঠায় যান
                  <ArrowRight size={14} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* BOTTOM CTA BANNER */}
      {/* ================================================== */}

      <section className="bg-[#12233F] py-10 text-center text-white">

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          <h2 className="text-xl font-bold text-[#D6A419] sm:text-2xl">
            আলাদিন গ্লোবাল বিটুবি
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            © {new Date().getFullYear()} Aladdin Global B2B
            সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">

            <Link href="/terms" className="hover:text-white">
              শর্তাবলি
            </Link>

            <span>·</span>

            <Link href="/privacy-policy" className="hover:text-white">
              গোপনীয়তা নীতি
            </Link>

            <span>·</span>

            <Link href="/certified" className="hover:text-white">
              অনুমোদিত ও বিশ্বস্ত
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

// ======================================================
// REUSABLE SECTION WRAPPER
// ======================================================

function PolicySection({
  id,
  icon,
  number,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >

      {/* SECTION HEADER */}

      <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#b48a08]">
          {icon}
        </div>

        <div className="min-w-0">

          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            বিভাগ {number}
          </span>

          <h2 className="text-xl font-bold text-[#12233F]">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="space-y-4">
        {children}
      </div>

    </section>
  );
}

// ======================================================
// SUB HEADING
// ======================================================

function SubHeading({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 pt-2">

      <span className="shrink-0 text-[#b48a08]">
        {icon}
      </span>

      <h3 className="text-sm font-bold text-[#12233F]">
        {text}
      </h3>

    </div>
  );
}
