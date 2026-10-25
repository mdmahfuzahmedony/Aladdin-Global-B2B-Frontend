"use client";

import React from "react";

export interface ChipsData {
  brand?: string;
  chipType?: string;
  flavor?: string;
  netWeight?: string;
  packType?: string;
  dietaryPreference?: string;
  texture?: string;
  oilUsed?: string;
  shelfLife?: string;
  storageCondition?: string;
}

interface Props {
  value: ChipsData;
  onChange: (value: ChipsData) => void;
}

export default function Chips({ value = {}, onChange }: Props) {
  const update = (key: keyof ChipsData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Chips & Crisps Information (চিপস তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this chips or crisps product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Lay's, Kurkure, Pran, Bombay Sweets, Sun Chips, Pringles" />
          <Select label="Chip Type" value={value.chipType} onChange={(v) => update("chipType", v)}
            options={["Potato Chips (আলুর চিপস)", "Corn / Tortilla / Nachos", "Extruded Snacks (রিং / স্টিক)", "Banana Chips", "Papad / Crackers", "Puffed Rice Snacks", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. Classic Salted, Masala, Sour Cream & Onion, Chilli, Barbecue, Tomato" />
          <Input label="Net Weight" value={value.netWeight} onChange={(v) => update("netWeight", v)} placeholder="e.g. 25g, 50g, 100g, 150g" />
          <Select label="Packaging" value={value.packType} onChange={(v) => update("packType", v)}
            options={["Nitrogen Flushed Foil Pouch", "Canister / Tube (Pringles type)", "Standard Packet", "Party Pack"]} />
          <Select label="Dietary Preference" value={value.dietaryPreference} onChange={(v) => update("dietaryPreference", v)}
            options={["100% Vegetarian", "Halal Certified", "Gluten-Free", "Regular"]} />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Extra Crunchy", "Crispy", "Light & Airy"]} />
          <Select label="Cooking Method" value={value.oilUsed} onChange={(v) => update("oilUsed", v)}
            options={["Fried in Vegetable Oil", "Baked (কম তেল)", "Kettle Cooked", "Air Popped"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Consume immediately after opening for crispness"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 4 Months, 6 Months" />
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
