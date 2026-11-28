
"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Send,
  ShoppingBag,
  Store,
  Users,
  Handshake,
  LoaderCircle,
  FileText,
} from "lucide-react";

import FAQSection from "@/components/section/home/faq-section";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20";

// ======================================================
// CONTACT PAGE
// ======================================================

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    setIsSubmitting(true);
    setSubmitted(false);

    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      form.reset();
    }, 500);
  };

  return (
    <main className="min-h-screen bg-white text-[#12233F]">

      {/* CONTACT INFORMATION */}

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-20">

        <div className="mb-10 max-w-2xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
            যোগাযোগ করুন
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            আপনার সঙ্গে কথা বলতে আমরা আগ্রহী
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            আপনার যেকোনো প্রশ্ন, মতামত কিংবা সহযোগিতার প্রয়োজনে
            আমাদের সঙ্গে যোগাযোগ করুন। আপনার সুবিধামতো যোগাযোগের
            মাধ্যমটি বেছে নিন। আমাদের টিম আপনাকে প্রয়োজনীয়
            সহযোগিতা দিতে প্রস্তুত।
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <ContactInfoCard
            icon={Phone}
            title="ফোন করুন"
            description="প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত"
            value="01312-789354"
            href="tel:01312789354"
          />

          <ContactInfoCard
            icon={Mail}
            title="ইমেইল করুন"
            description="আপনার প্রশ্ন বা মতামত আমাদের ইমেইলে পাঠান।"
            value="support@aladdinglobalb2b.com"
            href="mailto:support@aladdinglobalb2b.com"
          />

          <ContactInfoCard
            icon={MapPin}
            title="অফিসের ঠিকানা"
            description="গণতা রোড, যশোর, বাংলাদেশ"
            value="যশোর - ৭৪০০"
          />

          <ContactInfoCard
            icon={FileText}
            title="ট্রেড লাইসেন্স"
            description="প্রাতিষ্ঠানিক ব্যবসায়িক নিবন্ধন"
            value="যাচাইকৃত ও সুরক্ষিত"
          />

        </div>

      </section>

      {/* CONTACT FORM AND SUPPORT */}

      <section
        id="contact-form"
        className="scroll-mt-24 bg-gray-50 py-16 lg:py-20"
      >

        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

          {/* CONTACT FORM */}

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">

            <div className="mb-8">

              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D6A419]/15 text-[#12233F]">
                <Send size={22} />
              </span>

              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                আমাদের বার্তা পাঠান
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                নিচের ফর্মটি পূরণ করে আপনার প্রশ্ন, মতামত
                অথবা সহযোগিতার প্রয়োজন সম্পর্কে আমাদের জানান।
              </p>

            </div>

            {/* SUCCESS MESSAGE */}

            {submitted && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

                <p>
                  আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।
                  আমাদের টিম শিগগিরই আপনার সঙ্গে যোগাযোগ করবে।
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME AND EMAIL */}

              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="আপনার পূর্ণ নাম"
                  htmlFor="fullName"
                  required
                >
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField
                  label="ইমেইল ঠিকানা"
                  htmlFor="email"
                  required
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </FormField>

              </div>

              {/* PHONE AND ROLE */}

              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="মোবাইল নম্বর"
                  htmlFor="phone"
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01312-789354"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="আপনি কে?"
                  htmlFor="contactType"
                  required
                >
                  <select
                    id="contactType"
                    name="contactType"
                    className={inputClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      একটি অপশন নির্বাচন করুন
                    </option>

                    <option value="customer">
                      গ্রাহক
                    </option>

                    <option value="vendor">
                      বিক্রেতা
                    </option>

                    <option value="business">
                      ব্যবসায়িক পার্টনার
                    </option>

                    <option value="other">
                      অন্যান্য
                    </option>
                  </select>
                </FormField>

              </div>

              {/* SUBJECT */}

              <FormField
                label="বিষয়"
                htmlFor="subject"
                required
              >
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="আপনার বার্তার বিষয় লিখুন"
                  className={inputClass}
                  required
                />
              </FormField>

              {/* MESSAGE */}

              <FormField
                label="আপনার বার্তা"
                htmlFor="message"
                required
              >
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="এখানে আপনার বার্তা লিখুন..."
                  className={`${inputClass} resize-y`}
                  required
                />
              </FormField>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-6 py-4 font-semibold text-white transition hover:bg-[#1c365c] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >

                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    বার্তা পাঠান
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

          </div>

          {/* SUPPORT INFORMATION */}

          <div className="flex flex-col gap-6">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
                কীভাবে সহযোগিতা করতে পারি?
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                আপনার প্রয়োজন অনুযায়ী সঠিক সহযোগিতা
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                আপনি পণ্য কিনতে চান, নিজের অনলাইন স্টোর পরিচালনা
                করতে চান কিংবা ব্যবসায়িক অংশীদার হতে চান—
                প্রতিটি ক্ষেত্রেই আপনার অভিজ্ঞতাকে সহজ ও
                স্বাচ্ছন্দ্যময় করতে আমরা পাশে আছি।
              </p>

            </div>

            <SupportLink
              icon={ShoppingBag}
              title="গ্রাহক সহায়তা"
              description="অর্ডার, পেমেন্ট, পণ্য ফেরত কিংবা ডেলিভারি সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের সঙ্গে যোগাযোগ করুন।"
              href="/help"
            />

            <SupportLink
              icon={Store}
              title="বিক্রেতা সহায়তা"
              description="আপনার স্টোর, পণ্য অথবা বিক্রেতা অ্যাকাউন্ট পরিচালনায় সহযোগিতা প্রয়োজন?"
              href="/vendor"
            />

            <SupportLink
              icon={Handshake}
              title="ব্যবসায়িক অংশীদারিত্ব"
              description="আমাদের মার্কেটপ্লেসের সঙ্গে ব্যবসায়িকভাবে যুক্ত হতে বা একসঙ্গে কাজ করতে আগ্রহী?"
              href="mailto:support@aladdinglobalb2b.com"
            />

            <SupportLink
              icon={Package}
              title="অর্ডার ও ডেলিভারি"
              description="পণ্য পাঠানো, অর্ডার ট্র্যাকিং এবং ডেলিভারির সর্বশেষ তথ্য জানতে সহযোগিতা নিন।"
              href="/orders"
            />

            {/* SUPPORT MESSAGE */}

            <div className="rounded-2xl bg-[#12233F] p-6 text-white">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D6A419] text-[#12233F]">
                  <Users size={22} />
                </div>

                <div>

                  <h3 className="font-bold">
                    আমরা সবসময় আপনার পাশে আছি
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/70">
                    আমাদের লক্ষ্য হলো প্রতিটি গ্রাহক ও বিক্রেতাকে
                    তাদের পুরো কেনাকাটা ও ব্যবসায়িক যাত্রায়
                    প্রয়োজনীয় সহযোগিতা এবং সুন্দর অভিজ্ঞতা দেওয়া।
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* BUSINESS ASSISTANCE */}

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-20">

        <div className="grid gap-8 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">

          <div className="flex items-start gap-5">

            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D6A419]/15 text-[#12233F] sm:flex">
              <Building2 size={27} />
            </div>

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
                ব্যবসায়ীদের জন্য
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                চলুন, একসঙ্গে এগিয়ে যাই
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                আপনি কি আমাদের প্ল্যাটফর্মে পণ্য বিক্রি করতে চান,
                নতুন গ্রাহকের কাছে পৌঁছাতে চান অথবা ব্যবসায়িক
                অংশীদারিত্ব গড়ে তুলতে আগ্রহী? তাহলে আমাদের
                সঙ্গে যোগাযোগ করুন। একসঙ্গে কাজ করার
                সম্ভাবনাগুলো নিয়ে আলোচনা করি।
              </p>

            </div>

          </div>

          <Link
            href="/vendor"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6A419] px-6 py-3.5 font-semibold text-[#12233F] transition hover:bg-[#e7b92d]"
          >
            বিক্রেতা হিসেবে যুক্ত হোন
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* LOCATION */}

      <section className="bg-gray-50 py-16 lg:py-20">

        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
              আমাদের খুঁজে নিন
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              আমাদের অফিসের ঠিকানা
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              বাংলাদেশের বিভিন্ন প্রান্তের গ্রাহক ও বিক্রেতাদের
              সহযোগিতা করতে আমরা প্রতিশ্রুতিবদ্ধ। আমাদের অফিসে
              আসার আগে অফিসের উপস্থিতি ও সময়সূচি নিশ্চিত করতে
              অনুগ্রহ করে আমাদের টিমের সঙ্গে যোগাযোগ করুন।
            </p>

            {/* ADDRESS */}

            <div className="mt-7 flex items-start gap-4">

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F]">
                <MapPin size={23} />
              </span>

              <div>

                <h3 className="font-bold">
                  গণতা রোড, যশোর - ৭৪০০
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  আলাদিন গ্লোবাল বিটুবি অফিসের ঠিকানা ও
                  যাতায়াতের দিকনির্দেশনা।
                </p>

              </div>

            </div>

            {/* BUSINESS HOURS */}

            <div className="mt-6 flex items-start gap-4">

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F]">
                <Clock3 size={23} />
              </span>

              <div>

                <h3 className="font-bold">
                  অফিসের সময়সূচি
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  শনিবার থেকে বৃহস্পতিবার এবং শুক্রবার:
                  সকাল ১০টা থেকে রাত ১০টা।
                </p>

              </div>

            </div>

          </div>

          {/* MAP CARD */}

          <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 sm:min-h-[360px]">

            <div className="max-w-sm text-center">

              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12233F] text-[#D6A419]">
                <MapPin size={30} />
              </span>

              <h3 className="mt-5 text-xl font-bold">
                গণতা রোড, যশোর - ৭৪০০
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                অফিসের অবস্থান ও যাতায়াতের বিস্তারিত তথ্যের
                জন্য আমাদের সঙ্গে যোগাযোগ করুন।
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Gonata+Road+Jashore"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:border-[#D6A419] hover:bg-gray-50"
              >
                গুগল ম্যাপে দেখুন
                <ArrowRight size={16} />
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* FAQ SECTION */}

      <div id="common-questions" className="scroll-mt-24">
        <FAQSection />
      </div>

      {/* FINAL CTA */}

      <section className="bg-[#12233F]">

        <div className="mx-auto flex max-w-[1500px] flex-col gap-7 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:py-16">

          <div className="max-w-2xl">

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              আপনার কি আরও কোনো প্রশ্ন আছে?
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              আপনাকে সহযোগিতা করতে আমরা সবসময় প্রস্তুত।
              আমাদের একটি বার্তা পাঠান, আমাদের টিম আপনাকে
              প্রয়োজনীয় তথ্য ও সঠিক দিকনির্দেশনা দিয়ে সহায়তা করবে।
            </p>

          </div>

          <a
            href="#contact-form"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D6A419] px-6 py-4 font-semibold text-[#12233F] transition hover:bg-[#e7b92d]"
          >
            যোগাযোগ করুন
            <ArrowRight size={18} />
          </a>

        </div>

      </section>

    </main>
  );
}

