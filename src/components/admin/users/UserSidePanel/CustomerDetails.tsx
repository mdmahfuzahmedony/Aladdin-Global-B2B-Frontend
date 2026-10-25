"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  ShieldCheck,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Award,
  MapPin,
  Store,
  ExternalLink,
  Clock,
  Package,
} from "lucide-react";

export type CustomerDetailsUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joined: string;
  customer?: {
    fullName?: string | null;
    phone?: string | null;
    address?: string | null;
    area?: string | null;
    district?: string | null;
    division?: string | null;
    upazila?: string | null;
  } | null;
  customerReward?: {
    points?: number;
  } | null;
  cart?: {
    items?: Array<{
      id: string;
      quantity: number;
      product?: {
        id: string;
        title: string;
        images?: string[];
        pricing?: Array<{ salePrice?: number; basePrice?: number }>;
      } | null;
    }>;
  } | null;
  wishlist?: {
    items?: Array<{
      id: string;
      product?: {
        id: string;
        title: string;
        images?: string[];
        pricing?: Array<{ salePrice?: number; basePrice?: number }>;
      } | null;
    }>;
  } | null;
  customerOrders?: Array<{
    id: string;
    orderNumber?: string | null;
    totalAmount?: number | string | null;
    status: string;
    paymentStatus?: string | null;
    createdAt: string;
    items?: Array<{
      id: string;
      productTitle?: string;
      quantity?: number;
      totalPrice?: number | string | null;
    }>;
  }>;
  vendor?: {
    id?: string;
    storeName?: string;
    status?: string;
    businessCategory?: string | null;
    commissionRate?: string | number;
    _count?: {
      products?: number;
      orders?: number;
    };
  } | null;
  _count?: {
    customerOrders?: number;
  };
};

type CustomerDetailsProps = {
  user: any;
};

