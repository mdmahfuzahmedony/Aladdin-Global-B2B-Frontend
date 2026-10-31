"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Aladdin Global B2B Certified", href: "/certified" },
  { label: "Site Map", href: "/sitemap" },
 
];

export function FooterLinks() {
  const { t } = useLanguage();
  const labels = [
    t("aboutUs"),
    t("contactUs"),
    t("careers"),
    t("privacyPolicy"),
    t("certified"),
    t("siteMap"),
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        {t("aboutCompany")}
      </h3>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {companyLinks.map((link, index) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-slate-600 transition-colors duration-200 hover:text-[#12233F] hover:underline sm:text-sm"
            >
              {labels[index]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}