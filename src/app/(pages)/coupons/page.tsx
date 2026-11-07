
"use client";

import { useMemo, useState } from "react";
import {
  TicketPercent,
  Copy,
  Check,
  Search,
  Clock3,
  ShoppingBag,
  Tag,
  Sparkles,
  CalendarDays,
  ArrowRight,
  Gift,
} from "lucide-react";

type CouponStatus = "AVAILABLE" | "USED" | "EXPIRED";

type Coupon = {
  id: number;
  code: string;
  title: string;
  description: string;
  discount: string;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: string;
  status: CouponStatus;
  color: string;
};

const coupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME20",
    title: "Welcome Offer",
    description: "Get 20% discount on your first order.",
    discount: "20% OFF",
    minimumOrder: 1000,
    maximumDiscount: 500,
    expiryDate: "2026-12-30",
    status: "AVAILABLE",
    color: "amber",
  },
  {
    id: 2,
    code: "ALADDIN150",
    title: "Special Shopping Offer",
    description: "Enjoy a special discount on your purchase.",
    discount: "৳150 OFF",
    minimumOrder: 1500,
    expiryDate: "2026-12-20",
    status: "AVAILABLE",
    color: "blue",
  },
  {
    id: 3,
    code: "SAVE10",
    title: "Extra Savings",
    description: "Save 10% on eligible products.",
    discount: "10% OFF",
    minimumOrder: 2000,
    maximumDiscount: 300,
    expiryDate: "2026-12-15",
    status: "AVAILABLE",
    color: "green",
  },
  {
    id: 4,
    code: "SHOP500",
    title: "Shopping Discount",
    description: "Discount applied to a previous order.",
    discount: "৳500 OFF",
    minimumOrder: 3000,
    expiryDate: "2026-10-20",
    status: "USED",
    color: "purple",
  },
  {
    id: 5,
    code: "FLASH25",
    title: "Flash Sale Coupon",
    description: "Limited-time shopping discount.",
    discount: "25% OFF",
    minimumOrder: 2500,
    maximumDiscount: 600,
    expiryDate: "2026-10-10",
    status: "EXPIRED",
    color: "rose",
  },
];

const tabs = [
  { label: "All Coupons", value: "ALL" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Used", value: "USED" },
  { label: "Expired", value: "EXPIRED" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CouponCard({
  coupon,
  onCopy,
  copied,
}: {
  coupon: Coupon;
  onCopy: (code: string) => void;
  copied: boolean;
}) {
  const available = coupon.status === "AVAILABLE";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex min-h-[175px]">
        {/* Discount Side */}
        <div
          className={`relative flex w-[115px] shrink-0 flex-col items-center justify-center overflow-hidden border-r-2 border-dashed border-white/70 px-2 text-center sm:w-[145px] ${
            coupon.color === "amber"
              ? "bg-amber-100 text-amber-800"
              : coupon.color === "blue"
                ? "bg-blue-100 text-blue-800"
                : coupon.color === "green"
                  ? "bg-green-100 text-green-800"
                  : coupon.color === "purple"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-rose-100 text-rose-800"
          }`}
        >
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />

          <TicketPercent size={27} className="mb-3" />

          <p className="text-xl font-extrabold sm:text-2xl">
            {coupon.discount}
          </p>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider">
            Coupon
          </p>
        </div>

        {/* Coupon Details */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#12233F] sm:text-lg">
                {coupon.title}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  available
                    ? "bg-green-50 text-green-700"
                    : coupon.status === "USED"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-rose-50 text-rose-700"
                }`}
              >
                {coupon.status}
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              {coupon.description}
            </p>

            <div className="mt-3 space-y-1.5">
              <p className="flex items-center gap-2 text-xs text-slate-600">
                <ShoppingBag size={14} className="text-[#D6A419]" />
                Min. Order: ৳{coupon.minimumOrder.toLocaleString("en-BD")}
              </p>

              {coupon.maximumDiscount && (
                <p className="flex items-center gap-2 text-xs text-slate-600">
                  <Tag size={14} className="text-[#D6A419]" />
                  Maximum Discount: ৳
                  {coupon.maximumDiscount.toLocaleString("en-BD")}
                </p>
              )}

              <p className="flex items-center gap-2 text-xs text-slate-600">
                <CalendarDays size={14} className="text-[#D6A419]" />
                Expires: {formatDate(coupon.expiryDate)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-extrabold tracking-wider text-[#12233F]">
                {coupon.code}
              </span>
            </div>

            {available ? (
              <button
                type="button"
                onClick={() => onCopy(coupon.code)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#12233F] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#1d3a60]"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                {coupon.status === "USED" ? "Already Used" : "Expired"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyCouponsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const counts = {
    ALL: coupons.length,
    AVAILABLE: coupons.filter((c) => c.status === "AVAILABLE").length,
    USED: coupons.filter((c) => c.status === "USED").length,
    EXPIRED: coupons.filter((c) => c.status === "EXPIRED").length,
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesTab =
        activeTab === "ALL" || coupon.status === activeTab;

      const matchesSearch =
        coupon.code.toLowerCase().includes(search.toLowerCase()) ||
        coupon.title.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch {
      setCopiedCode("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#D6A419]">
              <Gift size={17} />
              Customer Rewards
            </div>

            <h1 className="text-2xl font-extrabold text-[#12233F] sm:text-3xl">
              My Coupons
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your coupons and enjoy exclusive shopping discounts.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6A419] text-[#12233F]">
              <TicketPercent size={21} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Available Coupons</p>
              <p className="text-xl font-extrabold text-[#12233F]">
                {counts.AVAILABLE}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              title: "Total Coupons",
              count: counts.ALL,
              icon: TicketPercent,
              color: "bg-amber-50 text-amber-600",
            },
            {
              title: "Available",
              count: counts.AVAILABLE,
              icon: Gift,
              color: "bg-green-50 text-green-600",
            },
            {
              title: "Used",
              count: counts.USED,
              icon: Check,
              color: "bg-blue-50 text-blue-600",
            },
            {
              title: "Expired",
              count: counts.EXPIRED,
              icon: Clock3,
              color: "bg-rose-50 text-rose-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={20} />
                </div>

                <p className="text-xs text-slate-500 sm:text-sm">
                  {item.title}
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#12233F]">
                  {item.count}
                </p>
              </div>
            );
          })}
        </div>

        {/* Coupon Section */}
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#12233F]">
                Your Coupons
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                View and manage all your discount coupons.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coupon code..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#D6A419] focus:bg-white"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                  activeTab === tab.value
                    ? "bg-[#12233F] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    activeTab === tab.value
                      ? "bg-white/15 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {counts[tab.value as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>

          {/* Coupon Cards */}
          {filteredCoupons.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onCopy={handleCopy}
                  copied={copiedCode === coupon.code}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#D6A419]">
                <TicketPercent size={30} />
              </div>

              <h3 className="text-lg font-bold text-[#12233F]">
                No Coupons Found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                No coupons match your search. Try another coupon code or
                select a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveTab("ALL");
                }}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#D6A419] hover:underline"
              >
                View All Coupons
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* Bottom Note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <Sparkles
            size={20}
            className="mt-0.5 shrink-0 text-[#D6A419]"
          />
          <div>
            <h3 className="text-sm font-bold text-[#12233F]">
              Enjoy More Savings!
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Check your available coupons before placing an order to
              enjoy exclusive discounts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
