"use client";

import { User, Mail, Phone } from "lucide-react";

import { WholesalerSignupData } from "@/app/(auth)/wholesaler-signup/types/wholesaler";


type Props = {
  data: WholesalerSignupData;
  updateData: (
    data: Partial<WholesalerSignupData>
  ) => void;
  onNext: () => void;
};

export default function WholesalerPersonalInfo({
  data,
  updateData,
  onNext,
}: Props) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us about the person managing this
          wholesale account.
        </p>
      </div>

      <div className="space-y-5">

        {/* FULL NAME */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={data.fullName}
              onChange={(e) =>
                updateData({
                  fullName: e.target.value,
                })
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#12233F]"
            />
          </div>
        </div>

        {/* EMAIL */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              value={data.email}
              onChange={(e) =>
                updateData({
                  email: e.target.value,
                })
              }
              placeholder="name@company.com"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#12233F]"
            />
          </div>
        </div>

        {/* PHONE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Mobile Number
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="tel"
              value={data.phone}
              onChange={(e) =>
                updateData({
                  phone: e.target.value,
                })
              }
              placeholder="017XXXXXXXX"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#12233F]"
            />
          </div>
        </div>
      </div>

      {/* BUTTON */}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#12233F] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1c355b]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}