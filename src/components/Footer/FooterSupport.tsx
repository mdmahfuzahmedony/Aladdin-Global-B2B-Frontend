"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function FooterSupport() {
  const { t } = useLanguage();

  const supportLinks = [
    { label: t("helpCenter"), href: "/help-center" },
    { label: t("howToShop"), href: "/how-to-shop" },
    { label: t("paymentMethods"), href: "/payment-methods" },
    { label: t("refundPolicy"), href: "/refund-policy" },
    { label: t("termsAndConditions"), href: "/terms-and-conditions" },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        {t("customerService")}
      </h3>

      <ul className="space-y-2">
        {supportLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-slate-600 transition-colors duration-200 hover:text-[#12233F] hover:underline sm:text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}