"use client";

import { useState } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";

export interface AccountData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AccountStepProps {
  data: AccountData;
  onChange: (data: AccountData) => void;
}

export function AccountStep({ data, onChange }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Password requirement checks
  const hasMinLength = data.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(data.password);
  const hasLowercase = /[a-z]/.test(data.password);
  const hasNumber = /[0-9]/.test(data.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="017XXXXXXXX"
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        
        {/* Password input with visibility toggle */}
        <div className="relative flex items-center w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 z-10 flex items-center justify-center text-slate-500 hover:text-slate-800 p-1"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Real-time password requirements tracker */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-600 mb-1">Password requirements:</p>
          <p className={`text-[11px] flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
            {hasMinLength ? <Check size={12} /> : <X size={12} />} At least 8 characters
          </p>
          <p className={`text-[11px] flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
            {hasUppercase ? <Check size={12} /> : <X size={12} />} At least one uppercase letter (A-Z)
          </p>
          <p className={`text-[11px] flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
            {hasLowercase ? <Check size={12} /> : <X size={12} />} At least one lowercase letter (a-z)
          </p>
          <p className={`text-[11px] flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
            {hasNumber ? <Check size={12} /> : <X size={12} />} At least one number (0-9)
          </p>
        </div>
      </div>
    </div>
  );
}
