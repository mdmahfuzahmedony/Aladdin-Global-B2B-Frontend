"use client";

import React from "react";

export interface TeaData {
  brand?: string;
  teaType?: string;
  teaForm?: string;
  flavor?: string;
  grade?: string;
  netWeight?: string;
  packType?: string;
  origin?: string;
  organic?: string;
  brewingTime?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: TeaData;
  onChange: (value: TeaData) => void;
}

export default function Tea({ value = {}, onChange }: Props) {
  const update = (key: keyof TeaData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Tea Information (চা তথ্য)</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this tea product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Brand" value={value.brand} onChange={(v) => update("brand", v)} placeholder="e.g. Ispahani, Taaza, Tetley, Finlay, Kazi & Kazi" />
          <Select label="Tea Type" value={value.teaType} onChange={(v) => update("teaType", v)}
            options={["Black Tea (কালো চা)", "Green Tea (সবুজ চা)", "CTC Tea", "Masala Chai", "Lemon Tea", "Ginger Tea", "Earl Grey", "Herbal / Jasmine", "Other"]} />
          <Select label="Form / Cut" value={value.teaForm} onChange={(v) => update("teaForm", v)}
            options={["Tea Bags (টি ব্যাগ)", "Loose Leaf (পাতার চা)", "Granules / Dust", "Ready Mix Powder"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. Natural, Cardamom, Lemon, Tulsi, Mint" />
          <Input label="Tea Grade" value={value.grade} onChange={(v) => update("grade", v)} placeholder="e.g. BOP, OF, PD, Dust, Pekoe" />
          <Input label="Net Weight / Bags" value={value.netWeight} onChange={(v) => update("netWeight", v)} placeholder="e.g. 200g, 400g, 50 Tea Bags" />
          <Select label="Packaging" value={value.packType} onChange={(v) => update("packType", v)}
            options={["Foil Pouch", "Paper Box", "Tin Can", "Jar"]} />
          <Input label="Origin (বাগান / অঞ্চল)" value={value.origin} onChange={(v) => update("origin", v)} placeholder="e.g. Sylhet, Sreemangal, Panchagarh, Assam" />
          <Select label="Organic Certified" value={value.organic} onChange={(v) => update("organic", v)}
            options={["No (সাধারণ)", "Yes (অর্গানিক)"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Store in a cool & dry place", "Keep in airtight tin after opening"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 12 Months, 24 Months" />
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
