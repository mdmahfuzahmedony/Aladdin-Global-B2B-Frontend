"use client";

import React from "react";

export interface PetFoodData {
  brand?: string;
  petType?: string;
  foodType?: string;
  flavor?: string;
  lifeStage?: string;
  netWeight?: string;
  packaging?: string;
  specialDiet?: string;
  shelfLife?: string;
  storageCondition?: string;
}

interface Props {
  value: PetFoodData;
  onChange: (value: PetFoodData) => void;
}

export default function PetFood({ value = {}, onChange }: Props) {
  const update = (key: keyof PetFoodData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Pet Care & Food Information (পোষা প্রাণীর খাদ্য তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this pet food or care product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Whiskas, Pedigree, Royal Canin, SmartHeart, Me-O" />
          <Select label="Pet Type" value={value.petType} onChange={(v) => update("petType", v)}
            options={["Cat (বিড়াল)", "Dog (কুকুর)", "Bird (পাখি)", "Fish (মাছ)", "Rabbit / Hamster", "Other"]} />
          <Select label="Food Type" value={value.foodType} onChange={(v) => update("foodType", v)}
            options={["Dry Kibble (শুকনো খাবার)", "Wet Food / Gravy Pouch (ভেজা খাবার)", "Canned Food", "Treats & Snacks", "Supplements / Healthcare"]} />
          <Input label="Flavor / Key Protein" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. Tuna, Salmon, Chicken, Beef, Ocean Fish" />
          <Select label="Life Stage" value={value.lifeStage} onChange={(v) => update("lifeStage", v)}
            options={["Kitten / Puppy (< 1 Year)", "Adult (১-৭ বছর)", "Senior (৭+ বছর)", "All Life Stages"]} />
          <Input label="Net Weight" value={value.netWeight} onChange={(v) => update("netWeight", v)} placeholder="e.g. 400g, 1.2kg, 3kg, 7kg, 85g pouch" />
          <Select label="Packaging" value={value.packaging} onChange={(v) => update("packaging", v)}
            options={["Resealable Bag", "Pouch", "Tin Can", "Box"]} />
          <Input label="Special Diet / Benefit" value={value.specialDiet} onChange={(v) => update("specialDiet", v)} placeholder="e.g. Hairball Control, Skin & Coat, Grain-Free, Urinary Care" />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Refrigerate wet food after opening", "Seal bag after use"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 18 Months, 24 Months" />
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
