"use client";

import React from "react";

export interface WeightFieldsData {
  sellingMethod?: "weight";
  unit?: "g" | "kg";
  minimumQuantity?: number;
  maximumQuantity?: number;
  quantityStep?: number;
  isVariableWeight?: boolean;
}

interface WeightFieldsProps {
  value: WeightFieldsData;
  onChange: (value: WeightFieldsData) => void;
}

const UNIT_OPTIONS = [
  { value: "g", label: "Gram (g)" },
  { value: "kg", label: "Kilogram (kg)" },
];

export default function WeightFields({
  value,
  onChange,
}: WeightFieldsProps) {
  const update = (key: keyof WeightFieldsData, fieldValue: any) => {
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
            Weight & Quantity
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Configure products that are sold by weight.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Selling Unit"
            value={value.unit || ""}
            onChange={(e) => update("unit", e.target.value)}
          >
            <option value="">Select unit</option>

            {UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
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
            placeholder="e.g. 1"
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
            placeholder="e.g. 20"
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
            placeholder="e.g. 0.5"
          />
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={value.isVariableWeight ?? false}
              onChange={(e) =>
                update("isVariableWeight", e.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">
                Variable Weight Product
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Allow customers to choose a variable quantity.
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