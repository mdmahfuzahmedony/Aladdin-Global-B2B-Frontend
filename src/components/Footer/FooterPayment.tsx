
"use client";

import { Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function FooterPayment() {
  const { t } = useLanguage();

  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#12233F]">
        {t("paymentOptions")}
      </h4>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Truck size={22} className="text-[#12233F]" />

          <div>
            <p className="text-xs font-bold text-black">
              {t("cod")}
            </p>
            <p className="text-[10px] text-slate-500">
              {t("payOnReceive")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
