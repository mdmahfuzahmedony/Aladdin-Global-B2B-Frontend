"use client";

import type { TrustedData } from "./types";

type Props = {
  value: TrustedData;
  onChange: (value: TrustedData) => void;
};

export default function TrustedForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-green-200 bg-green-50/40 p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Trusted Product Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Configure trust, warranty and official store information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Trust Badge Text
          </label>

          <input
            type="text"
            value={value.trustBadgeText}
            onChange={(e) =>
              onChange({
                ...value,
                trustBadgeText: e.target.value,
              })
            }
            placeholder="100% Authentic"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Info
          </label>

          <input
            type="text"
            value={value.warrantyInfo}
            onChange={(e) =>
              onChange({
                ...value,
                warrantyInfo: e.target.value,
              })
            }
            placeholder="7 Days Replacement Warranty"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 md:col-span-2">
          <input
            type="checkbox"
            checked={value.officialStore}
            onChange={(e) =>
              onChange({
                ...value,
                officialStore: e.target.checked,
              })
            }
            className="h-4 w-4"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Official Store
            </p>

            <p className="text-xs text-slate-500">
              Mark this product as an official store product.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}