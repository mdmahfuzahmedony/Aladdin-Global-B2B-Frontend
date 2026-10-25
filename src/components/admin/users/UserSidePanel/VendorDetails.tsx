"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Store,
  MapPin,
  BriefcaseBusiness,
  CreditCard,
  UserRound,
  FileText,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  Package,
  ShoppingBag,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type VendorUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joined: string;

  vendor?: {
    id?: string;
    userId?: string;
    storeName?: string;
    businessAddress?: string;
    businessCategory?: string | null;
    status?: string;
    commissionRate?: string | number;
    nidNumber?: string;
    nidDocumentUrl?: string | null;
    nidFrontDocumentUrl?: string | null;
    nidBackDocumentUrl?: string | null;
    tradeLicenseNumber?: string | null;
    tradeLicenseDocUrl?: string | null;
    taxIdentificationNumber?: string | null;
    tinDocUrl?: string | null;
    payoutMethod?: string;
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountHolder?: string | null;
    mobileBankingNumber?: string | null;
    createdAt?: string;
    updatedAt?: string;
    location?: {
      fullAddress?: string;
      division?: string | null;
      district?: string | null;
      upazila?: string | null;
      area?: string | null;
    } | null;
    payout?: {
      payoutMethod?: string;
      bankName?: string | null;
      bankAccountNumber?: string | null;
      bankAccountHolder?: string | null;
      mobileBankingNumber?: string | null;
    } | null;
    settings?: {
      phone?: string | null;
      email?: string | null;
      description?: string | null;
    } | null;
    _count?: {
      products?: number;
      orders?: number;
    };
  } | null;
};

type VendorDetailsProps = {
  user: any;
};

// =========================================================
// COMPONENT
// =========================================================

