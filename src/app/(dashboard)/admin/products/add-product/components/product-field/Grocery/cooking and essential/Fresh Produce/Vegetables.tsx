"use client";

import React from "react";

export interface VegetablesFieldsData {
  vegetableType?: string;
  variety?: string;
  color?: string;
  size?: string;
  freshness?: string;
  organic?: string;
  origin?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: VegetablesFieldsData;
  onChange: (value: VegetablesFieldsData) => void;
}

export default function VegetablesFields({ value, onChange }: Props) {
  const update = (key: keyof VegetablesFieldsData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">
          Vegetable Information
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Add vegetable-specific information.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Vegetable Type" value={value.vegetableType} onChange={(v) => update("vegetableType", v)}
            options={["Potato", "Tomato", "Onion", "Carrot", "Cucumber", "Brinjal", "Cauliflower", "Cabbage", "Other"]} />

          <Input label="Variety" value={value.variety} onChange={(v) => update("variety", v)} />

          <Input label="Color" value={value.color} onChange={(v) => update("color", v)} />

          <Select label="Size" value={value.size} onChange={(v) => update("size", v)}
            options={["Small", "Medium", "Large", "Extra Large"]} />

          <Select label="Freshness" value={value.freshness} onChange={(v) => update("freshness", v)}
            options={["Fresh", "Very Fresh", "Regular"]} />

          <Select label="Organic" value={value.organic} onChange={(v) => update("organic", v)}
            options={["Organic", "Non-Organic"]} />

          <Input label="Origin" value={value.origin} onChange={(v) => update("origin", v)} />

          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Cool & Dry"]} />

          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} />
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}