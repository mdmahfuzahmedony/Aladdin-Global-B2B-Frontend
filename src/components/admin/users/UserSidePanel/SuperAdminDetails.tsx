"use client";

import {
  Mail,
  Phone,
  UserRound,
  ShieldCheck,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

type SuperAdminDetailsProps = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    joined: string;
  };
};

export default function SuperAdminDetails({
  user,
}: SuperAdminDetailsProps) {
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

          <p className="mt-1 text-xs font-semibold text-red-600">
            Super Admin
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold text-[#12233F]">
          Administrator Information
        </h4>

        <div className="space-y-3">
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
            icon={<ShieldCheck size={16} />}
            label="Role"
            value={user.role}
          />

          <InfoRow
            icon={<BadgeCheck size={16} />}
            label="Status"
            value={user.status}
          />

          <InfoRow
            icon={<CalendarDays size={16} />}
            label="Joined"
            value={user.joined}
          />
        </div>
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
  value?: string | null;
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