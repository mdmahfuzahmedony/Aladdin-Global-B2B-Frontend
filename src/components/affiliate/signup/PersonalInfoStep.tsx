"use client";
import { toast } from "react-toastify";

import { Mail, Phone, User } from "lucide-react";
import type { AffiliateSignupData } from "@/app/(auth)/affiliate-signup/types/affiliate";

type PersonalInfoStepProps = {
  data: AffiliateSignupData;
  updateData: (data: Partial<AffiliateSignupData>) => void;
  onNext: () => void;
};

export default function PersonalInfoStep({
  data,
  updateData,
  onNext,
}: PersonalInfoStepProps) {
  const handleNext = () => {
    if (!data.fullName.trim()) {
      toast.warning("Please enter your full name.");
      return;
    }

    if (!data.email.trim()) {
      toast.warning("Please enter your email address.");
      return;
    }

    if (!data.phone.trim()) {
      toast.warning("Please enter your mobile number.");
      return;
    }

    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 1</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell us a little about yourself.
        </p>
      </div>

      <div className="space-y-5">
        {/* FULL NAME */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Business / Personal Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={data.email}
              onChange={(e) =>
                updateData({
                  email: e.target.value,
                })
              }
              placeholder="name@example.com"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Mobile Number
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              value={data.phone}
              onChange={(e) =>
                updateData({
                  phone: e.target.value,
                })
              }
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-amber-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
