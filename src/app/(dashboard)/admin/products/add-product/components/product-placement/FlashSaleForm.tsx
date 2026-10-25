"use client";

import type { FlashSaleData } from "./types";

type Props = {
  value: FlashSaleData;
  onChange: (value: FlashSaleData) => void;
  errors?: Record<string, string>;
};

export default function FlashSaleForm({
  value,
  onChange,
  errors = {},
}: Props) {
  const update = <K extends keyof FlashSaleData>(
    field: K,
    fieldValue: FlashSaleData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50/40 p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Flash Sale Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Configure the flash sale price, stock and schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Flash Sale Price *
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              ৳
            </span>

            <input
              type="number"
              min="0"
              value={value.flashSalePrice}
              onChange={(e) =>
                update("flashSalePrice", e.target.value)
              }
              placeholder="450"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-8 pr-3 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {errors.flashSalePrice && (
            <p className="mt-1 text-xs text-red-500">
              {errors.flashSalePrice}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Flash Sale Stock *
          </label>

          <input
            type="number"
            min="1"
            value={value.flashSaleStock}
            onChange={(e) =>
              update("flashSaleStock", e.target.value)
            }
            placeholder="20"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.flashSaleStock && (
            <p className="mt-1 text-xs text-red-500">
              {errors.flashSaleStock}
            </p>
          )}
        </div>

        {/* Start */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Time *
          </label>

          <input
            type="datetime-local"
            value={value.startTime}
            onChange={(e) => update("startTime", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.startTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startTime}
            </p>
          )}
        </div>

        {/* End */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Time *
          </label>

          <input
            type="datetime-local"
            value={value.endTime}
            onChange={(e) => update("endTime", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.endTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endTime}
            </p>
          )}
        </div>

        {/* Badge */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Discount Badge
          </label>

          <input
            type="text"
            value={value.discountBadge}
            onChange={(e) =>
              update("discountBadge", e.target.value)
            }
            placeholder="30% OFF"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>
    </div>
  );
}