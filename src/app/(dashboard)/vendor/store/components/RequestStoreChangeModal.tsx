"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Send, Store, AlertCircle, ShieldAlert, Check } from "lucide-react";
import { createClient } from "../../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    storeName: string;
    ownerName?: string;
    phone: string;
    businessCategory: string;
    tradeLicenseNumber?: string;
    nidNumber?: string;
    taxIdentificationNumber?: string;
  };
  onSuccess: () => void;
}

export default function RequestStoreChangeModal({
  isOpen,
  onClose,
  currentData,
  onSuccess,
}: Props) {
  const [supabase] = useState(() => createClient());

  const [newStoreName, setNewStoreName] = useState(currentData.storeName || "");
  const [newOwnerName, setNewOwnerName] = useState(currentData.ownerName || "");
  const [newPhone, setNewPhone] = useState(currentData.phone || "");
  const [newCategory, setNewCategory] = useState(
    currentData.businessCategory || "",
  );
  const [newTradeLicense, setNewTradeLicense] = useState(
    currentData.tradeLicenseNumber || "",
  );
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedStoreName = newStoreName.trim();
    const trimmedOwnerName = newOwnerName.trim();
    const trimmedPhone = newPhone.trim();
    const trimmedCategory = newCategory.trim();
    const trimmedTradeLicense = newTradeLicense.trim();
    const trimmedReason = reason.trim();

    // Check if any field changed
    const hasChange =
      (trimmedStoreName && trimmedStoreName !== currentData.storeName) ||
      (trimmedOwnerName && trimmedOwnerName !== currentData.ownerName) ||
      (trimmedPhone && trimmedPhone !== currentData.phone) ||
      (trimmedCategory && trimmedCategory !== currentData.businessCategory) ||
      (trimmedTradeLicense &&
        trimmedTradeLicense !== (currentData.tradeLicenseNumber || ""));

    if (!hasChange) {
      toast.warning(
        "দয়া করে পরিবর্তন করার জন্য কমপক্ষে একটি নতুন তথ্য প্রদান করুন।",
      );
      return;
    }

    if (!trimmedReason) {
      toast.warning("দয়া করে তথ্য পরিবর্তনের কারণ (Reason) উল্লেখ করুন।");
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        toast.error("অনুগ্রহ করে পুনরায় লগইন করুন।");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/store/change-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            storeName:
              trimmedStoreName !== currentData.storeName
                ? trimmedStoreName
                : undefined,
            ownerName:
              trimmedOwnerName !== currentData.ownerName
                ? trimmedOwnerName
                : undefined,
            phone:
              trimmedPhone !== currentData.phone ? trimmedPhone : undefined,
            businessCategory:
              trimmedCategory !== currentData.businessCategory
                ? trimmedCategory
                : undefined,
            tradeLicenseNumber:
              trimmedTradeLicense !== currentData.tradeLicenseNumber
                ? trimmedTradeLicense
                : undefined,
            reason: trimmedReason,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || "অনুরোধ পাঠানো সম্ভব হয়নি।",
        );
      }

      toast.success(
        "তথ্য পরিবর্তনের অনুরোধ সফলভাবে অ্যাডমিনের কাছে পাঠানো হয়েছে!",
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Change request error:", err);
      toast.error(err.message || "অনুরোধ পাঠাতে ত্রুটি হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#12233f] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Store size={18} className="text-[#f59e0b]" />
            <div>
              <h3 className="text-sm font-bold text-white">
                স্টোরের তথ্য পরিবর্তনের আবেদন
              </h3>
              <p className="text-[11px] text-slate-300">
                অ্যাডমিনের অনুমোদনের জন্য তথ্য জমা দিন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Important Notice Banner */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11.5px]">
              <span className="font-bold">সতর্কবার্তা:</span> রেজিস্ট্রেশনকালীন
              মূল তথ্যসমূহ (যেমন: স্টোরের নাম, ফোন, মালিকের নাম ইত্যাদি)
              পরিবর্তনের জন্য অ্যাডমিনের অনুমোদন প্রয়োজন। আপনি সাবমিট করলে
              অ্যাডমিনের কাছে একটি নোটিফিকেশন পৌঁছাবে।
            </div>
          </div>

          {/* New Store Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              দোকানের নাম (Store Name):
            </label>
            <input
              type="text"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              placeholder="নতুন স্টোর নাম লিখুন"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
            />
            {newStoreName !== currentData.storeName && (
              <p className="mt-1 text-[10.5px] text-emerald-600 font-medium">
                পূর্বের নাম: {currentData.storeName}
              </p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মালিকের নাম (Owner Name):
            </label>
            <input
              type="text"
              value={newOwnerName}
              onChange={(e) => setNewOwnerName(e.target.value)}
              placeholder="মালিকের পূর্ণ নাম লিখুন"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              স্টোর ফোন নম্বর (Store Phone):
            </label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="যেমন: 01700000000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
            />
          </div>

          {/* Business Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ব্যবসার ধরন (Business Category):
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="যেমন: Stationery, Electronics, Clothing..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পরিবর্তনের কারণ (Reason for Change){" "}
              <span className="text-red-500">*</span>:
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="কেন আপনি স্টোরের তথ্য পরিবর্তন করতে চাচ্ছেন তা সংক্ষেপে লিখুন..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#12233f] focus:ring-1 focus:ring-[#12233f]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#12233f] hover:bg-[#1b3155] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              <Send size={13} />
              <span>{submitting ? "পাঠানো হচ্ছে..." : "অনুরোধ পাঠান"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
