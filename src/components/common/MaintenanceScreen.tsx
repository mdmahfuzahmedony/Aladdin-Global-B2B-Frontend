"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, RefreshCw, Phone, Mail, ArrowRight, Store, Sparkles } from "lucide-react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function MaintenanceScreen() {
  const { settings, refreshSettings } = useSiteSettings();
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      await refreshSettings();
    } finally {
      setTimeout(() => setChecking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50/40 to-slate-200/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 text-center shadow-xl shadow-slate-300/40 animate-in fade-in zoom-in-95 duration-200">
        {/* 1. CUSTOM LOGO DISPLAY */}
        <div className="mb-5 flex items-center justify-center">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName || "Site Logo"}
              className="max-h-16 max-w-[220px] object-contain transition-all"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#12233F] text-[#D6A419] shadow-sm">
                <Store size={24} />
              </div>
              <div className="text-left">
                <span className="block text-xl font-extrabold leading-tight text-[#12233F]">
                  {settings.siteName?.split(" ")[0] || "Aladin"}
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[2px] text-[#D6A419]">
                  {settings.siteName?.split(" ").slice(1).join(" ") || "Global B2B"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. MAINTENANCE BADGE & ICON */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-inner">
          <Wrench size={28} className="animate-pulse" />
        </div>

        {/* 3. SHORT & SWEET MESSAGE */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 mb-2">
          <Sparkles size={13} className="text-amber-600" />
          <span>সাইট রক্ষণাবেক্ষণ চলছে</span>
        </span>

        <h1 className="text-xl font-extrabold text-[#12233F] sm:text-2xl mt-1">
          আমরা খুব শীঘ্রই ফিরে আসছি!
        </h1>

        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 max-w-sm mx-auto">
          আমাদের প্ল্যাটফর্মে উন্নয়ন ও আপগ্রেডেশনের কাজ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।
        </p>

        {/* 4. REFRESH STATUS BUTTON */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#1b3155] disabled:opacity-60 shadow-md shadow-[#12233F]/10"
          >
            <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
            <span>{checking ? "চেক করা হচ্ছে..." : "স্ট্যাটাস রিফ্রেশ করুন"}</span>
          </button>
        </div>

        {/* 5. SHORT HELPLINE (IF CONFIGURED) */}
        {(settings.contactNumber || settings.supportEmail) && (
          <div className="mt-5 border-t border-slate-100 pt-3.5 text-xs text-slate-500">
            <span className="text-[11px] text-slate-400 block mb-1">প্রয়োজনে যোগাযোগ:</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {settings.contactNumber && (
                <a
                  href={`tel:${settings.contactNumber}`}
                  className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-amber-600 transition"
                >
                  <Phone size={12} className="text-amber-500" />
                  <span>{settings.contactNumber}</span>
                </a>
              )}
              {settings.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-amber-600 transition"
                >
                  <Mail size={12} className="text-amber-500" />
                  <span>{settings.supportEmail}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 6. DISCREET ADMIN LINK */}
        <div className="mt-4 border-t border-slate-100 pt-2.5">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#12233F] transition"
          >
            <span>Admin Settings</span>
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
