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

const LAST_UPDATED = "October 2026";
const CONTACT_EMAIL = "support@aladdinglobalb2b.com";
const CONTACT_PHONE = "01312-789354";

/* ─── Table of Contents ──────────────────────────────────────────────────── */
const TOC = [
  { id: "privacy",   icon: <ShieldCheck size={16} />, label: "Privacy Policy" },
  { id: "shipping",  icon: <Truck size={16} />,       label: "Shipping & Delivery" },
  { id: "refund",    icon: <RotateCcw size={16} />,   label: "Return & Refund" },
  { id: "terms",     icon: <FileText size={16} />,    label: "Terms & Conditions" },
  { id: "cookies",   icon: <Cookie size={16} />,      label: "Cookie Policy" },
  { id: "legal",     icon: <Scale size={16} />,       label: "Legal & Compliance" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#12233F]">

      {/* ===================================================================
          HERO
      =================================================================== */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
            <ShieldCheck size={14} className="text-[#b48a08]" />
            Legal &amp; Privacy
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-[#12233F] sm:text-4xl lg:text-5xl">
            Privacy Policy &amp; Guidelines
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b48a08] sm:text-xl">
            Aladdin Global B2B — Transparent &amp; Trustworthy
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            These policies govern your use of the Aladdin Global B2B platform. By
            accessing our services, you agree to the terms outlined below. Last
            updated: <strong>{LAST_UPDATED}</strong>.
          </p>
        </div>
      </section>

      {/* ===================================================================
          LAYOUT: TOC sidebar + Content
      =================================================================== */}
      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* ── Sticky Table of Contents ─────────────────────────────────── */}
          <aside className="lg:sticky lg:top-6 lg:w-72 shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                On This Page
              </p>
              <ul className="space-y-1">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-amber-50 hover:text-[#12233F]"
                    >
                      <span className="text-[#b48a08]">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Quick Contact */}
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Need Help?
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#12233F] hover:text-[#b48a08]"
                >
                  <Mail size={12} />
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

          {/* ── Main Policy Content ───────────────────────────────────────── */}
          <div className="flex-1 space-y-6">

            {/* ── 1. PRIVACY POLICY ─────────────────────────────────────── */}
            <PolicySection
              id="privacy"
              icon={<ShieldCheck size={22} />}
              number="01"
              title="Privacy Policy"
              subtitle="How we collect, use, and protect your personal information"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                Aladdin Global B2B is a multi-vendor e-commerce platform connecting buyers,
                sellers, and businesses across Bangladesh. We are committed to protecting
                your personal information and being transparent about the data we collect.
              </p>

              <SubHeading icon={<Database size={15} />} text="Information We Collect" />
              <ul className="space-y-2">
                {[
                  { bold: "Personal Details:", text: "Full name, email address, mobile number, and billing/delivery address — collected during account registration, checkout, or when contacting support." },
                  { bold: "Business & Payment Info:", text: "National ID (NID), Trade License, and bank or mobile financial account details (bKash, Nagad) — required for vendor onboarding." },
                  { bold: "Automatically Collected Data:", text: "Browser cookies, log data, IP addresses, and usage patterns via our analytics tools to improve platform performance." },
                ].map((item) => (
                  <li key={item.bold} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span><strong className="text-[#12233F]">{item.bold}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>

              <SubHeading icon={<Lock size={15} />} text="How We Use Your Data" />
              <p className="text-sm leading-relaxed text-slate-600">
                Your information is used to process orders, facilitate vendor transactions,
                provide customer support, personalise your experience, and maintain platform
                security. We do <strong>not</strong> sell your data to third parties.
              </p>

              <SubHeading icon={<Eye size={15} />} text="Data Security" />
              <p className="text-sm leading-relaxed text-slate-600">
                All data transmitted through our platform is encrypted using SSL/TLS. We
                maintain strict access controls and follow industry best practices to prevent
                unauthorised access, disclosure, or misuse of your personal information.
              </p>
            </PolicySection>

            {/* ── 2. SHIPPING & DELIVERY ────────────────────────────────── */}
            <PolicySection
              id="shipping"
              icon={<Truck size={22} />}
              number="02"
              title="Shipping & Delivery Policy"
              subtitle="Delivery timelines, shipping charges, and multi-vendor orders"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                Aladdin Global B2B is committed to ensuring fast and reliable product
                delivery across Bangladesh through our network of trusted logistics partners.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[{ label: "Express Delivery", value: "Same Day (Selected Areas)", icon: "⚡" },
                  { label: "Inside Dhaka", value: "1 – 3 Working Days", icon: "🏙️" },
                  { label: "Outside Dhaka", value: "3 – 7 Working Days", icon: "🗺️" },
                
                  
                ].map((d) => (
                  <div key={d.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-lg">{d.icon}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{d.label}</p>
                    <p className="text-sm font-bold text-[#12233F]">{d.value}</p>
                  </div>
                ))}
              </div>

              <SubHeading icon={<AlertTriangle size={15} />} text="Important Notes" />
              <ul className="space-y-2">
                {[
                  "Shipping charges vary by vendor, product weight, and delivery location. The final shipping fee is displayed at checkout.",
                  "Orders containing products from multiple vendors may be shipped separately and may incur individual shipping charges.",
                  "Track your order status in real time via your account dashboard under 'My Orders'.",
                  "Delivery times may vary during public holidays, national events, or adverse weather conditions.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* ── 3. RETURN & REFUND ────────────────────────────────────── */}
            <PolicySection
              id="refund"
              icon={<RotateCcw size={22} />}
              number="03"
              title="Return & Refund Policy"
              subtitle="Eligibility, process, and timelines for returns and refunds"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                If you receive a defective, damaged, or incorrect product, you may request a
                return or replacement within the eligible return window.
              </p>

              <SubHeading icon={<CheckCircle2 size={15} />} text="Return Eligibility" />
              <ul className="space-y-2">
                {[
                  "Return or replacement request must be submitted within 24 to 72 hours of receiving the product.",
                  "Products must be unused, in original packaging, with all tags and accessories intact.",
                  "Proof of damage or defect (photo/video) must be submitted via your account or customer support.",
                  "Perishable goods, customised items, and digital products are generally non-returnable.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <SubHeading icon={<Database size={15} />} text="Refund Process" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { step: "01", label: "Submit Request", desc: "File a return/refund request via your account within the eligible window." },
                  { step: "02", label: "Review & Approval", desc: "Our team reviews your request within 2 – 5 working days." },
                  { step: "03", label: "Refund Processed", desc: "Approved refunds are credited within 5 – 10 working days via original payment method." },
                ].map((s) => (
                  <div key={s.step} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-2xl font-extrabold text-amber-300">{s.step}</span>
                    <p className="mt-1 text-xs font-bold text-[#12233F]">{s.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            {/* ── 4. TERMS & CONDITIONS ─────────────────────────────────── */}
            <PolicySection
              id="terms"
              icon={<FileText size={22} />}
              number="04"
              title="Terms & Conditions"
              subtitle="Rules governing the use of the Aladdin Global B2B platform"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                By accessing or using Aladdin Global B2B, you agree to be bound by these
                Terms and Conditions. If you do not agree, please discontinue use of our
                platform.
              </p>

              {[
                {
                  title: "1. Acceptance of Terms",
                  body: "Use of the platform implies full acceptance of these terms. We reserve the right to update these terms at any time; continued use constitutes acceptance of any revised terms.",
                },
                {
                  title: "2. Vendor Account Registration",
                  body: "Vendors must provide accurate legal information including National ID (NID), valid Trade License, and Tax Identification Number (TIN). Providing false information will result in immediate account suspension and forfeiture of pending payouts.",
                },
                {
                  title: "3. Commission & Payouts",
                  body: "Aladdin charges a pre-defined commission rate on successful transactions. Payouts are processed via bank transfer, bKash, or Nagad as per the vendor's payout settings, following admin verification.",
                },
                {
                  title: "4. Prohibited Activities",
                  body: "Users and vendors are strictly prohibited from listing counterfeit products, engaging in fraudulent transactions, price manipulation, or attempting to breach platform security.",
                },
                {
                  title: "5. Account Suspension",
                  body: "The platform authority reserves the right to suspend or permanently remove any account found in violation of these terms, with or without prior notice.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-[#12233F]">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </PolicySection>

            {/* ── 5. COOKIE POLICY ──────────────────────────────────────── */}
            <PolicySection
              id="cookies"
              icon={<Cookie size={22} />}
              number="05"
              title="Cookie Policy"
              subtitle="How we use cookies and similar tracking technologies"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                Aladdin Global B2B uses cookies and similar technologies to improve your
                browsing experience, analyse site traffic, and personalise content.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { name: "Essential Cookies", desc: "Required for the platform to function. Includes session management, authentication, and security tokens.", required: true },
                  { name: "Analytics Cookies", desc: "Help us understand how visitors interact with our platform so we can improve performance and usability.", required: false },
                  { name: "Preference Cookies", desc: "Remember your settings and preferences such as language, region, and saved cart items.", required: false },
                  { name: "Marketing Cookies", desc: "Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns.", required: false },
                ].map((c) => (
                  <div key={c.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#12233F]">{c.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.required ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {c.required ? "Required" : "Optional"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                You can manage or disable non-essential cookies through your browser settings.
                Note that disabling cookies may affect the functionality of some platform
                features.
              </p>
            </PolicySection>

            {/* ── 6. LEGAL & COMPLIANCE ─────────────────────────────────── */}
            <PolicySection
              id="legal"
              icon={<Scale size={22} />}
              number="06"
              title="Legal & Compliance"
              subtitle="Our legal obligations and your rights as a user"
            >
              <p className="text-sm leading-relaxed text-slate-600">
                Aladdin Global B2B operates in full compliance with the laws and regulations
                of the Government of Bangladesh, including e-commerce, consumer protection,
                and data privacy guidelines.
              </p>

              <ul className="space-y-2">
                {[
                  "We are a fully Trade Licensed, VAT Registered business entity operating from Jashore, Bangladesh.",
                  "All disputes arising from the use of our platform shall be governed by the laws of Bangladesh.",
                  "Users have the right to request access to, correction of, or deletion of their personal data by contacting our support team.",
                  "We comply with Bangladesh Bank guidelines for digital payment processing.",
                  "In the event of a data breach, affected users will be notified as required by applicable law.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <UserCheck size={18} className="shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-800">
                  <strong>Your Rights:</strong> You may request access to, correction of, or
                  deletion of your personal data at any time by emailing{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </PolicySection>

            {/* ── CONTACT SUPPORT BOX ───────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b48a08]">
                    Questions or Concerns?
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#12233F]">
                    Contact Our Support Team
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    For any questions about these policies, data requests, or order support.
                  </p>
                  <div className="mt-3 space-y-1">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-xs font-semibold text-[#12233F] hover:text-[#b48a08]">
                      <Mail size={13} /> {CONTACT_EMAIL}
                    </a>
                    <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2 text-xs font-semibold text-[#12233F] hover:text-[#b48a08]">
                      <Phone size={13} /> {CONTACT_PHONE}
                    </a>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b345e]"
                >
                  Go to Contact Page <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          BOTTOM CTA BANNER
      =================================================================== */}
      <section className="bg-[#12233F] py-10 text-center text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#D6A419] sm:text-2xl">
            Aladdin Global B2B
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            © {new Date().getFullYear()} Aladdin Global B2B. All rights reserved.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span>·</span>
            <Link href="/certified" className="hover:text-white">Certified &amp; Trusted</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </section>

    </main>
  );
}

/* ─── Reusable Section Wrapper ──────────────────────────────────────────── */
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
      {/* Section header */}
      <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#b48a08]">
          {icon}
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Section {number}
          </span>
          <h2 className="text-xl font-bold text-[#12233F]">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ─── Sub-heading helper ─────────────────────────────────────────────────── */
function SubHeading({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-[#b48a08]">{icon}</span>
      <h3 className="text-sm font-bold text-[#12233F]">{text}</h3>
    </div>
  );
}
