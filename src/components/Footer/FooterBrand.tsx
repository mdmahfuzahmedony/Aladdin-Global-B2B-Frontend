
"use client";

import { useEffect, useState } from "react";
import { FooterSocial } from "./FooterSocial";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useLanguage } from "@/context/LanguageContext";

export function FooterBrand() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server এবং প্রথম Client Render-এ একই ডিফল্ট তথ্য থাকবে
  const siteName = mounted
    ? settings.siteName || "Aladdin Global B2B"
    : "Aladdin Global B2B";

  const logoUrl = mounted ? settings.logoUrl : null;
  const contactNumber = mounted
    ? settings.contactNumber || "01322-130929"
    : "01322-130929";

  const supportEmail = mounted
    ? settings.supportEmail || "support@aladdinglobalb2b.com"
    : "support@aladdinglobalb2b.com";

  const address = mounted
    ? settings.address ||
      "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400"
    : "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400";

  return (
    <div className="max-w-md">
      <div className="mb-3 flex items-center gap-2.5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={siteName || "Logo"}
            className="h-10 w-auto max-w-[160px] rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-sm">
            🏢
          </div>
        )}

        <h2 className="text-lg font-bold text-[#12233F]">
          {siteName}
        </h2>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
        {siteName} connects verified wholesale buyers and sellers across
        Bangladesh with genuine products and reliable delivery.
      </p>

      <div className="space-y-2 text-xs text-slate-600 sm:text-sm">
        <p>
          📞 <strong className="text-[#12233F]">{t("callUsHours")}</strong>{" "}
          <a
            href={`tel:${contactNumber}`}
            className="transition hover:text-amber-600"
          >
            {contactNumber}
          </a>
        </p>

        <p>
          ✉️ <strong className="text-[#12233F]">{t("email")}</strong>{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="transition hover:text-amber-600"
          >
            {supportEmail}
          </a>
        </p>

        <p>
          📍 <strong className="text-[#12233F]">{t("address")}</strong>{" "}
          <span>{address}</span>
        </p>
      </div>

      <div className="mt-4">
        <FooterSocial />
      </div>
    </div>
  );
}
