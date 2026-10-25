"use client";

import React from "react";

export interface MilkData {
  brand?: string;
  milkType?: string;
  source?: string;
  fatContent?: string;
  volume?: string;
  packaging?: string;
  pasteurized?: string;
  dietaryPreference?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: MilkData;
  onChange: (value: MilkData) => void;
}

export default function Milk({ value = {}, onChange }: Props) {
  const update = (key: keyof MilkData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Milk Information (দুধ তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this milk / dairy product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Milk Vita, Aarong Dairy, Pran, Farm Fresh" />
          <Select label="Milk Type" value={value.milkType} onChange={(v) => update("milkType", v)}
            options={["Liquid Milk (তরল দুধ)", "Powder Milk (গুঁড়ো দুধ)", "UHT Milk", "Condensed Milk", "Flavored Milk", "Evaporated Milk"]} />
          <Select label="Source" value={value.source} onChange={(v) => update("source", v)}
            options={["Cow Milk (গরুর দুধ)", "Buffalo Milk (মহিষের দুধ)", "Goat Milk", "Almond / Soy / Plant-based"]} />
          <Select label="Fat Content" value={value.fatContent} onChange={(v) => update("fatContent", v)}
            options={["Full Cream (৩.৫%+ ফ্যাট)", "Low Fat / Toned", "Skimmed / Double Toned", "Regular"]} />
          <Input label="Volume / Net Weight" value={value.volume} onChange={(v) => update("volume", v)} placeholder="e.g. 500ml, 1 Liter, 400g, 1kg" />
          <Select label="Packaging" value={value.packaging} onChange={(v) => update("packaging", v)}
            options={["Tetra Pak", "Poly Pouch", "Tin Container", "Bottle", "Plastic Jar"]} />
          <Select label="Pasteurized / Processed" value={value.pasteurized} onChange={(v) => update("pasteurized", v)}
            options={["Pasteurized", "UHT Processed", "Raw", "Homogenized"]} />
          <Select label="Dietary Preference" value={value.dietaryPreference} onChange={(v) => update("dietaryPreference", v)}
            options={["Vegetarian", "Halal Certified", "Lactose Free", "Organic"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Refrigerated (৪°C বা নিচে রাখুন)", "Room Temperature before opening", "Cool & Dry Place"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 3 Days (Fresh), 6 Months (UHT)" />
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
