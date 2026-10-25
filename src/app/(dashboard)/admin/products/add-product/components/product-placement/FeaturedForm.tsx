"use client";

import type { FeaturedData } from "./types";

type Props = {
  value: FeaturedData;
  onChange: (value: FeaturedData) => void;
  errors?: Record<string, string>;
};

export default function FeaturedForm({
  value,
  onChange,
  errors = {},
}: Props) {
  const update = <K extends keyof FeaturedData>(
    field: K,
    fieldValue: FeaturedData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Featured Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Configure featured product display information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Featured Badge Text
          </label>

          <input
            type="text"
            value={value.featuredBadgeText}
            onChange={(e) =>
              update("featuredBadgeText", e.target.value)
            }
            placeholder="Special Deal"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Display Order
          </label>

          <input
            type="number"
            min="1"
            value={value.displayOrder}
            onChange={(e) =>
              update("displayOrder", e.target.value)
            }
            placeholder="1"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.displayOrder && (
            <p className="mt-1 text-xs text-red-500">
              {errors.displayOrder}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Banner Image
          </label>

          <input
            type="text"
            value={value.bannerImage}
            onChange={(e) =>
              update("bannerImage", e.target.value)
            }
            placeholder="Banner image URL"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          <p className="mt-1 text-xs text-slate-500">
            Image upload system পরে connect করা যাবে।
          </p>
        </div>
      </div>
    </div>
  );
}