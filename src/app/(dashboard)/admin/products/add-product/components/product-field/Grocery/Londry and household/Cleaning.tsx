"use client";

import React from "react";

export interface CleaningData {
  brand?: string;
  cleanerType?: string;
  form?: string;
  fragrance?: string;
  netVolume?: string;
  packaging?: string;
  suitableSurfaces?: string;
  safetyCaution?: string;
  shelfLife?: string;
  storageCondition?: string;
}

interface Props {
  value: CleaningData;
  onChange: (value: CleaningData) => void;
}

export default function Cleaning({ value = {}, onChange }: Props) {
  const update = (key: keyof CleaningData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Cleaning & Household Information (ক্লিনিং ও হাউসহোল্ড তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this cleaning and household care product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Harpic, Wheel, Surf Excel, Vim, Lizol, Mr. Brasso" />
          <Select label="Cleaner Type" value={value.cleanerType} onChange={(v) => update("cleanerType", v)}
            options={["Laundry Detergent (কাপড় ধোয়ার ডিটারজেন্ট)", "Dishwashing (বাসন মাজার সাবান/লিকুইড)", "Floor Cleaner (মেঝে পরিষ্কারক)", "Toilet / Bathroom Cleaner", "Glass Cleaner (কাঁচ পরিষ্কারক)", "Air Freshener", "Pest Control / Spray", "Tissue & Paper", "Other"]} />
          <Select label="Form" value={value.form} onChange={(v) => update("form", v)}
            options={["Powder (গুঁড়ো)", "Liquid (তরল)", "Bar / Cake (সাবান)", "Gel", "Spray / Aerosol", "Wipes / Sheets"]} />
          <Input label="Fragrance / Scent" value={value.fragrance} onChange={(v) => update("fragrance", v)} placeholder="e.g. Lemon, Lavender, Rose, Pine, Citrus, Unscented" />
          <Input label="Net Weight / Volume" value={value.netVolume} onChange={(v) => update("netVolume", v)} placeholder="e.g. 500ml, 1 Liter, 1kg, 2kg, 250g" />
          <Select label="Packaging" value={value.packaging} onChange={(v) => update("packaging", v)}
            options={["Bottle with Cap", "Trigger Spray Bottle", "Refill Pouch", "Cardboard Box", "Plastic Tub"]} />
          <Input label="Suitable Surfaces / Uses" value={value.suitableSurfaces} onChange={(v) => update("suitableSurfaces", v)} placeholder="e.g. Ceramic tiles, Utensils, Cotton & synthetic clothes, Marble" />
          <Input label="Safety Caution" value={value.safetyCaution} onChange={(v) => update("safetyCaution", v)} placeholder="e.g. Keep out of reach of children, Avoid contact with eyes" />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Keep bottle tightly closed", "Protect from freezing or extreme heat"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 24 Months, 36 Months" />
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
