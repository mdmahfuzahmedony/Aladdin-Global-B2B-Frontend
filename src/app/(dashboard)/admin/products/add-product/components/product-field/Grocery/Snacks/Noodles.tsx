"use client";

import React from "react";

export interface NoodlesData {
  brand?: string;
  noodleType?: string;
  flavor?: string;
  packCount?: string;
  netWeight?: string;
  packaging?: string;
  spiciness?: string;
  dietaryPreference?: string;
  cookingTime?: string;
  shelfLife?: string;
  storageCondition?: string;
}

interface Props {
  value: NoodlesData;
  onChange: (value: NoodlesData) => void;
}

export default function Noodles({ value = {}, onChange }: Props) {
  const update = (key: keyof NoodlesData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Noodles & Pasta Information (নুডলস ও পাস্তা তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this noodles or pasta product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Maggi, Doodles, Cocola, Knorr, Samyang, Barilla" />
          <Select label="Type" value={value.noodleType} onChange={(v) => update("noodleType", v)}
            options={["Instant Noodles (ইনস্ট্যান্ট নুডলস)", "Stick Noodles", "Egg Noodles", "Spaghetti / Pasta", "Macaroni", "Ramen", "Vermicelli / Semai", "Other"]} />
          <Input label="Flavor / Tastemaker" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. Chicken, Masala, Beef, Spicy Korean 2X, Vegetable, Cheese" />
          <Input label="Pack Count / Net Weight" value={value.netWeight} onChange={(v) => update("netWeight", v)} placeholder="e.g. 8 Pack (500g), Single Pack (65g)" />
          <Select label="Packaging" value={value.packaging} onChange={(v) => update("packaging", v)}
            options={["Packet Pouch", "Cup / Bowl (কাপ নুডলস)", "Family Multi-Pack", "Box"]} />
          <Select label="Spiciness Level" value={value.spiciness} onChange={(v) => update("spiciness", v)}
            options={["Mild / Non-Spicy", "Medium Spicy", "Extra Hot & Spicy", "Extreme (2X-3X Spicy)"]} />
          <Select label="Dietary Preference" value={value.dietaryPreference} onChange={(v) => update("dietaryPreference", v)}
            options={["Vegetarian", "Non-Vegetarian (Chicken/Beef flavor)", "Halal Certified", "Eggless"]} />
          <Input label="Cooking Time" value={value.cookingTime} onChange={(v) => update("cookingTime", v)} placeholder="e.g. 2-3 Minutes, 8-10 Minutes (Pasta)" />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Protect from moisture and pests"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 9 Months, 12 Months" />
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
