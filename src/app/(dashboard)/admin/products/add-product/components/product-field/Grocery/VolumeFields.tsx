"use client";

import React from "react";

export interface VolumeFieldsData {
  sellingMethod?: "volume";
  unit?: "ml" | "L";
  minimumQuantity?: number;
  maximumQuantity?: number;
  quantityStep?: number;
  isVariableVolume?: boolean;
}

interface VolumeFieldsProps {
  value: VolumeFieldsData;
  onChange: (value: VolumeFieldsData) => void;
}

export default function VolumeFields({
  value,
  onChange,
}: VolumeFieldsProps) {
  const update = (key: keyof VolumeFieldsData, fieldValue: any) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            Volume & Quantity
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Configure products that are sold by volume.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Selling Unit"
            value={value.unit || ""}
            onChange={(e) => update("unit", e.target.value)}
          >
            <option value="">Select unit</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="L">Liter (L)</option>
          </Select>

          <Input
            label="Minimum Quantity"
            type="number"
            min="0"
            value={value.minimumQuantity ?? ""}
            onChange={(e) =>
              update(
                "minimumQuantity",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="e.g. 250"
          />

          <Input
            label="Maximum Quantity"
            type="number"
            min="0"
            value={value.maximumQuantity ?? ""}
            onChange={(e) =>
              update(
                "maximumQuantity",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="e.g. 5000"
          />

          <Input
            label="Quantity Step"
            type="number"
            min="0"
            value={value.quantityStep ?? ""}
            onChange={(e) =>
              update(
                "quantityStep",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="e.g. 500"
          />
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={value.isVariableVolume ?? false}
              onChange={(e) =>
                update("isVariableVolume", e.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">
                Variable Volume Product
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Allow customers to choose a variable volume.
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}

function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      >
        {children}
      </select>
    </div>
  );
}