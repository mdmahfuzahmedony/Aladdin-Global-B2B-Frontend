"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Store, Building2, ShieldAlert, FileText, PhoneCall } from "lucide-react";

interface Props {
  onClose: () => void;
}

export const MoreDropdown: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-2 space-y-1 z-50">
      <Link
        href="/become-seller"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <Store className="w-4 h-4 text-amber-500" /> Become a Seller
      </Link>
      <Link
        href="/wholesaler-hub"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <Building2 className="w-4 h-4 text-blue-600" /> Wholesaler Hub
      </Link>
      <Link
        href="/buyer-protection"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <ShieldAlert className="w-4 h-4 text-emerald-600" /> Trade Assurance
      </Link>
      <Link
        href="/help-center"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-purple-600" /> Help Center
      </Link>
      <div className="pt-1 border-t border-slate-100">
        <Link
          href="/contact-us"
          onClick={onClose}
          className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-slate-500" /> Contact Support
        </Link>
      </div>
    </div>
  );
};