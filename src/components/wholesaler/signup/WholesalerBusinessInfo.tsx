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

export default function WholesalerBusinessInfo({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Business Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us about your business.
        </p>
      </div>

      <div className="space-y-5">

        {/* BUSINESS NAME */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business / Shop Name
          </label>

          <input
            type="text"
            value={data.businessName}
            onChange={(e) =>
              updateData({
                businessName: e.target.value,
              })
            }
            placeholder="Your business name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />
        </div>

        {/* BUSINESS TYPE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business Type
          </label>

          <select
            value={data.businessType}
            onChange={(e) =>
              updateData({
                businessType: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          >
            <option value="">
              Select business type
            </option>

            <option value="RETAIL_SHOP">
              Retail Shop
            </option>

            <option value="ONLINE_SHOP">
              Online Shop
            </option>

            <option value="DISTRIBUTOR">
              Distributor
            </option>

            <option value="RESELLER">
              Reseller
            </option>

            <option value="ECOMMERCE">
              E-commerce
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        {/* CATEGORY */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business Category
          </label>

          <select
            value={data.businessCategory}
            onChange={(e) =>
              updateData({
                businessCategory: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          >
            <option value="">
              Select category
            </option>

            <option value="FASHION">
              Fashion
            </option>

            <option value="ELECTRONICS">
              Electronics
            </option>

            <option value="GROCERY">
              Grocery
            </option>

            <option value="COSMETICS">
              Cosmetics
            </option>

            <option value="HOME_LIVING">
              Home & Living
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}

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