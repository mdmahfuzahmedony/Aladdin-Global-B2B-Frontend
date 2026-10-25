"use client";

import {
  Banknote,
  Globe,
  Mail,
  Megaphone,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import type { AffiliateSignupData } from "@/app/(auth)/affiliate-signup/types/affiliate";

type ReviewStepProps = {
  data: AffiliateSignupData;
  onBack: () => void;
  onSubmit: () => void;
};

function ReviewItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-medium text-[#12233f]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function ReviewStep({
  data,
  onBack,
  onSubmit,
}: ReviewStepProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 6</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Review Your Application
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Please check your information before submitting.
        </p>
      </div>

      {/* PERSONAL */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <User size={19} className="text-amber-500" />

          <h3 className="font-poppins text-lg font-bold text-[#12233f]">
            Personal Information
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <ReviewItem
            label="Full Name"
            value={data.fullName}
            icon={<User size={14} />}
          />

          <ReviewItem
            label="Email"
            value={data.email}
            icon={<Mail size={14} />}
          />

          <ReviewItem
            label="Mobile"
            value={data.phone}
            icon={<Phone size={14} />}
          />
        </div>
      </section>

      {/* SOCIAL */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Globe size={19} className="text-amber-500" />

          <h3 className="font-poppins text-lg font-bold text-[#12233f]">
            Social Platform
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <ReviewItem
            label="Platform"
            value={data.socialPlatform}
            icon={<Globe size={14} />}
          />

          <ReviewItem
            label="Profile / Website"
            value={data.socialMediaLink}
            icon={<Globe size={14} />}
          />

          <ReviewItem
            label="Followers"
            value={data.followerCount}
            icon={<Users size={14} />}
          />
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Megaphone size={19} className="text-amber-500" />

          <h3 className="font-poppins text-lg font-bold text-[#12233f]">
            Audience & Promotion
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ReviewItem label="Product Category" value={data.promotionCategory} />

          <ReviewItem label="Promotion Method" value={data.promotionMethod} />

          <div className="md:col-span-2">
            <ReviewItem
              label="Audience Description"
              value={data.audienceDescription}
              icon={<Users size={14} />}
            />
          </div>
        </div>
      </section>

      {/* PAYOUT */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Banknote size={19} className="text-amber-500" />

          <h3 className="font-poppins text-lg font-bold text-[#12233f]">
            Payout Information
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <ReviewItem label="Payout Method" value={data.payoutMethod} />

          {(data.payoutMethod === "BKASH" || data.payoutMethod === "NAGAD") && (
            <ReviewItem
              label="Mobile Number"
              value={data.payoutMobileNumber}
              icon={<Phone size={14} />}
            />
          )}

          {data.payoutMethod === "BANK" && (
            <>
              <ReviewItem
                label="Account Holder"
                value={data.payoutAccountName}
              />

              <ReviewItem
                label="Account Number"
                value={data.payoutAccountNumber}
              />
            </>
          )}
        </div>
      </section>

      {/* SECURITY */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck size={19} className="text-amber-500" />

          <h3 className="font-poppins text-lg font-bold text-[#12233f]">
            Account & Security
          </h3>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-green-600" />

            <div>
              <p className="text-sm font-semibold text-green-800">
                Password is ready
              </p>

              <p className="mt-1 text-xs text-green-700">
                Your password will remain private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICE */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex gap-3">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Ready to submit?
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              After clicking submit, you will receive a verification code on
              your email. You will need to verify the OTP before your affiliate
              application is created.
            </p>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
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
          onClick={onSubmit}
          className="rounded-lg bg-[#12233f] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3156]"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