export default function VendorDetails({ user }: VendorDetailsProps) {
  // Support both user.vendor and legacy user.seller
  const vendor = user.vendor || (user as any).seller;

  const address =
    vendor?.businessAddress ||
    vendor?.location?.fullAddress ||
    [
      vendor?.location?.area,
      vendor?.location?.upazila,
      vendor?.location?.district,
      vendor?.location?.division,
    ]
      .filter(Boolean)
      .join(", ") ||
    "—";

  const payoutMethod = vendor?.payoutMethod || vendor?.payout?.payoutMethod || "—";
  const bankName = vendor?.bankName || vendor?.payout?.bankName || "—";
  const bankAccountNumber =
    vendor?.bankAccountNumber || vendor?.payout?.bankAccountNumber || "—";
  const bankAccountHolder =
    vendor?.bankAccountHolder || vendor?.payout?.bankAccountHolder || "—";
  const mobileBankingNumber =
    vendor?.mobileBankingNumber || vendor?.payout?.mobileBankingNumber || "—";

  return (
    <div className="space-y-6">
      {/* =================================================
          VENDOR HEADER
      ================================================= */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#12233F] text-base font-bold text-white shadow-sm">
          {getInitials(user.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#12233F]">
            {user.name}
          </h3>
          <p className="truncate text-xs text-slate-500">{user.email || "—"}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
              Vendor / Seller
            </span>
            {vendor?.status && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  vendor.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : vendor.status === "PENDING"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {vendor.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          QUICK STATS & VENDOR ROUTE SHORTCUT
      ================================================= */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-[#12233F]">
              {vendor?._count?.products ?? 0}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-600">মোট পণ্য</p>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-600" />
            <span className="text-lg font-bold text-[#12233F]">
              {vendor?._count?.orders ?? 0}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-600">মোট অর্ডার</p>
        </div>
      </div>

      {/* Shortcut Link to Dedicated Vendor Route */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">ভেন্ডর ম্যানেজমেন্ট পেজ</p>
          <p className="text-[11px] text-slate-500">
            বিস্তারিত দোকান প্রোফাইল ও নথি পর্যালোচনা করুন
          </p>
        </div>
        <Link
          href={`/admin/vendors?search=${encodeURIComponent(vendor?.storeName || user.name)}`}
          className="inline-flex items-center gap-1 rounded-lg bg-[#12233F] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1a3258] transition"
        >
          <span>পেজে যান</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* =================================================
          ACCOUNT INFORMATION
      ================================================= */}
      <Section title="অ্যাকাউন্ট তথ্য (Account Information)">
        <InfoRow icon={<UserRound size={16} />} label="Full Name" value={user.name} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={user.phone} />
        <InfoRow icon={<BadgeCheck size={16} />} label="Account Status" value={user.status} />
      </Section>

      {/* =================================================
          BUSINESS INFORMATION
      ================================================= */}
      <Section title="ব্যবসার তথ্য (Business Information)">
        <InfoRow
          icon={<Store size={16} />}
          label="Store Name"
          value={vendor?.storeName}
        />
        <InfoRow
          icon={<BriefcaseBusiness size={16} />}
          label="Business Category"
          value={vendor?.businessCategory}
        />
        <InfoRow
          icon={<MapPin size={16} />}
          label="Business Address"
          value={address}
        />
        <InfoRow
          icon={<BadgeCheck size={16} />}
          label="Vendor Status"
          value={vendor?.status}
        />
        <InfoRow
          icon={<CreditCard size={16} />}
          label="Commission Rate"
          value={
            vendor?.commissionRate !== undefined && vendor?.commissionRate !== null
              ? `${vendor.commissionRate}%`
              : "0%"
          }
        />
      </Section>

      {/* =================================================
          VERIFICATION DOCUMENTS
      ================================================= */}
      <Section title="যাচাইকরণ নথি (Verification)">
        <InfoRow
          icon={<FileText size={16} />}
          label="NID Number"
          value={vendor?.nidNumber}
        />
        <InfoDocRow
          icon={<FileText size={16} />}
          label="NID Document"
          url={vendor?.nidDocumentUrl || vendor?.nidFrontDocumentUrl}
        />
        <InfoRow
          icon={<FileText size={16} />}
          label="Trade License Number"
          value={vendor?.tradeLicenseNumber}
        />
        <InfoDocRow
          icon={<FileText size={16} />}
          label="Trade License Document"
          url={vendor?.tradeLicenseDocUrl}
        />
        <InfoRow
          icon={<FileText size={16} />}
          label="TIN"
          value={vendor?.taxIdentificationNumber}
        />
        <InfoDocRow
          icon={<FileText size={16} />}
          label="TIN Document"
          url={vendor?.tinDocUrl}
        />
      </Section>

      {/* =================================================
          PAYOUT INFORMATION
      ================================================= */}
      <Section title="পে-আউট তথ্য (Payout Information)">
        <InfoRow
          icon={<CreditCard size={16} />}
          label="Payout Method"
          value={payoutMethod}
        />
        <InfoRow
          icon={<Store size={16} />}
          label="Bank Name"
          value={bankName}
        />
        <InfoRow
          icon={<CreditCard size={16} />}
          label="Bank Account Number"
          value={bankAccountNumber}
        />
        <InfoRow
          icon={<UserRound size={16} />}
          label="Account Holder"
          value={bankAccountHolder}
        />
        <InfoRow
          icon={<Phone size={16} />}
          label="Mobile Banking Number"
          value={mobileBankingNumber}
        />
      </Section>

      {/* =================================================
          DATES
      ================================================= */}
      <Section title="তারিখ ও রেকর্ড (Dates)">
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Created At"
          value={formatDate(vendor?.createdAt || user.joined)}
        />
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Updated At"
          value={formatDate(vendor?.updatedAt)}
        />
      </Section>
    </div>
  );
}

// =========================================================
// HELPERS
// =========================================================

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h4>
      <div className="space-y-2.5">{children}</div>
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
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-[#D6A419]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-slate-800 truncate max-w-[220px]">
        {value || "—"}
      </span>
    </div>
  );
}

function InfoDocRow({
  icon,
  label,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  url?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-[#D6A419]">{icon}</span>
        <span>{label}</span>
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          <span>নথি দেখুন</span>
          <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-slate-400">—</span>
      )}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
