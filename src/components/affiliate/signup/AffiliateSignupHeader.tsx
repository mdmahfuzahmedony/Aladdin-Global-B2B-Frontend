"use client";
import { toast } from "react-toastify";

import { Megaphone, ShoppingBag, Users } from "lucide-react";

import type { AffiliateSignupData } from "@/app/(auth)/affiliate-signup/types/affiliate";

type AudienceInfoStepProps = {
  data: AffiliateSignupData;
  updateData: (data: Partial<AffiliateSignupData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const categories = [
  "Fashion",
  "Electronics",
  "Grocery",
  "Cosmetics",
  "Home & Living",
  "Other",
];

const methods = [
  "Social Media Posts",
  "Video Content",
  "Live Streaming",
  "Blog / Website",
  "Community / Group",
  "Other",
];

export default function AudienceInfoStep({
  data,
  updateData,
  onNext,
  onBack,
}: AudienceInfoStepProps) {
  const handleNext = () => {
    if (!data.promotionCategory) {
      toast.warning("Please select a promotion category.");
      return;
    }

    if (!data.promotionMethod) {
      toast.warning("Please select your promotion method.");
      return;
    }

    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 3</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Audience & Promotion
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Help us understand how you plan to promote Aladdin.
        </p>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Main Product Category
        </label>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => {
            const selected = data.promotionCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  updateData({
                    promotionCategory: category,
                  })
                }
                className={[
                  "flex items-center gap-2 rounded-xl border p-4 text-left text-sm font-medium transition",
                  selected
                    ? "border-amber-500 bg-amber-50 text-amber-600"
                    : "border-gray-200 text-gray-600 hover:border-amber-300",
                ].join(" ")}
              >
                <ShoppingBag size={18} />
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* METHOD */}
      <div className="mt-7">
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          How Will You Promote?
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {methods.map((method) => {
            const selected = data.promotionMethod === method;

            return (
              <button
                key={method}
                type="button"
                onClick={() =>
                  updateData({
                    promotionMethod: method,
                  })
                }
                className={[
                  "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition",
                  selected
                    ? "border-amber-500 bg-amber-50 text-amber-600"
                    : "border-gray-200 text-gray-600 hover:border-amber-300",
                ].join(" ")}
              >
                <Megaphone size={18} />
                {method}
              </button>
            );
          })}
        </div>
      </div>

      {/* AUDIENCE DESCRIPTION */}
      <div className="mt-7">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Tell Us About Your Audience
        </label>

        <div className="relative">
          <Users size={18} className="absolute left-3 top-3 text-gray-400" />

          <textarea
            rows={5}
            value={data.audienceDescription}
            onChange={(e) =>
              updateData({
                audienceDescription: e.target.value,
              })
            }
            placeholder="Example: My audience is mainly small business owners and online shoppers in Bangladesh..."
            className="w-full resize-none rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
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
          Continue
        </button>
      </div>
    </div>
  );
}
