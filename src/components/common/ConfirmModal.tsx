"use client";

import React from "react";
import { AlertTriangle, Trash2, Info, CheckCircle2, X, Loader2 } from "lucide-react";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "আপনি কি নিশ্চিত?",
  description = "এই কাজটি সম্পন্ন করলে আর ফিরিয়ে আনা যাবে না।",
  confirmText = "হ্যাঁ, ডিলিট করুন",
  cancelText = "বাতিল",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: <Trash2 size={26} className="text-red-500" />,
      bg: "bg-red-50 border-red-100",
      btn: "bg-red-600 hover:bg-red-700 text-white shadow-red-200",
    },
    warning: {
      icon: <AlertTriangle size={26} className="text-amber-500" />,
      bg: "bg-amber-50 border-amber-100",
      btn: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200",
    },
    info: {
      icon: <Info size={26} className="text-blue-500" />,
      bg: "bg-blue-50 border-blue-100",
      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
    },
    success: {
      icon: <CheckCircle2 size={26} className="text-emerald-500" />,
      bg: "bg-emerald-50 border-emerald-100",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    },
  };

  const current = iconConfig[variant] || iconConfig.danger;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Icon & Details */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${current.bg} shadow-inner`}
          >
            {current.icon}
          </div>

          <h3 className="text-lg font-bold text-[#12233F]">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${current.btn}`}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
