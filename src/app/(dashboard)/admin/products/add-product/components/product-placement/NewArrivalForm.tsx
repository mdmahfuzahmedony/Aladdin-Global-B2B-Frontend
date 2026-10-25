"use client";

import type { NewArrivalData } from "./types";

type Props = {
  value: NewArrivalData;
  onChange: (value: NewArrivalData) => void;
  errors?: Record<string, string>;
};

export default function NewArrivalForm({
  value,
  onChange,
  errors = {},
}: Props) {
  const update = <K extends keyof NewArrivalData>(
    field: K,
    fieldValue: NewArrivalData[K],
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          New Arrival Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Configure how this product will appear as a new arrival.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Badge Text */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Badge Text
          </label>

          <input
            type="text"
            value={value.badgeText ?? ""}
            onChange={(e) => update("badgeText", e.target.value)}
            placeholder="New Arrival"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.badgeText && (
            <p className="mt-1 text-xs text-red-500">
              {errors.badgeText}
            </p>
          )}
        </div>

        {/* Display Order */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Display Order
          </label>

          <input
            type="number"
            min="1"
            value={value.displayOrder ?? ""}
            onChange={(e) => {
              const rawValue = e.target.value;

              update(
                "displayOrder",
                rawValue,
              );
            }}
            placeholder="1"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.displayOrder && (
            <p className="mt-1 text-xs text-red-500">
              {errors.displayOrder}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            value={value.startDate ?? ""}
            onChange={(e) => update("startDate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startDate}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            value={value.endDate ?? ""}
            onChange={(e) => update("endDate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />

          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}