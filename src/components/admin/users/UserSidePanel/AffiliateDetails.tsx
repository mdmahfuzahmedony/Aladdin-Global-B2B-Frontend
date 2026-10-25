"use client";

import {
  Mail,
  Phone,
  UserRound,
  BadgeCheck,
  CalendarDays,
  Users,
  Wallet,
} from "lucide-react";

type AffiliateDetailsProps = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    joined: string;

    affiliate?: {
      referralCode?: string | null;
      commissionRate?: string | number | null;
      status?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };
  };
};

export default function AffiliateDetails({
  user,
}: AffiliateDetailsProps) {
  const affiliate = user.affiliate;

  return (
    <div className="space-y-6">
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

          <p className="mt-1 text-xs font-semibold text-pink-600">
            Affiliate
          </p>
        </div>
      </div>

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

      <Section title="Affiliate Information">
        <InfoRow
          icon={<Users size={16} />}
          label="Referral Code"
          value={affiliate?.referralCode}
        />

        <InfoRow
          icon={<Wallet size={16} />}
          label="Commission Rate"
          value={
            affiliate?.commissionRate !== undefined &&
            affiliate?.commissionRate !== null
              ? `${affiliate.commissionRate}%`
              : undefined
          }
        />

        <InfoRow
          icon={<BadgeCheck size={16} />}
          label="Affiliate Status"
          value={affiliate?.status}
        />
      </Section>

      <Section title="Dates">
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Created At"
          value={formatDate(affiliate?.createdAt)}
        />

        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Updated At"
          value={formatDate(affiliate?.updatedAt)}
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

      <div className="space-y-3">{children}</div>
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
      <div className="mt-0.5 text-[#D6A419]">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-semibold text-slate-700">
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