export default function CustomerDetails({ user }: CustomerDetailsProps) {
  const customer = user.customer;
  const rewardPoints = user.customerReward?.points ?? 0;
  const orders = user.customerOrders || [];
  const totalOrdersCount = user._count?.customerOrders ?? orders.length;
  const cartItems = user.cart?.items || [];
  const wishlistItems = user.wishlist?.items || [];

  const fullAddressText = [
    customer?.address,
    customer?.area,
    customer?.upazila,
    customer?.district,
    customer?.division,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* 1. Profile Header */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#12233F] text-base font-bold text-white shadow-sm">
          {user.name
            ? String(user.name)
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "U"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#12233F]">
            {user.name || "Customer"}
          </h3>
          <p className="truncate text-xs text-slate-500">{user.email || "—"}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
              Customer
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                user.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : user.status === "PENDING"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<ShoppingBag className="h-5 w-5 text-indigo-600" />}
          label="মোট অর্ডার"
          value={totalOrdersCount}
          bg="bg-indigo-50/70"
          border="border-indigo-100"
        />
        <StatCard
          icon={<Heart className="h-5 w-5 text-rose-600" />}
          label="উইশলিস্ট"
          value={wishlistItems.length}
          bg="bg-rose-50/70"
          border="border-rose-100"
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5 text-amber-600" />}
          label="কার্টে পণ্য"
          value={cartItems.length}
          bg="bg-amber-50/70"
          border="border-amber-100"
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-emerald-600" />}
          label="পয়েন্টস"
          value={rewardPoints}
          bg="bg-emerald-50/70"
          border="border-emerald-100"
        />
      </div>

      {/* 3. Linked Vendor Card (if applicable) */}
      {user.vendor && (
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-700 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {user.vendor.storeName || "Vendor Store"}
                </h4>
                <p className="text-xs text-slate-500">
                  ক্যাটাগরি: {user.vendor.businessCategory || "সাধারণ"} • স্ট্যাটাস:{" "}
                  <span className="font-semibold text-slate-700">
                    {user.vendor.status}
                  </span>
                </p>
              </div>
            </div>
            <Link
              href="/admin/vendors"
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm border border-blue-200 hover:bg-blue-50 transition"
            >
              <span>ভেন্ডর ড্যাশবোর্ড</span>
              <ExternalLink size={12} />
            </Link>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-slate-600">
            <span>পণ্য: <b>{user.vendor._count?.products ?? "—"}</b></span>
            <span>অর্ডার: <b>{user.vendor._count?.orders ?? "—"}</b></span>
            {user.vendor.commissionRate !== undefined && (
              <span>কমিশন: <b>{user.vendor.commissionRate}%</b></span>
            )}
          </div>
        </div>
      )}

      {/* 4. Basic Information */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          মূল তথ্য (Basic Information)
        </h4>
        <div className="space-y-3">
          <InfoRow
            icon={<UserRound size={16} />}
            label="পূর্ণ নাম"
            value={user.name}
          />
          <InfoRow
            icon={<Mail size={16} />}
            label="ইমেইল"
            value={user.email}
          />
          <InfoRow
            icon={<Phone size={16} />}
            label="ফোন নম্বর"
            value={user.phone || customer?.phone}
          />
          <InfoRow
            icon={<ShieldCheck size={16} />}
            label="অ্যাকাউন্ট স্ট্যাটাস"
            value={user.status}
          />
          <InfoRow
            icon={<CalendarDays size={16} />}
            label="যোগদানের তারিখ"
            value={
              user.joined
                ? new Date(user.joined).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"
            }
          />
        </div>
      </div>

      {/* 5. Delivery Address */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-slate-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ডেলিভারি ঠিকানা (Shipping Address)
          </h4>
        </div>
        {fullAddressText ? (
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed border border-slate-100">
            <p className="font-medium text-slate-800">{fullAddressText}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              {customer?.division && (
                <div>বিভাগ: <span className="font-semibold text-slate-700">{customer.division}</span></div>
              )}
              {customer?.district && (
                <div>জেলা: <span className="font-semibold text-slate-700">{customer.district}</span></div>
              )}
              {customer?.upazila && (
                <div>উপজেলা: <span className="font-semibold text-slate-700">{customer.upazila}</span></div>
              )}
              {customer?.area && (
                <div>এলাকা: <span className="font-semibold text-slate-700">{customer.area}</span></div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">কোনো ঠিকানা সেভ করা নেই</p>
        )}
      </div>

      {/* 6. Recent Orders */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              সাম্প্রতিক অর্ডারসমূহ
            </h4>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {orders.length} টি
          </span>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-2.5">
            {orders.map((ord: any) => (
              <div
                key={ord.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-xs transition hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#12233F]">
                      #{ord.orderNumber || ord.id.slice(0, 8)}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock size={12} />
                    <span>
                      {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                    {ord.items && (
                      <span>• {ord.items.length} আইটেম</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-800">
                    ৳{Number(ord.totalAmount || 0).toLocaleString()}
                  </span>
                  {ord.paymentStatus && (
                    <p className="text-[10px] text-slate-400">
                      {ord.paymentStatus}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">কোনো অর্ডার পাওয়া যায়নি</p>
        )}
      </div>

      {/* 7. Wishlist Preview */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              উইশলিস্ট পণ্যসমূহ
            </h4>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {wishlistItems.length} টি
          </span>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="space-y-2">
            {wishlistItems.map((item: any) => {
              const p = item.product;
              const img = p?.images?.[0];
              const price = p?.pricing?.[0]?.salePrice ?? p?.pricing?.[0]?.basePrice;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-xs"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={p?.title || "Product"}
                      className="h-10 w-10 rounded object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-200 text-slate-400">
                      <Package size={16} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {p?.title || "অজানা পণ্য"}
                    </p>
                    {price !== undefined && (
                      <p className="text-[11px] font-bold text-emerald-600">
                        ৳{Number(price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">উইশলিস্ট খালি</p>
        )}
      </div>

      {/* 8. Cart Preview */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              শপিং কার্ট আইটেম
            </h4>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {cartItems.length} টি
          </span>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-2">
            {cartItems.map((item: any) => {
              const p = item.product;
              const img = p?.images?.[0];
              const price = p?.pricing?.[0]?.salePrice ?? p?.pricing?.[0]?.basePrice;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-xs"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={p?.title || "Product"}
                      className="h-10 w-10 rounded object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-200 text-slate-400">
                      <Package size={16} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {p?.title || "অজানা পণ্য"}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>পরিমাণ: <b>{item.quantity}</b></span>
                      {price !== undefined && (
                        <span>• ৳{Number(price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">কার্টে কোনো পণ্য নেই</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`rounded-xl border ${border} ${bg} p-3 transition hover:shadow-sm`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-lg font-bold text-[#12233F]">{value}</span>
      </div>
      <p className="mt-1 text-[11px] font-medium text-slate-600">{label}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
        {value || "—"}
      </span>
    </div>
  );
}
