"use client";

import { FooterSocial } from "./FooterSocial";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export function FooterBrand() {
  const { settings } = useSiteSettings();

  return (
    <div className="max-w-md">
      <div className="mb-3 flex items-center gap-2.5">
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.siteName || "Logo"}
            className="h-10 w-auto max-w-[160px] object-contain rounded-lg"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-sm">
            🏢
          </div>
        )}

        <h2 className="text-lg font-bold text-[#12233F]">
          {settings.siteName || "Aladdin Global B2B"}
        </h2>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
        {settings.siteName || "Aladdin Global B2B"} connects verified wholesale buyers and sellers across
        Bangladesh with genuine products and reliable delivery.
      </p>

      <div className="space-y-2 text-xs text-slate-600 sm:text-sm">
        <p>
          📞 <strong className="text-[#12233F]">Call us (10AM–9PM):</strong>{" "}
          <a
            href={`tel:${settings.contactNumber || "01322-130929"}`}
            className="hover:text-amber-600 transition"
          >
            {settings.contactNumber || "01322-130929"}
          </a>
        </p>

        <p>
          ✉️ <strong className="text-[#12233F]">Email:</strong>{" "}
          <a
            href={`mailto:${settings.supportEmail || "support@aladdinglobalb2b.com"}`}
            className="hover:text-amber-600 transition"
          >
            {settings.supportEmail || "support@aladdinglobalb2b.com"}
          </a>
        </p>

        <p>
          📍 <strong className="text-[#12233F]">Address:</strong>{" "}
          <span>
            {settings.address ||
              "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400"}
          </span>
        </p>
      </div>

      <div className="mt-4">
        <FooterSocial />
      </div>
    </div>
  );
}