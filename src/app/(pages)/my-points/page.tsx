"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Coins,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Store,
  CheckCircle2,
  RefreshCw,
  Gift,
  ExternalLink,
  Tag,
} from "lucide-react";
import { createClient } from "../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface PointTransaction {
  id: string;
  vendorId?: string;
  storeName?: string;
  points: number;
  amount: number;
  createdAt: string;
  orderNumber: string;
  orderStatus: string;
}

interface StoreReward {
  vendorId: string;
  storeName: string;
  logoUrl: string | null;
  totalPurchased: number;
  points: number;
  pointsWorthTk: number;
  ordersCount: number;
}

interface RewardData {
  points: number;
  pointRate: number;
  pointValueInTk: number;
  pointsWorthTk: number;
  stores?: StoreReward[];
  transactions: PointTransaction[];
}

export default function MyPointsPage() {
  const [data, setData] = useState<RewardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        setError("অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/customer/rewards/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "পয়েন্ট লোড করা যায়নি");
      }

      setData(result.data);
    } catch (err) {
      console.error("Fetch points error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "পয়েন্ট লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPoints();
  }, [fetchPoints]);

  const points = data?.points ?? 0;
  const pointsWorth = data?.pointsWorthTk ?? points;
  const stores = data?.stores ?? [];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* BREADCRUMB */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">My Reward Points</span>
        </nav>

        {/* HERO POINT BALANCE BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12233F] via-[#1a335c] to-[#0f1d35] p-6 text-white shadow-xl sm:p-10">
          {/* Background decorative glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                <Sparkles size={14} className="text-amber-300" />
                Aladdin Club Rewards
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
                আমার রিওয়ার্ড পয়েন্ট
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                প্রতি{" "}
                <span className="font-bold text-amber-300">১০০ টাকার</span> পণ্য
                কেনাকাটায় পাবেন{" "}
                <span className="font-bold text-amber-300">১ পয়েন্ট</span>। আপনি
                যে সেলারের কাছ থেকে কিনবেন, পয়েন্ট সেই সেলারের অধীনেই জমা হবে
                এবং ওই সেলারের পণ্যেই ভাঙাতে পারবেন!
              </p>
            </div>

            {/* BALANCE CARD */}
            <div className="flex w-full flex-col items-start rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md sm:w-auto sm:min-w-[260px] sm:items-end">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
                <Coins size={16} />
                <span>সর্বমোট পয়েন্ট ব্যালেন্স</span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-400 sm:text-5xl">
                  {loading ? "..." : points}
                </span>
                <span className="text-sm font-bold text-amber-200">Points</span>
              </div>

              <div className="mt-2 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                ≈ ৳{pointsWorth} টাকার সমমূল্য
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D6A419] to-[#e6b429] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-105 active:scale-95"
            >
              <ShoppingBag size={14} />
              কেনাকাটা শুরু করুন
            </Link>

            <button
              onClick={() => void fetchPoints()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              রিফ্রেশ
            </button>
          </div>
        </div>

        {/* STORE-WISE POINTS SECTION */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                স্টোরভিত্তিক পয়েন্ট ব্যালেন্স
              </h2>
              <p className="text-xs text-slate-500">
                যে সেলারের কাছ থেকে পণ্য কিনেছেন, পয়েন্ট শুধুমাত্র ওই সেলারের
                পণ্যে ভাঙানো যাবে।
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              {stores.length}টি স্টোরে পয়েন্ট আছে
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              স্টোর পয়েন্ট লোড হচ্ছে...
            </div>
          ) : stores.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center">
              <Store size={32} className="mx-auto text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                এখনো কোনো স্টোরভিত্তিক পয়েন্ট নেই
              </p>
              <p className="mt-1 text-xs text-slate-400">
                যেকোনো সেলারের দোকান থেকে অর্ডার করলে এখানে স্বয়ংক্রিয়ভাবে ওই
                সেলারের পয়েন্ট যুক্ত হবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div
                  key={store.vendorId}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Store size={22} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {store.storeName}
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            অর্ডার সংখ্যা: {store.ordersCount}টি
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800">
                        {store.points} pts
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50/60 to-orange-50/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-amber-900">
                          ভাঙানোর মূল্য:
                        </span>
                        <span className="text-xs font-black text-amber-700">
                          ৳{store.pointsWorthTk} টাকা
                        </span>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1 text-[10.5px] text-slate-500">
                        <Tag size={11} className="text-amber-500" />
                        এই পয়েন্ট শুধু {store.storeName}-এর পণ্য অর্ডারে ব্যবহার
                        করা যাবে
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <Link
                      href={`/vendor/store/${store.vendorId}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      <span>এই স্টোরের পণ্য দেখুন</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HOW STORE POINTS WORK SECTION */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Store size={20} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              সেলারভিত্তিক পয়েন্ট জমা
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              আপনি যে সেলারের কাছ থেকে যত টাকার পণ্য কিনবেন, প্রতি ১০০ টাকার
              জন্য ওই নির্দিষ্ট সেলারের ঝুলিতেই ১ পয়েন্ট জমা হবে।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              ১ পয়েন্ট = ১ টাকা ডিসকাউন্ট
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              আপনার অর্জিত প্রতিটি পয়েন্টের মান ১ টাকা। যেমন: কোনো সেলারের ৫০
              পয়েন্ট থাকলে ওই সেলারের কেনাকাটায় ৫০ টাকা ছাড় পাবেন।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Gift size={20} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              ওই সেলারের পণ্যে ভাঙানোর নিয়ম
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              যেহেতু পয়েন্টটি ওই সেলার দিয়েছেন, তাই পয়েন্ট ভাঙিয়ে পণ্য কিনতে হলে
              আবার ওই সেলারের দোকান থেকেই পণ্য নিতে হবে।
            </p>
          </div>
        </div>

        {/* POINT TRANSACTION HISTORY */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  পয়েন্ট লেনদেন হিস্ট্রি
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  সেলার ও অর্ডারভিত্তিক অর্জিত পয়েন্টের বিস্তারিত বিবরণ
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                মোট ট্রানজ্যাকশন: {data?.transactions?.length ?? 0}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-6 text-center text-xs text-rose-600">{error}</div>
          )}

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <RefreshCw
                size={18}
                className="mx-auto mb-2 animate-spin text-amber-500"
              />
              পয়েন্ট তথ্য লোড হচ্ছে...
            </div>
          ) : !data?.transactions || data.transactions.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Coins size={26} />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-700">
                এখনো কোনো পয়েন্ট ট্রানজ্যাকশন নেই
              </h4>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                যেকোনো সেলারের দোকান থেকে অর্ডার করলে প্রতি ১০০ টাকার জন্য ১
                পয়েন্ট ওই সেলারের আন্ডারে যুক্ত হবে।
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#12233F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1b3560]"
              >
                পণ্য ব্রাউজ করুন
                <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5">তারিখ</th>
                    <th className="px-5 py-3.5">সেলার / স্টোর</th>
                    <th className="px-5 py-3.5">অর্ডার নাম্বার</th>
                    <th className="px-5 py-3.5 text-right">কেনাকাটার পরিমাণ</th>
                    <th className="px-5 py-3.5 text-right">অর্জিত পয়েন্ট</th>
                    <th className="px-5 py-3.5 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data.transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {new Date(tx.createdAt).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5">
                          <Store size={14} className="text-amber-600" />
                          {tx.storeName || "Vendor Store"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                        #{tx.orderNumber}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-slate-700">
                        ৳{tx.amount.toLocaleString("en-BD")}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                          +{tx.points} pts
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 size={11} />
                          যোগ হয়েছে
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
