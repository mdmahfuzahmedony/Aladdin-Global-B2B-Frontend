"use client";

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
} from "lucide-react";

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
    storeName?: string;
    businessAddress?: string;
    businessCategory?: string | null;

    status?: string;
    commissionRate?: string | number;

    nidNumber?: string;
    nidDocumentUrl?: string;

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
  };
};

type VendorDetailsProps = {
  user: VendorUser;
};

export default function VendorDetails({
  user,
}: VendorDetailsProps) {
  const vendor = user.vendor;

  return (
    <div className="space-y-6">
      {/* Vendor Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#12233F] text-sm font-bold text-white">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        <div>
          <h3 className="text-base font-bold text-[#12233F]">
            {user.name}
          </h3>

          <p className="mt-1 text-xs font-semibold text-emerald-600">
            Vendor
          </p>
        </div>
      </div>

      {/* Account Information */}
      <Section title="Account Information">
        <InfoRow
          icon={<UserRound size={16} />}
          label="Full Name"
          value={user.name}
        />

        <InfoRow
          icon={<Mail size={16} />}
          label="Email"
          value={user.email}
        />

        <InfoRow
          icon={<Phone size={16} />}
          label="Phone"
          value={user.phone}
        />

        <InfoRow
          icon={<BadgeCheck size={16} />}
          label="Account Status"
          value={user.status}
        />
      </Section>

      {/* Business Information */}
      <Section title="Business Information">
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
          value={vendor?.businessAddress}
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
            vendor?.commissionRate !== undefined
              ? `${vendor.commissionRate}%`
              : undefined
          }
        />
      </Section>

      {/* Verification */}
      <Section title="Verification">
        <InfoRow
          icon={<FileText size={16} />}
          label="NID Number"
          value={vendor?.nidNumber}
        />

        <InfoRow
          icon={<FileText size={16} />}
          label="NID Document"
          value={vendor?.nidDocumentUrl}
        />

        <InfoRow
          icon={<FileText size={16} />}
          label="Trade License Number"
          value={vendor?.tradeLicenseNumber}
        />

        <InfoRow
          icon={<FileText size={16} />}
          label="Trade License Document"
          value={vendor?.tradeLicenseDocUrl}
        />

        <InfoRow
          icon={<FileText size={16} />}
          label="TIN"
          value={vendor?.taxIdentificationNumber}
        />

        <InfoRow
          icon={<FileText size={16} />}
          label="TIN Document"
          value={vendor?.tinDocUrl}
        />
      </Section>

      {/* Payout */}
      <Section title="Payout Information">
        <InfoRow
          icon={<CreditCard size={16} />}
          label="Payout Method"
          value={vendor?.payoutMethod}
        />

        <InfoRow
          icon={<Store size={16} />}
          label="Bank Name"
          value={vendor?.bankName}
        />

        <InfoRow
          icon={<CreditCard size={16} />}
          label="Bank Account Number"
          value={vendor?.bankAccountNumber}
        />

        <InfoRow
          icon={<UserRound size={16} />}
          label="Account Holder"
          value={vendor?.bankAccountHolder}
        />

        <InfoRow
          icon={<Phone size={16} />}
          label="Mobile Banking Number"
          value={vendor?.mobileBankingNumber}
        />
      </Section>

      {/* Dates */}
      <Section title="Dates">
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Created At"
          value={formatDate(vendor?.createdAt)}
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-[#12233F]">
        {title}
      </h4>

      <div className="grid grid-cols-1 gap-3">
        {children}
      </div>
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
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <div className="mt-0.5 shrink-0 text-[#D6A419]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs font-semibold text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleString();
}