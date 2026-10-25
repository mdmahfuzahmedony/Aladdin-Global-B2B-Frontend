"use client";

import { WholesalerSignupData } from "@/app/(auth)/wholesaler-signup/types/wholesaler";


type Props = {
  data: WholesalerSignupData;
  updateData: (
    data: Partial<WholesalerSignupData>
  ) => void;
  onNext: () => void;
  onBack: () => void;
};

const categories = [
  "Fashion",
  "Electronics",
  "Grocery",
  "Cosmetics",
  "Home & Living",
];

export default function WholesalerBuyingInfo({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const toggleCategory = (
    category: string
  ) => {
    const exists =
      data.interestedCategories.includes(
        category
      );

    if (exists) {
      updateData({
        interestedCategories:
          data.interestedCategories.filter(
            (item) => item !== category
          ),
      });
    } else {
      updateData({
        interestedCategories: [
          ...data.interestedCategories,
          category,
        ],
      });
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Wholesale Buying Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Help us understand what and how much you
          usually buy.
        </p>
      </div>

      <div className="space-y-6">

        {/* INTERESTED CATEGORIES */}

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Interested Product Categories
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => {
              const selected =
                data.interestedCategories.includes(
                  category
                );

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    toggleCategory(category)
                  }
                  className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${
                    selected
                      ? "border-[#12233F] bg-[#12233F]/5 text-[#12233F]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>

                    {selected && (
                      <span className="font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MONTHLY PURCHASE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Expected Monthly Purchase
          </label>

          <select
            value={
              data.monthlyPurchaseVolume
            }
            onChange={(e) =>
              updateData({
                monthlyPurchaseVolume:
                  e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          >
            <option value="">
              Select monthly volume
            </option>

            <option value="10K_50K">
              ৳10,000 – ৳50,000
            </option>

            <option value="50K_100K">
              ৳50,000 – ৳1,00,000
            </option>

            <option value="100K_500K">
              ৳1,00,000 – ৳5,00,000
            </option>

            <option value="500K_PLUS">
              ৳5,00,000+
            </option>
          </select>
        </div>

        {/* PAYMENT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Preferred Payment Method
          </label>

          <select
            value={
              data.preferredPaymentMethod
            }
            onChange={(e) =>
              updateData({
                preferredPaymentMethod:
                  e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          >
            <option value="">
              Select payment method
            </option>

            <option value="BANK">
              Bank Transfer
            </option>

            <option value="BKASH">
              bKash
            </option>

            <option value="NAGAD">
              Nagad
            </option>

            <option value="CASH_ON_DELIVERY">
              Cash on Delivery
            </option>
          </select>
        </div>

        {/* DELIVERY */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Preferred Delivery Location
          </label>

          <input
            type="text"
            value={
              data.preferredDeliveryLocation
            }
            onChange={(e) =>
              updateData({
                preferredDeliveryLocation:
                  e.target.value,
              })
            }
            placeholder="Where should we deliver your orders?"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />
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
          Continue
        </button>
      </div>
    </div>
  );
}