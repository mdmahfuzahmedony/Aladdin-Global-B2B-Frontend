"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

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

// FAQ component: default export
import FAQSection from "@/components/section/home/faq-section";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20";

export default function ContactPage() {
  const { t } = useLanguage();
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
      {/* Contact Information */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
            {t("contactGetInTouch")}
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            {t("contactHeroTitle")}
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {t("contactHeroDescription")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ContactInfoCard
            icon={Phone}
            title={t("callUs")}
            description={t("contactHours")}
            value="01312-789354"
            href="tel:01312789354"
          />

          <ContactInfoCard
            icon={Mail}
            title={t("emailUs")}
            description={t("sendQuestions")}
            value="support@aladdinglobalb2b.com"
            href="mailto:support@aladdinglobalb2b.com"
          />

          <ContactInfoCard
            icon={MapPin}
            title={t("officeLocation")}
            description={t("jashoreBangladesh")}
            value="Jashore - 7400"
          />

          <ContactInfoCard
            icon={FileText}
            title={t("tradeLicense")}
            description={t("officialRegistration")}
            value={t("verifiedSecured")}
          />
        </div>
      </section>

      {/* Contact Form and Support Links */}
      <section
        id="contact-form"
        className="scroll-mt-24 bg-gray-50 py-16 lg:py-20"
      >
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D6A419]/15 text-[#12233F]">
                <Send size={22} />
              </span>

              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                {t("sendMessage")}
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {t("contactFormHelp")}
              </p>
            </div>

            {submitted && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                <p>
                  {t("messageSent")}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={t("fullName")} htmlFor="fullName" required>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={t("enterFullName")}
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label={t("emailAddress")} htmlFor="email" required>
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

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={t("phoneNumber")} htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01312-789354"
                    className={inputClass}
                  />
                </FormField>

                <FormField label={t("contactRole")} htmlFor="contactType" required>
                  <select
                    id="contactType"
                    name="contactType"
                    className={inputClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      {t("selectOption")}
                    </option>
                    <option value="customer">{t("customer")}</option>
                    <option value="vendor">{t("vendorSeller")}</option>
                    <option value="business">{t("businessPartner")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </FormField>
              </div>

              <FormField label={t("subject")} htmlFor="subject" required>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder={t("messageAbout")}
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label={t("yourMessage")} htmlFor="message" required>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t("writeMessage")}
                  className={`${inputClass} resize-y`}
                  required
                />
              </FormField>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-6 py-4 font-semibold text-white transition hover:bg-[#1c365c] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    {t("sendMessage")}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Support Information */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
                {t("howCanHelp")}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {t("rightSupport")}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {t("supportDescription")}
              </p>
            </div>

            <SupportLink
              icon={ShoppingBag}
              title={t("customerSupport")}
              description={t("customerSupportDescription")}
              href="/help"
            />

            <SupportLink
              icon={Store}
              title={t("vendorSupport")}
              description={t("vendorSupportDescription")}
              href="/vendor"
            />

            <SupportLink
              icon={Handshake}
              title={t("businessPartnerships")}
              description={t("businessPartnershipDescription")}
              href="mailto:support@aladdinglobalb2b.com"
            />

            <SupportLink
              icon={Package}
              title={t("ordersDelivery")}
              description={t("ordersDeliveryDescription")}
              href="/orders"
            />

            <div className="rounded-2xl bg-[#12233F] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D6A419] text-[#12233F]">
                  <Users size={22} />
                </div>

                <div>
                  <h3 className="font-bold">{t("onYourSide")}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {t("onYourSideDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Assistance */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-8 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-5">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D6A419]/15 text-[#12233F] sm:flex">
              <Building2 size={27} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
                {t("forBusinesses")}
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {t("growTogether")}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                {t("businessDescription")}
              </p>
            </div>
          </div>

          <Link
            href="/vendor"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6A419] px-6 py-3.5 font-semibold text-[#12233F] transition hover:bg-[#e7b92d]"
          >
            {t("becomeVendor")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Location */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48a08]">
              {t("findUs")}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {t("ourLocation")}
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {t("locationDescription")}
            </p>

            <div className="mt-7 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F]">
                <MapPin size={23} />
              </span>

              <div>
                <h3 className="font-bold">Gonata Road, Jashore - 7400</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{t("officeAddressDirections")}</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6A419]/15 text-[#12233F]">
                <Clock3 size={23} />
              </span>

              <div>
                <h3 className="font-bold">{t("businessHours")}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {t("officeHours")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 sm:min-h-[360px]">
            <div className="max-w-sm text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12233F] text-[#D6A419]">
                <MapPin size={30} />
              </span>

              <h3 className="mt-5 text-xl font-bold">
                Gonata Road, Jashore - 7400
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {t("directionsOfficeInfo")}
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Gonata+Road+Jashore"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:border-[#D6A419] hover:bg-gray-50"
              >
                {t("viewGoogleMaps")}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Database FAQ Component */}
      <div id="common-questions" className="scroll-mt-24">
        <FAQSection />
      </div>

      {/* Final CTA */}
      <section className="bg-[#12233F]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-7 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("stillQuestions")}
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              {t("happyToHelp")}
            </p>
          </div>

          <a
            href="#contact-form"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D6A419] px-6 py-4 font-semibold text-[#12233F] transition hover:bg-[#e7b92d]"
          >
            {t("getInTouch")}
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

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

      <h3 className="mt-5 font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

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
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

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