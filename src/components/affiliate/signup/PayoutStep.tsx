"use client";
import { toast } from "react-toastify";

import { Building2, CreditCard, Smartphone, User } from "lucide-react";

import type {
  AffiliatePayoutMethod,
  AffiliateSignupData,
} from "@/app/(auth)/affiliate-signup/types/affiliate";

type PayoutStepProps = {
  data: AffiliateSignupData;
  updateData: (data: Partial<AffiliateSignupData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const payoutMethods: {
  value: AffiliatePayoutMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "BKASH",
    label: "bKash",
    description: "Receive payments through bKash",
  },
  {
    value: "NAGAD",
    label: "Nagad",
    description: "Receive payments through Nagad",
  },
  {
    value: "BANK",
    label: "Bank",
    description: "Receive payments directly in your bank",
  },
];

export default function PayoutStep({
  data,
  updateData,
  onNext,
  onBack,
}: PayoutStepProps) {
  const handleNext = () => {
    if (!data.payoutMethod) {
      toast.warning("Please select a payout method.");
      return;
    }

    if (data.payoutMethod === "BKASH" || data.payoutMethod === "NAGAD") {
      if (!data.payoutMobileNumber.trim()) {
        toast.warning("Please enter your mobile banking number.");
        return;
      }
    }

    if (data.payoutMethod === "BANK") {
      if (!data.payoutAccountName.trim()) {
        toast.warning("Please enter account holder name.");
        return;
      }

      if (!data.payoutAccountNumber.trim()) {
        toast.warning("Please enter bank account number.");
        return;
      }
    }

    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 4</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Payout Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to receive your affiliate earnings.
        </p>
      </div>

      {/* PAYOUT METHODS */}
      <div className="grid gap-3 md:grid-cols-3">
        {payoutMethods.map((method) => {
          const selected = data.payoutMethod === method.value;

          return (
            <button
              key={method.value}
              type="button"
              onClick={() =>
                updateData({
                  payoutMethod: method.value,
                  payoutMobileNumber: "",
                  payoutAccountName: "",
                  payoutAccountNumber: "",
                })
              }
              className={[
                "rounded-xl border p-5 text-left transition",
                selected
                  ? "border-amber-500 bg-amber-50 shadow-sm"
                  : "border-gray-200 hover:border-amber-300",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
                  selected
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                {method.value === "BANK" ? (
                  <Building2 size={20} />
                ) : (
                  <Smartphone size={20} />
                )}
              </div>

              <h3 className="text-sm font-bold text-[#12233f]">
                {method.label}
              </h3>

              <p className="mt-1 text-xs text-gray-500">{method.description}</p>
            </button>
          );
        })}
      </div>

      {/* MOBILE BANKING */}
      {(data.payoutMethod === "BKASH" || data.payoutMethod === "NAGAD") && (
        <div className="mt-7">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            {data.payoutMethod === "BKASH" ? "bKash" : "Nagad"} Number
          </label>

          <div className="relative">
            <Smartphone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              value={data.payoutMobileNumber}
              onChange={(e) =>
                updateData({
                  payoutMobileNumber: e.target.value,
                })
              }
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>
      )}

      {/* BANK */}
      {data.payoutMethod === "BANK" && (
        <div className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Account Holder Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={data.payoutAccountName}
                onChange={(e) =>
                  updateData({
                    payoutAccountName: e.target.value,
                  })
                }
                placeholder="Account holder name"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Bank Account Number
            </label>

            <div className="relative">
              <CreditCard
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={data.payoutAccountNumber}
                onChange={(e) =>
                  updateData({
                    payoutAccountNumber: e.target.value,
                  })
                }
                placeholder="Enter bank account number"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>
        </div>
      )}

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
          Continue
        </button>
      </div>
    </div>
  );
}
