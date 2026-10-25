"use client";

import type { TopSellerData } from "./types";

type Props = {
  value: TopSellerData;
  onChange: (value: TopSellerData) => void;
};

export default function TopSellerForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50/40 p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Top Seller Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Configure bestseller display information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sales Badge
          </label>

          <input
            type="text"
            value={value.salesBadge}
            onChange={(e) =>
              onChange({
                ...value,
                salesBadge: e.target.value,
              })
            }
            placeholder="Hot Seller"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={value.isExpressEligible}
            onChange={(e) =>
              onChange({
                ...value,
                isExpressEligible: e.target.checked,
              })
            }
            className="h-4 w-4"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Express Eligible
            </p>

            <p className="text-xs text-slate-500">
              This product supports express delivery.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}