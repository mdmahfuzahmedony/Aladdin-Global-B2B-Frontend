"use client";

import React from "react";
import { QrCode } from "lucide-react";

export const AppDownloadDropdown = () => {
  return (
    <div className="absolute right-0 mt-3 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-4 space-y-3 z-50">
      <div className="text-center space-y-1">
        <h4 className="font-bold text-sm">Scan to Download</h4>
        <p className="text-[11px] text-slate-500">Available on Android & iOS</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex justify-center">
        <QrCode className="w-24 h-24 text-slate-800" />
      </div>
      <div className="grid grid-cols-2 gap-1 text-[10px] font-semibold text-center">
        <span className="p-1.5 bg-slate-100 rounded text-slate-700">Play Store</span>
        <span className="p-1.5 bg-slate-100 rounded text-slate-700">App Store</span>
      </div>
    </div>
  );
};