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

export default function WholesalerBusinessAddress({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Business Address
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Where is your business located?
        </p>
      </div>

      <div className="space-y-5">

        {/* ADDRESS */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Business Address
          </label>

          <textarea
            value={data.address}
            onChange={(e) =>
              updateData({
                address: e.target.value,
              })
            }
            placeholder="House, road, area..."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />
        </div>

        {/* CITY */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City
          </label>

          <input
            type="text"
            value={data.city}
            onChange={(e) =>
              updateData({
                city: e.target.value,
              })
            }
            placeholder="City"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />
        </div>

        {/* DISTRICT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            District
          </label>

          <input
            type="text"
            value={data.district}
            onChange={(e) =>
              updateData({
                district: e.target.value,
              })
            }
            placeholder="District"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />
        </div>

        {/* POSTAL CODE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Postal Code
          </label>

          <input
            type="text"
            value={data.postalCode}
            onChange={(e) =>
              updateData({
                postalCode: e.target.value,
              })
            }
            placeholder="Postal code"
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