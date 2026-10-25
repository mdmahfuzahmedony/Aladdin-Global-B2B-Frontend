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

/* ─────────────────────────────────────────────────────────────────────────────
   CERTIFICATE DATA
   Replace `imageSrc` values with your real certificate image paths once you
   place them in /public/certificates/  (e.g. "/certificates/iso-9001.png")
───────────────────────────────────────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: "trade-license",
    name: "Trade License",
    issuedBy: "Bangladesh Government",
    description:
      "Officially registered and licensed to conduct business operations in Bangladesh.",
    icon: <Landmark size={28} />,
    color: "blue",
    // imageSrc: "/certificates/trade-license.jpg",
  },
  {
    id: "halal",
    name: "Halal Certified",
    issuedBy: "Bangladesh Standards and Testing Institution",
    description:
      "All food and consumable products listed on our platform comply with Halal standards.",
    icon: <ShieldCheck size={28} />,
    color: "emerald",
    // imageSrc: "/certificates/halal-certificate.jpg",
  },
  {
    id: "bsti",
    name: "BSTI Approved",
    issuedBy: "Bangladesh Standards and Testing Institution (BSTI)",
    description:
      "Our product quality framework meets BSTI safety and testing standards for consumer goods.",
    icon: <BadgeCheck size={28} />,
    color: "amber",
    // imageSrc: "/certificates/bsti-approved.jpg",
  },
  {
    id: "vat",
    name: "VAT Registered",
    issuedBy: "National Board of Revenue (NBR), Bangladesh",
    description:
      "Fully VAT-registered business entity operating in full compliance with tax regulations.",
    icon: <FileCheck2 size={28} />,
    color: "purple",
    // imageSrc: "/certificates/vat-certificate.jpg",
  },
  {
    id: "iso",
    name: "ISO 9001:2015",
    issuedBy: "International Organization for Standardization",
    description:
      "Committed to quality management standards across our platform, operations, and vendor network.",
    icon: <Award size={28} />,
    color: "rose",
    // imageSrc: "/certificates/iso-9001.jpg",
  },
  {
    id: "ssl",
    name: "SSL / TLS Secured",
    issuedBy: "Verified by DigiCert / Let's Encrypt",
    description:
      "All data transmitted on our platform is protected with industry-standard SSL/TLS encryption.",
    icon: <Lock size={28} />,
    color: "slate",
    // imageSrc: "/certificates/ssl-badge.png",
  },
];

const TRUST_STATS = [
  { label: "Registered Vendors", value: "500+", icon: <Globe size={20} /> },
  { label: "Product Categories", value: "50+", icon: <Star size={20} /> },
  { label: "Years Operating", value: "3+", icon: <Award size={20} /> },
  { label: "Quality Checks Passed", value: "10K+", icon: <CheckCircle2 size={20} /> },
];

const COLOR_MAP: Record<
  string,
  { bg: string; icon: string; border: string; badge: string }
> = {
  blue:    { bg: "bg-blue-50",    icon: "text-blue-600",    border: "border-blue-100",    badge: "bg-blue-100 text-blue-700" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
  amber:   { bg: "bg-amber-50",   icon: "text-amber-600",   border: "border-amber-100",   badge: "bg-amber-100 text-amber-700" },
  purple:  { bg: "bg-purple-50",  icon: "text-purple-600",  border: "border-purple-100",  badge: "bg-purple-100 text-purple-700" },
  rose:    { bg: "bg-rose-50",    icon: "text-rose-600",    border: "border-rose-100",    badge: "bg-rose-100 text-rose-700" },
  slate:   { bg: "bg-slate-50",   icon: "text-slate-600",   border: "border-slate-200",   badge: "bg-slate-100 text-slate-700" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT (Server Component — no "use client" needed)
───────────────────────────────────────────────────────────────────────────── */
export default function CertifiedPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">

      {/* ===================================================================
          HERO
      =================================================================== */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
            <ShieldCheck size={14} className="text-[#b48a08]" />
            Trust &amp; Compliance
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-extrabold text-[#12233F] sm:text-4xl lg:text-5xl">
            Aladdin Global B2B — Certified &amp; Trusted
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b48a08] sm:text-xl">
            Verified. Compliant. Built on trust.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Aladdin Global B2B is a fully licensed and certified multi-vendor
            e-commerce platform. Below you will find our official certifications,
            registrations, and compliance marks — all verified by recognised
            authorities in Bangladesh and internationally.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#1b345e] sm:text-sm"
            >
              <ArrowRight size={16} />
              Contact Us
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-sm"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          TRUST STATS BAR
      =================================================================== */}
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
              <p className="mt-3 text-2xl font-extrabold text-[#12233F]">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          CERTIFICATE CARDS GRID
      =================================================================== */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
              Our Certifications
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
              Official Certificates &amp; Registrations
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Every certificate listed here represents a verified commitment to quality,
              safety, legal compliance, and ethical business practices.
            </p>
          </div>

          {/* Certificate grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATES.map((cert) => {
              const colors = COLOR_MAP[cert.color] ?? COLOR_MAP.slate;
              return (
                <div
                  key={cert.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ─── Certificate Image Area ──────────────────────────────
                      Once you have real certificate images:
                      1. Place them in /public/certificates/
                      2. Add `import Image from "next/image"` at the top
                      3. Replace the placeholder <div> below with:

                      <Image
                        src={cert.imageSrc!}
                        alt={cert.name}
                        width={600}
                        height={420}
                        className="w-full object-contain"
                      />
                  ─────────────────────────────────────────────────────────── */}
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
                        Certificate Image Placeholder
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#12233F]">{cert.name}</h3>
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                    </div>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {cert.issuedBy}
                    </p>

                    <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600">
                      {cert.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 size={12} className="shrink-0" />
                      Verified &amp; Active
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image upload note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Certificate images will be displayed here once uploaded.{" "}
            <Link href="/contact" className="font-bold text-[#12233F] hover:text-[#b48a08]">
              Contact us
            </Link>{" "}
            to request copies of any original certificate document.
          </p>
        </div>
      </section>

      {/* ===================================================================
          WHY TRUST US
      =================================================================== */}
      <section className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
              Why Choose Us
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#12233F] sm:text-3xl">
              Our Commitment to Quality &amp; Safety
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ShieldCheck size={22} />,
                title: "Vendor Verification",
                body: "Every vendor on Aladdin Global B2B goes through a strict verification process before listing products on our platform.",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: <BadgeCheck size={22} />,
                title: "Product Quality Control",
                body: "Products listed are cross-checked against BSTI and Halal standards. Non-compliant listings are removed promptly.",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: <Lock size={22} />,
                title: "Secure Transactions",
                body: "All payments and personal data are encrypted with SSL/TLS. Your financial information is never stored on our servers.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: <FileCheck2 size={22} />,
                title: "Legal Compliance",
                body: "We operate with a valid Trade License and follow all applicable laws set by the Government of Bangladesh.",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: <Globe size={22} />,
                title: "Transparent Operations",
                body: "Business registration documents, VAT certificates, and compliance papers are available upon formal request.",
                color: "text-rose-600 bg-rose-50",
              },
              {
                icon: <Star size={22} />,
                title: "Buyer Protection",
                body: "Our dispute resolution system ensures buyers are protected in the event of order issues, fraud, or non-delivery.",
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
                  <h4 className="text-sm font-bold text-[#12233F]">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          BOTTOM CTA BANNER
      =================================================================== */}
      <section className="bg-[#12233F] py-12 text-center text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#D6A419] sm:text-2xl">
            Aladdin Global B2B — Certified &amp; Trusted
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
            Verified. Compliant. Built on trust.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            For certification inquiries or document requests:{" "}
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
              Get in Touch
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D6A419] px-6 py-2.5 text-xs font-bold text-[#12233F] transition hover:bg-amber-400 sm:text-sm"
            >
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
