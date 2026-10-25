"use client";
import { toast } from "react-toastify";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import type { AffiliateSignupData } from "@/app/(auth)/affiliate-signup/types/affiliate";

type SecurityStepProps = {
  data: AffiliateSignupData;
  updateData: (data: Partial<AffiliateSignupData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function SecurityStep({
  data,
  updateData,
  onNext,
  onBack,
}: SecurityStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = () => {
    if (!data.password) {
      toast.warning("Please enter a password.");
      return;
    }

    if (data.password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    if (!data.confirmPassword) {
      toast.warning("Please confirm your password.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 5</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Account & Security
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a secure password for your affiliate account.
        </p>
      </div>

      <div className="space-y-5">
        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) =>
                updateData({
                  password: e.target.value,
                })
              }
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) =>
                updateData({
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          Your password should contain at least 6 characters. Never share your
          password with anyone.
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-amber-500 px-7 py-3 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Review Application
        </button>
      </div>
    </div>
  );
}
