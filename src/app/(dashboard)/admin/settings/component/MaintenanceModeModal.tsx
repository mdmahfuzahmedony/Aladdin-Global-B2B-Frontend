"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type SettingsResponse = {
  success?: boolean;
  data?: {
    maintenance?: boolean;
  };
};

export default function MaintenanceModeModal() {
  const [maintenance, setMaintenance] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkMaintenance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const result: SettingsResponse = await response.json();

        if (!mounted) return;

        setMaintenance(
          result.success === true && result.data?.maintenance === true,
        );
      } catch (error) {
        console.error("Maintenance check failed:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkMaintenance();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !maintenance) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#12233F] px-6 py-7 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#f59e0b]/15 flex items-center justify-center">
            <ShieldAlert size={34} className="text-[#f59e0b]" />
          </div>

          <h1 className="text-xl font-black text-white">Website Maintenance</h1>

          <p className="text-sm text-slate-300 mt-2">Aladdin B2B</p>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-7 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            আমরা বর্তমানে কিছু গুরুত্বপূর্ণ কাজ করছি
          </h2>

          <p className="text-sm text-slate-500 leading-6 mt-3">
            আমাদের ওয়েবসাইটে কিছু গুরুত্বপূর্ণ maintenance এবং security কাজ
            চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।
          </p>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
              <RefreshCw size={15} className="animate-spin text-[#f59e0b]" />

              <span>অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-5">
            আমাদের টিম যত দ্রুত সম্ভব সাইটটি আবার চালু করবে।
          </p>
        </div>
      </div>
    </div>
  );
}
