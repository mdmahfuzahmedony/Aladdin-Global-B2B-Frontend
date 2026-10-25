"use client";

import React from "react";

export interface ToastData {
  brand?: string;
  toastType?: string;
  flavor?: string;
  netWeight?: string;
  packType?: string;
  sweetness?: string;
  texture?: string;
  dietaryPreference?: string;
  shelfLife?: string;
  storageCondition?: string;
}

interface Props {
  value: ToastData;
  onChange: (value: ToastData) => void;
}

export default function Toast({ value = {}, onChange }: Props) {
  const update = (key: keyof ToastData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Toast Information (টোস্ট তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this toast product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Olympic, Pran, Danish, All Time" />
          <Select label="Toast Type" value={value.toastType} onChange={(v) => update("toastType", v)}
            options={["Milk Toast", "Butter Toast", "Sugar Toast", "Rusk Toast", "Elaichi Toast", "Dry Cake Toast", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. Milk, Elaichi, Butter" />
          <Input label="Net Weight" value={value.netWeight} onChange={(v) => update("netWeight", v)} placeholder="e.g. 200g, 350g, 500g" />
          <Select label="Packaging Type" value={value.packType} onChange={(v) => update("packType", v)}
            options={["Packet", "Box", "Family Pack", "Jar"]} />
          <Select label="Sweetness" value={value.sweetness} onChange={(v) => update("sweetness", v)}
            options={["Regular Sweet", "Low Sugar", "Extra Sweet", "Sugar-Free"]} />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Super Crunchy", "Crispy", "Light & Crisp"]} />
          <Select label="Dietary Preference" value={value.dietaryPreference} onChange={(v) => update("dietaryPreference", v)}
            options={["Vegetarian", "Eggless", "Halal Certified", "Regular"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Keep in airtight container after opening"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 6 Months" />
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-slate-500" />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-slate-500">
        <option value="">Select {label}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
