"use client";

import React from "react";

export interface EggData {
  brand?: string;
  eggType?: string;
  sourceType?: string;
  packSize?: string;
  packaging?: string;
  eggSize?: string;
  organic?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: EggData;
  onChange: (value: EggData) => void;
}

export default function Eggs({ value = {}, onChange }: Props) {
  const update = (key: keyof EggData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Eggs Information (ডিম তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this egg product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand / Farm" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Kazi Farms, Paragon, CP, Fresh Farm" />
          <Select label="Egg Type" value={value.eggType} onChange={(v) => update("eggType", v)}
            options={["Chicken Egg - Red / Brown (লাল ডিম)", "Chicken Egg - White (সাদা ডিম)", "Duck Egg (হাঁসের ডিম)", "Quail Egg (কোয়েল পাখির ডিম)", "Organic / Deshi Egg (দেশি ডিম)"]} />
          <Select label="Source Type" value={value.sourceType} onChange={(v) => update("sourceType", v)}
            options={["Farm Layer", "Free Range (উন্মুক্ত চারণ)", "Deshi / Native", "Organic Feed"]} />
          <Select label="Pack Count" value={value.packSize} onChange={(v) => update("packSize", v)}
            options={["4 Pieces", "6 Pieces", "12 Pieces (১ ডজন)", "24 Pieces", "30 Pieces (১ কেস / ট্রে)"]} />
          <Select label="Packaging" value={value.packaging} onChange={(v) => update("packaging", v)}
            options={["Paper Pulp Tray", "Plastic Casing", "Carton Box"]} />
          <Select label="Egg Size" value={value.eggSize} onChange={(v) => update("eggSize", v)}
            options={["Medium (মাঝারি)", "Large (বড়)", "Extra Large (বিশেষ বড়)", "Standard (সাধারণ)"]} />
          <Select label="Organic / Omega-3 Enriched" value={value.organic} onChange={(v) => update("organic", v)}
            options={["Standard (সাধারণ)", "Omega-3 Enriched", "Organic Certified"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Refrigerate at 4°C (ফ্রিজে রাখুন)", "Cool & Dry Place"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 15-21 Days refrigerated" />
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
