
"use client";

import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Truck,
  Users,
  ArrowRight,
} from "lucide-react";

export default function AboutUsPage() {
  const features = [
    {
      icon: <Building2 size={24} />,
      color: "bg-amber-400/10 text-amber-600",
      title: "বিভিন্ন ধরনের পণ্যের সমাহার",
      description:
        "নিত্যপ্রয়োজনীয় পণ্য থেকে শুরু করে বিভিন্ন ক্যাটাগরির মানসম্মত পণ্য পাবেন একটি প্ল্যাটফর্মেই।",
    },
    {
      icon: <Users size={24} />,
      color: "bg-blue-500/10 text-blue-600",
      title: "সহজ ও স্বাচ্ছন্দ্যময় কেনাকাটা",
      description:
        "ঘরে বসেই আপনার প্রয়োজনীয় পণ্য খুঁজে নিন এবং সহজেই অর্ডার সম্পন্ন করুন।",
    },
    {
      icon: <ShieldCheck size={24} />,
      color: "bg-emerald-500/10 text-emerald-600",
      title: "বিশ্বস্ত কেনাকাটার অভিজ্ঞতা",
      description:
        "বিশ্বস্ত বিক্রেতা ও মানসম্মত পণ্যের সমন্বয়ে একটি নির্ভরযোগ্য কেনাকাটার অভিজ্ঞতা দেওয়াই আমাদের লক্ষ্য।",
    },
    {
      icon: <Truck size={24} />,
      color: "bg-purple-500/10 text-purple-600",
      title: "সারা বাংলাদেশে ডেলিভারি",
      description:
        "আপনি বাংলাদেশের যে প্রান্তেই থাকুন না কেন, আপনার পছন্দের পণ্য পৌঁছে যাবে আপনার ঠিকানায়।",
    },
  ];

  return (
    <div className="w-full bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 sm:text-sm">
            Aladdin Global B2B সম্পর্কে
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight text-[#12233F] sm:text-4xl lg:text-5xl">
            আপনার প্রয়োজনীয় পণ্য, এখন ঘরে বসেই
          </h1>

          <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base lg:text-lg">
            Aladdin Global B2B একটি অনলাইন শপিং প্ল্যাটফর্ম,
            যার মাধ্যমে আপনি ঘরে বসেই সহজে আপনার প্রয়োজনীয়
            বিভিন্ন পণ্য অর্ডার করতে পারবেন এবং বাংলাদেশের
            যেকোনো প্রান্তে ডেলিভারি নিতে পারবেন।
          </p>

        </div>

        {/* FEATURES SECTION */}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold leading-snug text-[#12233F]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

        {/* DETAILED CONTENT SECTION */}

        <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

            {/* LEFT CONTENT */}

            <div>

              <h2 className="text-2xl font-bold leading-snug text-[#12233F] sm:text-3xl">
                আমরা কারা এবং আমাদের লক্ষ্য কী?
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                আলাদিন গ্লোবাল বিটুবি এমন একটি অনলাইন প্ল্যাটফর্ম,
                যার মাধ্যমে কেনাকাটাকে আরও সহজ, দ্রুত ও স্বাচ্ছন্দ্যময়
                করে তোলাই আমাদের উদ্দেশ্য। এখানে বিভিন্ন ধরনের
                পণ্য এক জায়গায় পাওয়া যায়, যেন গ্রাহকরা সহজেই
                তাঁদের প্রয়োজনীয় পণ্য খুঁজে নিতে এবং অর্ডার করতে পারেন।
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                আপনি নিজের বাসার জন্য, ব্যক্তিগত প্রয়োজন কিংবা
                ব্যবসার কাজে পণ্য কিনতে চান—সব ক্ষেত্রেই আপনার
                কেনাকাটার অভিজ্ঞতাকে সহজ করাই আমাদের লক্ষ্য।
                আমরা সারা বাংলাদেশের গ্রাহকদের জন্য সুবিধাজনক
                অনলাইন কেনাকাটা এবং নির্ভরযোগ্য ডেলিভারি সেবা
                নিশ্চিত করতে কাজ করে যাচ্ছি।
              </p>

              <div className="mt-7">

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#1d3557] hover:shadow-lg"
                >
                  পণ্য দেখুন

                  <ArrowRight
                    size={17}
                    className="rotate-180"
                  />

                </Link>

              </div>

            </div>

            {/* RIGHT HIGHLIGHT */}

            <div className="flex justify-center">

              <div className="w-full max-w-md rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-inner sm:p-10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600">
                  <Building2 size={32} />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#12233F] sm:text-2xl">
                  সহজ অনলাইন কেনাকাটা
                </h3>

                <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">
                  ঘরে বসেই খুঁজে নিন আপনার পছন্দের পণ্য এবং
                  উপভোগ করুন সহজ ও স্বাচ্ছন্দ্যময় কেনাকাটার
                  অভিজ্ঞতা।
                </p>

                <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#D6A419]" />

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
