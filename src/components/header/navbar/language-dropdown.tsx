"use client";

import React from "react";
import { Check } from "lucide-react";

interface Props {
  lang: string;
  setLang: (lang: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const LanguageDropdown: React.FC<Props> = ({
  lang,
  setLang,
  currency,
  setCurrency,
}) => {
  return (
    <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 space-y-3 z-50">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Language</p>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setLang("en")}
            className={`p-1.5 text-xs rounded border flex items-center justify-between ${
              lang === "en" ? "border-amber-500 bg-amber-50 font-bold text-amber-900" : "border-slate-200"
            }`}
          >
            English {lang === "en" && <Check className="w-3 h-3 text-amber-600" />}
          </button>
          <button
            onClick={() => setLang("bn")}
            className={`p-1.5 text-xs rounded border flex items-center justify-between ${
              lang === "bn" ? "border-amber-500 bg-amber-50 font-bold text-amber-900" : "border-slate-200"
            }`}
          >
            বাংলা {lang === "bn" && <Check className="w-3 h-3 text-amber-600" />}
          </button>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Currency</p>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setCurrency("BDT")}
            className={`p-1.5 text-xs rounded border flex items-center justify-between ${
              currency === "BDT" ? "border-amber-500 bg-amber-50 font-bold text-amber-900" : "border-slate-200"
            }`}
          >
            BDT (৳) {currency === "BDT" && <Check className="w-3 h-3 text-amber-600" />}
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`p-1.5 text-xs rounded border flex items-center justify-between ${
              currency === "USD" ? "border-amber-500 bg-amber-50 font-bold text-amber-900" : "border-slate-200"
            }`}
          >
            USD ($) {currency === "USD" && <Check className="w-3 h-3 text-amber-600" />}
          </button>
        </div>
      </div>
    </div>
  );
};