"use client";

import { User, Phone, Lock, Mail } from "lucide-react";

export type AccountData = {
  fullName: string;
  phone: string;
  email: string; // ✅ ইমেইল ফিল্ড যুক্ত করা হলো
  password: string;
};

type Props = {
  data: AccountData;
  onChange: (data: AccountData) => void;
};

export function AccountStep({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            placeholder="example@mail.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="tel"
            required
            placeholder="+880 1700..."
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            placeholder="At least 8 characters"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
}