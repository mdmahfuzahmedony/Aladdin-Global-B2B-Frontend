"use client";


import { useEffect, useRef, useState } from "react";
import { Globe2, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("BDT (৳)");
  const { language, setLanguage, t } = useLanguage();

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-[100]">
      {/* LANGUAGE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex min-w-0 flex-col items-center justify-center rounded-xl px-2 py-2 !text-white transition hover:bg-white/10 sm:px-3"
        aria-label={t("languageAndCurrency")}
        aria-expanded={open}
      >
        <Globe2
          size={22}
          strokeWidth={1.8}
          className="!text-white transition-colors group-hover:!text-[#D6A419]"
        />

        {/* Desktop: language label */}
        <span className="mt-1 hidden whitespace-nowrap text-[11px] font-semibold !text-white transition-colors group-hover:!text-[#D6A419] xl:inline">
          {language === "en" ? "English" : "বাংলা"}
        </span>

        <ChevronDown
          size={12}
          className={`hidden !text-white transition-transform group-hover:!text-[#D6A419] xl:inline ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* LANGUAGE & CURRENCY MENU */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[260px] rounded-2xl border border-slate-200 bg-white p-4 text-[#12233F] shadow-2xl">
          {/* LANGUAGE */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {t("language")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage("en");
                  setOpen(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                  language === "en"
                    ? "border-[#D6A419] bg-slate-50 text-[#12233F]"
                    : "border-slate-200 bg-white text-[#12233F] hover:border-[#D6A419] hover:bg-slate-50"
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage("bn");
                  setOpen(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                  language === "bn"
                    ? "border-[#D6A419] bg-slate-50 text-[#12233F]"
                    : "border-slate-200 bg-white text-[#12233F] hover:border-[#D6A419] hover:bg-slate-50"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* CURRENCY */}
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {t("currency")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrency("BDT (৳)");
                  setOpen(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                  currency === "BDT (৳)"
                    ? "border-[#D6A419] bg-slate-50 text-[#12233F]"
                    : "border-slate-200 bg-white text-[#12233F] hover:border-[#D6A419] hover:bg-slate-50"
                }`}
              >
                BDT (৳)
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrency("USD ($)");
                  setOpen(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                  currency === "USD ($)"
                    ? "border-[#D6A419] bg-slate-50 text-[#12233F]"
                    : "border-slate-200 bg-white text-[#12233F] hover:border-[#D6A419] hover:bg-slate-50"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
