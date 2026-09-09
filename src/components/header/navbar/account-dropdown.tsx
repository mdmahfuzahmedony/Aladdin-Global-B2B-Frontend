"use client";

import React from "react";
import Link from "next/link";
import { Package, Heart, ShieldCheck, Settings, LogIn, UserPlus } from "lucide-react";

interface Props {
  onClose: () => void;
}

export const AccountDropdown: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-2 space-y-1 z-50">
      <div className="p-2 border-b border-slate-100">
        <p className="font-bold text-xs">Welcome to Aladdin</p>
        <p className="text-[10px] text-slate-400">Access your B2B Panel</p>
      </div>

      <Link
        href="/my-orders"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <Package className="w-4 h-4 text-blue-600" /> My Orders
      </Link>

      <Link
        href="/wishlist"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <Heart className="w-4 h-4 text-rose-500" /> Wishlist
      </Link>

      <Link
        href="/rfq"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <ShieldCheck className="w-4 h-4 text-amber-500" /> Bulk Quotes (RFQ)
      </Link>

      <Link
        href="/settings"
        onClick={onClose}
        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-slate-100 font-medium text-slate-700 transition-colors"
      >
        <Settings className="w-4 h-4 text-slate-500" /> Account Settings
      </Link>

      {/* Auth Action Buttons */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
        <Link
          href="/sign-in"
          onClick={onClose}
          className="flex items-center justify-center gap-1 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-600 transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" /> Sign In
        </Link>
        <Link
          href="/sign-up"
          onClick={onClose}
          className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 text-slate-800 font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" /> Register
        </Link>
      </div>
    </div>
  );
};