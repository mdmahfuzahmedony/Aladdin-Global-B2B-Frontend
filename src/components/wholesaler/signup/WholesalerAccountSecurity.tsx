"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { WholesalerSignupData } from "@/app/(auth)/wholesaler-signup/types/wholesaler";


type Props = {
  data: WholesalerSignupData;
  updateData: (
    data: Partial<WholesalerSignupData>
  ) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function WholesalerAccountSecurity({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Account Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a secure password for your
          wholesaler account.
        </p>
      </div>

      <div className="space-y-5">

        {/* PASSWORD */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={data.password}
              onChange={(e) =>
                updateData({
                  password:
                    e.target.value,
                })
              }
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#12233F]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                data.confirmPassword
              }
              onChange={(e) =>
                updateData({
                  confirmPassword:
                    e.target.value,
                })
              }
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#12233F]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* PASSWORD RULE */}

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-600">
            Password requirements
          </p>

          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            <li>• At least 8 characters</li>
            <li>• Use a strong password</li>
            <li>• Do not share your password</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#12233F] px-7 py-3 text-sm font-bold text-white hover:bg-[#1c355b]"
        >
          Review Information
        </button>
      </div>
    </div>
  );
}