// ======================================================
// CONTACT INFO CARD
// ======================================================

type ContactInfoCardProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  value: string;
  href?: string;
};

function ContactInfoCard({
  icon: Icon,
  title,
  description,
  value,
  href,
}: ContactInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">

      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F]">
        <Icon size={23} />
      </span>

      <h3 className="mt-5 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

      {href ? (
        <a
          href={href}
          className="mt-4 inline-block break-words text-sm font-semibold text-[#12233F] transition hover:text-[#b48a08]"
        >
          {value}
        </a>
      ) : (
        <p className="mt-4 break-words text-sm font-semibold text-[#12233F]">
          {value}
        </p>
      )}

    </div>
  );
}

// ======================================================
// FORM FIELD
// ======================================================

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

function FormField({
  label,
  htmlFor,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>

      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

    </div>
  );
}

// ======================================================
// SUPPORT LINK
// ======================================================

type SupportLinkProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  href: string;
};

function SupportLink({
  icon: Icon,
  title,
  description,
  href,
}: SupportLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-[#D6A419]/50 hover:shadow-md"
    >

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F] transition group-hover:bg-[#D6A419]">
        <Icon size={21} />
      </span>

      <span className="min-w-0 flex-1">

        <span className="flex items-center justify-between gap-3 font-bold text-[#12233F]">

          {title}

          <ArrowRight
            size={17}
            className="shrink-0 transition group-hover:translate-x-1"
          />

        </span>

        <span className="mt-2 block text-sm leading-6 text-gray-600">
          {description}
        </span>

      </span>

    </Link>
  );
}
