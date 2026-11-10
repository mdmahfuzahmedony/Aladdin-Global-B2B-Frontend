
"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useLanguage } from "@/context/LanguageContext";

export function FooterLegal() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server এবং Client-এর প্রথম Render-এ একই নাম থাকবে
  const siteName = mounted
    ? settings.siteName || "Aladdin Global B2B"
    : "Aladdin Global B2B";

  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-between gap-2.5 text-xs text-slate-500 sm:flex-row sm:text-sm">
      <p className="text-center sm:text-left">
        © {year}{" "}
        <strong className="text-[#12233F]">{siteName}</strong>
        .com — {t("allRightsReserved")}
      </p>

      <p className="flex items-center gap-1 text-center sm:text-right">
        <span>{t("developedBy")}</span>

        <a
          href="https://mahfuzahmedony.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#12233F] transition hover:text-[#f59e0b] hover:underline"
        >
          Mahfuz Ahmed
        </a>
      </p>
    </div>
  );
}
