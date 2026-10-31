"use client";

import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useLanguage } from "@/context/LanguageContext";

export function FooterLegal() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm text-slate-500">
      <p className="text-center sm:text-left">
        © {year} <strong className="text-[#12233F]">{settings.siteName || "Aladdin Global B2B"}</strong>.com — {t("allRightsReserved")}
      </p>

      <p className="flex items-center gap-1 text-center sm:text-right">
        <span>{t("developedBy")}</span>
        <a
          href="https://mahfuzahmedony.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#12233F] hover:text-[#f59e0b] hover:underline transition"
        >
          Mahfuz Ahmed
        </a>
      </p>
    </div>
  );
}